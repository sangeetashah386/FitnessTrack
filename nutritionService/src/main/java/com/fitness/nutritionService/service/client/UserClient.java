package com.fitness.nutritionService.service.client;

import com.fitness.nutritionService.dto.UserResponse;
import com.fitness.nutritionService.exception.ResourceNotFoundException;
import com.fitness.nutritionService.exception.UserServiceException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Component
@RequiredArgsConstructor
public class UserClient {

    private final WebClient userServiceWebClient;

    public UserResponse getUserById(String userId) {
        try {
            return userServiceWebClient.get()
                    .uri("/{id}", userId)  // baseUrl already set in config
                    .retrieve()
                    .bodyToMono(UserResponse.class)
                    .block();
        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                throw new ResourceNotFoundException("User not found: " + userId);
            } else if (e.getStatusCode().is5xxServerError()) {
                throw new UserServiceException("User Service error: " + e.getMessage());
            } else {
                throw new RuntimeException("Unexpected error: " + e.getMessage());
            }
        }
    }



}
