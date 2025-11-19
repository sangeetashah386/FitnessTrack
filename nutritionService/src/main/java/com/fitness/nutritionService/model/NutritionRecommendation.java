package com.fitness.nutritionService.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@Document(collection = "nutrition_recommendations")
public class NutritionRecommendation {

    @Id
    private String id;
    private String nutritionId;
    private String userId;
    private String goal;
    private Double suggestedCalories;
    private List<String> dailyMeals;
    private List<String> suggestedMeals;
    private List<String> aiRecommendations;  // insights from Gemini
    private List<String> safetyGuidelines;
    private String summary;

    @CreatedDate
    private LocalDateTime createdAt;
}
