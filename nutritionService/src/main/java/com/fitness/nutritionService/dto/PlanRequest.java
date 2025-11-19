package com.fitness.nutritionService.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class PlanRequest {
    @NotBlank
    private String userId;
    @NotBlank
    private String goal;

    //optional health metrics
    private Integer age;
    private Double weight;
    private Double height;
    private String gender;
    private String activityLevel;


    private Map<String, String> prefs;
    private Double dailyCalories;
    private List<String> dailyMeals;
    private List<String> recommendations;
    private Map<String, Object> extraData;
}
