package com.fitness.nutritionService.dto;

import com.fitness.nutritionService.model.Nutrition;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlanResponse {
    private String id;
    private String userId;
    private String goal;
    private Map<String, String> prefs;
    private Double dailyCalories;
    private List<String> dailyMeals;
    private List<String> recommendations;
    private Map<String, Object> extraData;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
