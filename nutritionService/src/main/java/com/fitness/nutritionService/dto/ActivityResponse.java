package com.fitness.nutritionService.dto;


import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ActivityResponse {

    private Long id;
    private String userId;
    private Integer duration;
    private Integer caloriesBurned;
    private LocalDateTime startTime;
    private Map<String, String> additionalMetrics;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
