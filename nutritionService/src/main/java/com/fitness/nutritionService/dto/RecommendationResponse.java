package com.fitness.nutritionService.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecommendationResponse {
    private String id;

    private String nutritionId;

    private String userId;

    private String goal;

    private Double suggestedCalories;

    private List<String> dailyMeals;

    private List<String> suggestedMeals;

    private List<String> aiRecommendations;

    private List<String> safetyGuidelines;

    private String summary;

    private LocalDateTime createdAt;
}
