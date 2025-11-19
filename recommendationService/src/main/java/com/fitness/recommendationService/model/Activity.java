package com.fitness.recommendationService.model;


import lombok.Data;


import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;


@Data
public class Activity {

    private Long id;
    private String userId;
    private String type;
    private Integer duration;
    private Integer caloriesBurned;
    private LocalDateTime startTime;
    private Map<String, Object> additionalMetrics = new HashMap<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
