package com.fitness.activityService.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String password;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
