package com.fitness.recommendationService.events;

import lombok.Data;

@Data
public class ActivityDeletedEvent {
    private Long activityId;
}
