package com.fitness.activityService.dto;

import com.fitness.activityService.model.ActivityType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ActivityRequest {

    private String userId;
    private ActivityType type;
    private Double distance;
    private Integer averageHeartRate;
   // private Integer duration;
    private Integer caloriesBurned;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Map<String, String> additionalMetrics;
}
