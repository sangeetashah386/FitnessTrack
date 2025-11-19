package com.fitness.activityService.controller;

import com.fitness.activityService.dto.ActivityRequest;
import com.fitness.activityService.dto.ActivityResponse;
import com.fitness.activityService.service.ActivityService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@AllArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    public ResponseEntity<ActivityResponse> trackActivity(@RequestBody ActivityRequest request, @RequestHeader(value ="X-User-ID",required = false) String userId){
        if(userId != null){
            request.setUserId(userId);
        }
        return ResponseEntity.ok(activityService.trackActivity(request));

    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ActivityResponse>> getUserActivities(@PathVariable String userId){
        return ResponseEntity.ok(activityService.getUserActivities(userId));

    }
    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> getActivitiy(@PathVariable Long activityId){
        return ResponseEntity.ok(activityService.getActivityById(activityId));

    }
}
