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
    private Double distance;
    private Integer duration;
    private Double pace;
    private Integer caloriesBurned;
    private Integer averageHeartRate;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Map<String, Object> additionalMetrics = new HashMap<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
