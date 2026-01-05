package com.fitness.recommendationService.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.Map;

@Service
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    @Value("${gemini.api.key}")
    private String geminiApiKey;


    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = WebClient.builder().build();
    }

    public String getAnswer(String question){
        Map<String, Object> requestBody = Map.of(
               "contents", new Object[]{
                       Map.of("parts",new Object[]{
                               Map.of("text", question)
                               })
                }
        );

        String response = webClient.post()
//                .uri(uriBuilder -> uriBuilder
//                        .path(geminiApiUrl)
//                        .queryParam("key", geminiApiKey)
//                        .build()
//                )
                .uri(geminiApiUrl + geminiApiKey)
                .header("Content-Type", "application/json")
                //.header("Authorization", "Bearer " + geminiApiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .retryWhen( Retry.backoff(3, Duration.ofSeconds(2)) .filter(ex -> ex instanceof WebClientResponseException.TooManyRequests) )
                .block();
        return response;
    }
}
