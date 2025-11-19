package com.fitness.nutritionService.mapper;

import com.fitness.nutritionService.dto.PlanRequest;
import com.fitness.nutritionService.dto.PlanResponse;
import com.fitness.nutritionService.model.Nutrition;
import org.springframework.stereotype.Component;

@Component
public class NutritionMapper {

    public Nutrition toEntity(PlanRequest request) {
        if (request == null) return null;

        Nutrition plan = new Nutrition();
        plan.setUserId(request.getUserId());
        plan.setGoal(request.getGoal());
        plan.setPrefs(request.getPrefs());
        plan.setDailyCalories(request.getDailyCalories());
        plan.setDailyMeals(request.getDailyMeals());
        plan.setRecommendations(request.getRecommendations());
        plan.setExtraData(request.getExtraData());
        plan.setAge(request.getAge());
        plan.setWeight(request.getWeight());
        plan.setHeight(request.getHeight());
        plan.setGender(request.getGender());
        plan.setActivityLevel(request.getActivityLevel());
        // createdAt/updatedAt are handled by Mongo auditing
        return plan;
    }

    public PlanResponse toResponse(Nutrition plan) {
        if (plan == null) return null;

        PlanResponse response = new PlanResponse();
        response.setId(plan.getId());
        response.setUserId(plan.getUserId());
        response.setGoal(plan.getGoal());
        response.setPrefs(plan.getPrefs());
        response.setDailyCalories(plan.getDailyCalories());
        response.setDailyMeals(plan.getDailyMeals());
        response.setRecommendations(plan.getRecommendations());
        response.setExtraData(plan.getExtraData());
        response.setCreatedAt(plan.getCreatedAt());
        response.setUpdatedAt(plan.getUpdatedAt());
        response.setAge(plan.getAge());
        response.setWeight(plan.getWeight());
        response.setHeight(plan.getHeight());
        response.setGender(plan.getGender());
        response.setActivityLevel(plan.getActivityLevel());
        return response;
    }


}
