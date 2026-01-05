package com.fitness.gateway.user;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserResponse {

    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String keycloakId;
    private String phone;
 //   private String password;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
