package com.fitness.userService.service;

import com.fitness.userService.dto.ActivityRequest;
import com.fitness.userService.dto.ActivityResponse;
import com.fitness.userService.dto.RegisterRequest;
import com.fitness.userService.dto.UserResponse;
import com.fitness.userService.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    UserResponse register(RegisterRequest request);

    UserResponse getUserProfile(String userId);

    Boolean existsByUserId(String userId);
}
