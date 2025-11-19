package com.fitness.nutritionService.service;

import com.fitness.nutritionService.dto.PlanRequest;
import com.fitness.nutritionService.dto.PlanResponse;

import java.util.List;

public interface NutritionService {
    PlanResponse create(PlanRequest req);
    PlanResponse update(String id, PlanRequest req);
    PlanResponse getById(String id);
    List<PlanResponse> getByUser(String userId);
    List<PlanResponse> getAll();
    void delete(String id);
}
