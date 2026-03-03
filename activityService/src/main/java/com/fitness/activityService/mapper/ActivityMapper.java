package com.fitness.activityService.mapper;

import com.fitness.activityService.dto.ActivityRequest;
import com.fitness.activityService.dto.ActivityResponse;
import com.fitness.activityService.model.Activity;
import org.springframework.stereotype.Component;

@Component
public class ActivityMapper {

    public Activity toEntity(ActivityRequest request){
        Activity activity = new Activity();
        activity.setUserId(request.getUserId());
        activity.setType(request.getType());

        activity.setDistance(request.getDistance());
        activity.setAverageHeartRate(request.getAverageHeartRate());
       // activity.setDuration(request.getDuration());
        activity.setCaloriesBurned(request.getCaloriesBurned());
        activity.setStartTime(request.getStartTime());
        activity.setEndTime(request.getEndTime());

        activity.setAdditionalMetrics(request.getAdditionalMetrics());
        return activity;
    }

    public ActivityResponse toResponse(Activity activity) {
        ActivityResponse response = new ActivityResponse();
        response.setId(activity.getId());
        response.setUserId(activity.getUserId());
        response.setType(activity.getType());
        response.setDistance(activity.getDistance());
        response.setDuration(activity.getDuration());
        response.setPace(activity.getPace());
        response.setAverageHeartRate(activity.getAverageHeartRate());
        response.setCaloriesBurned(activity.getCaloriesBurned());
        response.setStartTime(activity.getStartTime());
        response.setEndTime(activity.getEndTime());
        response.setAdditionalMetrics(activity.getAdditionalMetrics());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());
        return response;
    }
}
