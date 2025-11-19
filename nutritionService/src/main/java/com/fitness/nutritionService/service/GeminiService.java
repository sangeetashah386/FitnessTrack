package com.fitness.nutritionService.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;

@Service
@Slf4j
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    @Value("${gemini.api.key}")
    private String geminiApiKey;


    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = WebClient.builder().build();
    }

    public String getAnswer(String question) {
        try {
            log.debug("Sending request to Gemini API");
            Map<String, Object> requestBody = Map.of(
                    "contents", new Object[]{
                            Map.of("parts", new Object[]{
                                    Map.of("text", question)
                            })
                    }
            );

            String response = webClient.post()
                    .uri(geminiApiUrl + geminiApiKey)
                    .header("Content-Type", "application/json")
                    //.header("Authorization", "Bearer " + geminiApiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            log.debug("Received response from Gemini API");
            return response;
        } catch (WebClientResponseException e) {
            log.error("Gemini API error - Status: {}, Response: {}",
                    e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to get response from Gemini API: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error calling Gemini API", e);
            throw new RuntimeException("Failed to call Gemini API: " + e.getMessage(), e);
        }
    }
}
