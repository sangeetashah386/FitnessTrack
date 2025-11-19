package com.fitness.userService.service.impl;

import com.fitness.userService.dto.ActivityRequest;
import com.fitness.userService.dto.ActivityResponse;
import com.fitness.userService.dto.RegisterRequest;
import com.fitness.userService.dto.UserResponse;
import com.fitness.userService.exception.ResourceNotFoundException;
import com.fitness.userService.mapper.UserMapper;
import com.fitness.userService.model.User;
import com.fitness.userService.repo.UserRepository;
import com.fitness.userService.service.UserService;
import com.fitness.userService.service.client.ActivityFeignClient;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository repository;
    private final UserMapper userMapper;
    private final ActivityFeignClient client;

    @Override
    public UserResponse register(RegisterRequest request) {
        log.info("Received registration request for email: {}, keycloakId: {}", request.getEmail(), request.getKeycloakId());

        if (request.getKeycloakId() == null || request.getKeycloakId().isBlank()) {
            log.error("Missing keycloakId for email: {}", request.getEmail());
            throw new IllegalArgumentException("Keycloak ID is required");
        }

         if (repository.existsByEmail(request.getEmail())){
        //     throw new RuntimeException("Email already exists");

        User existingUser = repository.findByEmail(request.getEmail());
             log.info("Returning existing user with ID: {}", existingUser.getId());

        UserResponse response = new UserResponse();
        response.setId(existingUser.getId());
        response.setFirstName(existingUser.getFirstName());
        response.setLastName(existingUser.getLastName());
        response.setKeycloakId(existingUser.getKeycloakId());
        response.setEmail(existingUser.getEmail());
        response.setPhone(existingUser.getPhone());
       // response.setPassword(existingUser.getPassword());
        response.setCreatedAt(existingUser.getCreatedAt());
        response.setUpdatedAt(existingUser.getUpdatedAt());
        return response;
    }
        log.info("Creating new user entity from request");
        User user = userMapper.toEntity(request);

        log.info("Saving new user to repository");
        User savedUser =repository.save(user);

        log.info("User successfully registered with ID: {}", savedUser.getId());
        return userMapper.toResponse(savedUser);
    }


    @Override
    public UserResponse getUserProfile(String userId) {
        User user =repository.findByKeycloakId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "keycloakId",userId));

        UserResponse response = userMapper.toResponse(user);
//        List<ActivityResponse> activities = client.getUserActivities(userId);
//        response.setActivities(activities);
//        return response;
        try {
            List<ActivityResponse> activities = client.getUserActivities(userId);

            if (activities == null) {
                log.warn("No activities returned for keycloakId: {}", userId);
                response.setActivities(Collections.emptyList());
            } else {
                response.setActivities(activities);
            }

            log.info("Fetched {} activities for user {}", response.getActivities().size(), userId);

        } catch (Exception e) {
            log.error(" Failed to fetch activities for {}: {}", userId, e.getMessage());
            // 🔹 Never break the response because of another service
            response.setActivities(Collections.emptyList());
        }

        return response;
    }

    @Override
    public Boolean existsByUserId(String userId) {
        log.info("Calling User Validation API for userId: {}", userId);
        return repository.existsByKeycloakId(userId.trim());
    }


}
