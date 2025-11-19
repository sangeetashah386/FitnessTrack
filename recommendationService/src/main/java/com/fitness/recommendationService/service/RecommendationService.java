package com.fitness.recommendationService.service;

import com.fitness.recommendationService.model.Recommendation;

import java.util.List;

public interface RecommendationService {
     List<Recommendation> getUserRecommendation(String userId);
     Recommendation getActivityRecommendation(Long activityId);
}
