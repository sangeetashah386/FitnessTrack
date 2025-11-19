package com.fitness.activityService.service;

import com.fitness.activityService.dto.ActivityRequest;
import com.fitness.activityService.dto.ActivityResponse;
import com.fitness.activityService.model.Activity;

import java.util.List;

public interface ActivityService {
     ActivityResponse trackActivity(ActivityRequest request);

     List<ActivityResponse> getUserActivities(String userId);

     ActivityResponse getActivityById(Long activityId);
}
