package com.fitness.nutritionService.service.client;

import com.fitness.nutritionService.dto.ActivityResponse;
import com.fitness.nutritionService.exception.ActivityServiceException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ActivityClient {

    private final WebClient activityServiceWebClient;

    public ActivityResponse getActivityById(String activityId) {
        try {
            return activityServiceWebClient.get()
                    .uri("/{id}" + activityId)  // baseUrl already set in WebClientConfig
                    .retrieve()
                    .bodyToMono(ActivityResponse.class)
                    .block();
        } catch (WebClientResponseException.NotFound e) {
            throw new ActivityServiceException("Activity not found with id: " + activityId);
        } catch (Exception e) {
            throw new ActivityServiceException("Failed to connect to Activity Service: " + e.getMessage());
        }
    }

    /**
     * Fetch all activities of a given user
     */
    public List<ActivityResponse> getActivitiesByUserId(String userId) {
        try {
            ActivityResponse[] response = activityServiceWebClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/user/{userId}")
                            .build(userId))  // relative path
                    .retrieve()
                    .bodyToMono(ActivityResponse[].class)
                    .block();

            return response != null ? Arrays.asList(response) : List.of();
        } catch (WebClientResponseException.NotFound e) {
            throw new ActivityServiceException("No activities found for userId: " + userId);
        } catch (Exception e) {
            throw new ActivityServiceException("Failed to fetch activities for userId: " + userId + " -> " + e.getMessage());
        }
    }
}
