package com.fitness.recommendationService.controller;

import com.fitness.recommendationService.model.Recommendation;
import com.fitness.recommendationService.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recommendations")
public class RecommendationController {
    private final RecommendationService recommendationService;

    @GetMapping("/user/{userId}")
    private ResponseEntity<List<Recommendation>> getUserRecommendation(@PathVariable String userId){
        return ResponseEntity.ok(recommendationService.getUserRecommendation(userId));

    }

    @GetMapping("/activity/{activityId}")
    private ResponseEntity<Recommendation> getActivityRecommendation(@PathVariable Long activityId){
        return ResponseEntity.ok(recommendationService.getActivityRecommendation(activityId));

    }

    @DeleteMapping("/activity/{activityId}")
    public ResponseEntity<String> deleteByActivity(@PathVariable Long activityId) {
        recommendationService.deleteByActivityId(activityId);
        return ResponseEntity.ok("Recommendation deleted successfully for activity: " + activityId);
    }

}
