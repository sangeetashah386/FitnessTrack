package com.fitness.userService.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotEmpty(message = "Name cannot be null or empty")
    @Size(min = 2,max = 30,message = "The length of customer name should be between 5 and 30")
    private String firstName;
    private String lastName;

    @NotEmpty(message="Email is required")
    @Email(message="Invalid email format")
    private String email;

    //@NotEmpty(message = "Keycloak ID is required")
    private String keycloakId;

    @NotEmpty(message = "Phone cannot be null or empty")
    @Pattern(regexp = "($|[0-9]{10})",message = "Phone number must be 10 digits")
    private String phone;

//    @NotEmpty(message="Password is required")
//    @Size(min=6, message="Password must have atleast of 6 characters")
//    private String password;

}
