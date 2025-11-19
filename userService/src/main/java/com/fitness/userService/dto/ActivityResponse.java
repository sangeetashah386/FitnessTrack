package com.fitness.userService.dto;

import com.fitness.userService.model.ActivityType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ActivityResponse {
    private Long id;
    private String userId;
    private ActivityType type;
    private Integer duration;
    private Integer caloriesBurned;
    private LocalDateTime startTime;
    private Map<String, String> additionalMetrics;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
