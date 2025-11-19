package com.fitness.nutritionService.mapper;

import com.fitness.nutritionService.dto.RecommendationResponse;
import com.fitness.nutritionService.model.NutritionRecommendation;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class RecommendationMapper {

    public RecommendationResponse toResponse(NutritionRecommendation recommendation) {
        if (recommendation == null) {
            return null;
        }

        return RecommendationResponse.builder()
                .id(recommendation.getId())
                .nutritionId(recommendation.getNutritionId())
                .userId(recommendation.getUserId())
                .goal(recommendation.getGoal())
                .suggestedCalories(recommendation.getSuggestedCalories())
                .dailyMeals(
                        recommendation.getDailyMeals() != null
                                ? recommendation.getDailyMeals()
                                : Collections.emptyList()
                )
                .suggestedMeals(
                        recommendation.getSuggestedMeals() != null
                                ? recommendation.getSuggestedMeals()
                                : Collections.emptyList()
                )
                .aiRecommendations(
                        recommendation.getAiRecommendations() != null
                                ? recommendation.getAiRecommendations()
                                : Collections.emptyList()
                )
                .safetyGuidelines(
                        recommendation.getSafetyGuidelines() != null
                                ? recommendation.getSafetyGuidelines()
                                : Collections.emptyList()
                )
                .summary(recommendation.getSummary())
                .createdAt(recommendation.getCreatedAt())
                .build();
    }

    public List<RecommendationResponse> toResponseList(List<NutritionRecommendation> recommendations) {
        if (recommendations == null || recommendations.isEmpty()) {
            return null;
        }

        return recommendations.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

}
