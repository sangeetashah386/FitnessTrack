package com.fitness.activityService.dto;

import com.fitness.activityService.model.ActivityType;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ActivityResponse {

    private Long id;
    private String userId;
    private ActivityType type;
    private Double distance;
    private Integer duration;
    private Double pace;
    private Integer averageHeartRate;
    private Integer caloriesBurned;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Map<String, String> additionalMetrics;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
