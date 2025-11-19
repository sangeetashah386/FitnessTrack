package com.fitness.activityService.config;

import com.fitness.activityService.dto.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name="USER-SERVICE", path="/api/users")
public interface UserFeignClient {

    @GetMapping("/{userId}")
    UserResponse getUserById(@PathVariable("userId") String userId);

    @GetMapping("/{userId}/validate")
    Boolean validateUser(@PathVariable String userId);

}
