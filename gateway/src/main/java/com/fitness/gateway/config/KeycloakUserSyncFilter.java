package com.fitness.gateway.config;

import com.fitness.gateway.user.RegisterRequest;
import com.fitness.gateway.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
@Component
@Slf4j
@RequiredArgsConstructor
public class KeycloakUserSyncFilter implements WebFilter {
    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain){
        String path = exchange.getRequest().getURI().getPath();

        if (!path.startsWith("/api/")) {
            return chain.filter(exchange);
        }


        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-ID");
        RegisterRequest registerRequest = getUserDetails(token);

        if (registerRequest == null) {
            log.error("Failed to extract user details from token. Skipping user sync.");
            return chain.filter(exchange); // gracefully continue without syncing
        }
//
        if(userId == null){
            userId = registerRequest.getKeycloakId();
        }

        if(userId!=null && token != null) {
            String finalUserId = userId;
            return userService.validateUser(userId)
                    .doOnError(e -> log.error("User validation failed: {}", e.getMessage()))
                    .onErrorResume(e -> Mono.empty())
                    .flatMap(exist -> {
                        if (!exist) {
                            //Register User
                            log.info("User not found. Registering new user: {}", registerRequest.getEmail());
                            if (registerRequest != null) {
                                log.info("RegisterRequest before sending: {}", registerRequest);
                                return userService.registerUser(registerRequest)
                                        .doOnError(e -> log.error("User registration failed: {}", e.getMessage()))
                                        .onErrorResume(e -> Mono.empty())
                                        .then(Mono.empty());
                            } else {
                                log.info("User already exists. Skipping registration.");
                                return Mono.empty();
                            }

                        } else {
                            log.info("User already exist, Skipping sync. ");
                            return Mono.empty();
                        }

                    })
                    .then(Mono.defer(() -> {
                        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                .header("X-User-ID", finalUserId)
                                .build();
                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    }));
        }

        return chain.filter(exchange);
    }


    private RegisterRequest getUserDetails(String token) {
        if (token == null || token.isBlank()) {
            log.warn("Authorization token is missing. Skipping user sync.");
            return null;
        }
        try{
            String tokenWithoutBearer = token.replace("Bearer ","").trim();
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();


            RegisterRequest registerRequest = new RegisterRequest();
            registerRequest.setFirstName(claims.getStringClaim("given_name"));
            registerRequest.setLastName(claims.getStringClaim("family_name"));
            registerRequest.setEmail(claims.getStringClaim("email"));
            registerRequest.setKeycloakId(claims.getStringClaim("sub"));
            log.info("Extracted sub (keycloakId): {}", claims.getStringClaim("sub"));

            String phone = claims.getStringClaim("phone_number");
            registerRequest.setPhone(phone != null && !phone.isBlank() ? phone : "0000000000");
            // registerRequest.setPassword(claims.getStringClaim("password"));
            return registerRequest;



        }catch(Exception e){
            log.error("Error parsing token: {}", e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

}


