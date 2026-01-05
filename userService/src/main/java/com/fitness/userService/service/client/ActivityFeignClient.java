package com.fitness.userService.service.client;


import com.fitness.userService.dto.ActivityRequest;
import com.fitness.userService.dto.ActivityResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Lazy
@FeignClient(name="activity-service",path="/api/activities")
public interface ActivityFeignClient {

//    @GetMapping(value ="/user/{userId}",consumes="application/json")
//    List<ActivityResponse> getUserActivities(@PathVariable String userId);

    @GetMapping("/user/{userId}")
    List<ActivityResponse> getUserActivities(@PathVariable("userId") String userId);
}



