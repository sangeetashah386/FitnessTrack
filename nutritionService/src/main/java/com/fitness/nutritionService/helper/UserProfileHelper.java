package com.fitness.nutritionService.helper;

import com.fitness.nutritionService.dto.UserResponse;
import com.fitness.nutritionService.model.Nutrition;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
@Slf4j
public class UserProfileHelper {

    private static final int DEFAULT_AGE = 30;
    private static final double DEFAULT_WEIGHT_KG = 70.0;
    private static final double DEFAULT_HEIGHT_CM = 170.0;
    private static final String DEFAULT_GENDER = "male";
    private static final String DEFAULT_ACTIVITY_LEVEL = "moderate";

    public Map<String, Object> createUserProfile(UserResponse user, Nutrition nutrition) {
        Map<String, Object> profile = new HashMap<>();

        int age = nutrition.getAge() != null ? nutrition.getAge() : DEFAULT_AGE;
        double weight = nutrition.getWeight() != null ? nutrition.getWeight() : DEFAULT_WEIGHT_KG;
        double height = nutrition.getHeight() != null ? nutrition.getHeight() : DEFAULT_HEIGHT_CM;
        String gender = nutrition.getGender() != null ? nutrition.getGender() : DEFAULT_GENDER;
        String activity = nutrition.getActivityLevel() != null ? nutrition.getActivityLevel() : DEFAULT_ACTIVITY_LEVEL;

        profile.put("userId", user.getId());
        profile.put("firstName", Optional.ofNullable(user.getFirstName()).orElse("User"));
        profile.put("email", user.getEmail());
        profile.put("age", age);
        profile.put("weight", weight);
        profile.put("height", height);
        profile.put("gender", gender);
        profile.put("activityLevel", activity);
        return profile;
    }

    public double calculateBMR(double weight, double height, int age, String gender) {
        if ("male".equalsIgnoreCase(gender)) {
            return 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            return 10 * weight + 6.25 * height - 5 * age - 161;
        }
    }

    public double calculateTDEE(double bmr, String activityLevel) {
        double multiplier = getActivityMultiplier(activityLevel);
        return bmr * multiplier;
    }

    public double calculateDailyCalories(double tdee, String goal) {
        return switch (goal.toLowerCase()) {
            case "lose-weight" -> tdee - 500;  // 500 cal deficit
            case "gain-muscle" -> tdee + 300;  // 300 cal surplus
            case "maintain" -> tdee;
            default -> tdee;
        };
    }

    private double getActivityMultiplier(String activityLevel) {
        if (activityLevel == null) return 1.2;

        return switch (activityLevel.toLowerCase()) {
            case "sedentary" -> 1.2;
            case "light" -> 1.375;
            case "moderate" -> 1.55;
            case "active" -> 1.725;
            case "very-active" -> 1.9;
            default -> 1.2;
        };
    }

    public double calculateDefaultCalories(String goal) {
        // Calculate using default values
        double bmr = calculateBMR(DEFAULT_WEIGHT_KG, DEFAULT_HEIGHT_CM, DEFAULT_AGE, DEFAULT_GENDER);
        double tdee = calculateTDEE(bmr, DEFAULT_ACTIVITY_LEVEL);
        return calculateDailyCalories(tdee, goal);
    }

    public double getProteinRecommendation(String goal) {
        return switch (goal.toLowerCase()) {
            case "lose-weight" -> 2.0;  // Higher protein to preserve muscle
            case "gain-muscle" -> 2.2;  // Maximum for muscle building
            case "maintain" -> 1.6;     // Standard recommendation
            default -> 1.6;
        };
    }




    }
