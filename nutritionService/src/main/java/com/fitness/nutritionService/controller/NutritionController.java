package com.fitness.nutritionService.controller;

import com.fitness.nutritionService.dto.PlanRequest;
import com.fitness.nutritionService.dto.PlanResponse;
import com.fitness.nutritionService.service.NutritionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nutrition")
@RequiredArgsConstructor
public class NutritionController {
    private final NutritionService nutritionService;

    @PostMapping("/create")
    public ResponseEntity<PlanResponse> createPlan(@Valid @RequestBody PlanRequest request ) {

        PlanResponse response = nutritionService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanResponse> getPlanById(@PathVariable String id) {
        PlanResponse response = nutritionService.getById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<PlanResponse>> getPlansByUserId(@PathVariable String userId) {
        List<PlanResponse> responses = nutritionService.getByUser(userId);
        return ResponseEntity.ok(responses);
    }
    @GetMapping("/all")
    public ResponseEntity<List<PlanResponse>> getAllPlans() {
        List<PlanResponse> responses = nutritionService.getAll();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanResponse> updatePlan(
            @PathVariable String id,
            @Valid @RequestBody PlanRequest request) {
        PlanResponse response = nutritionService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable String id) {
        nutritionService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
