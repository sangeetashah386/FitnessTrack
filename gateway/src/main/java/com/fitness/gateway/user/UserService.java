package com.fitness.gateway.user;

import com.fitness.gateway.exception.DownstreamServiceException;
import com.fitness.gateway.exception.MyClientErrorException;
import com.fitness.gateway.exception.UserNotFoundException;
import jakarta.ws.rs.ClientErrorException;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final WebClient userServiceWebClient;

    public Mono<Boolean> validateUser(String userId){
        log.info("Calling User Validation API for userId: {}", userId);

            return userServiceWebClient.get()
                    .uri("/api/users/{userId}/validate", userId)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .onErrorResume(WebClientResponseException.class, e -> {
                        if (e.getStatusCode() == HttpStatus.NOT_FOUND)
                            return Mono.error(new RuntimeException("User Not Found: " + userId));
                        else if (e.getStatusCode() == HttpStatus.BAD_REQUEST)
                            return Mono.error(new RuntimeException("INVALID REQUEST: " + userId));
                        return Mono.error(new RuntimeException("Unexpected error" + e.getMessage()));


                    });

    }


    public Mono<UserResponse> registerUser(RegisterRequest request) {
        try {
            log.info("Received registration request for email: {}, keycloakId: {}", request.getEmail(), request.getKeycloakId());
            log.info("Calling User Registration API for email: {}", request.getEmail());
            return userServiceWebClient.post()
                    .uri("/api/users/register")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(UserResponse.class)
                    .onErrorResume(WebClientResponseException.class, e -> {
                        if (e.getStatusCode() == HttpStatus.BAD_REQUEST)
                            return Mono.error(new RuntimeException("Bad Request: " + e.getMessage()));
                        else if (e.getStatusCode() == HttpStatus.INTERNAL_SERVER_ERROR)
                            return Mono.error(new RuntimeException("Internal Server Error: " + e.getMessage()));
                        return Mono.error(new RuntimeException("Unexpected error" + e.getMessage()));

                    });
        }catch(Exception ex){
            log.error("Exception thrown before WebClient execution: {}", ex.getMessage(), ex);
            return Mono.error(new RuntimeException("Exception during registration: " + ex.getMessage()));
        }

    }
}

