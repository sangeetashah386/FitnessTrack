package com.fitness.nutritionService.controller;

import com.fitness.nutritionService.dto.RecommendationResponse;
import com.fitness.nutritionService.exception.ResourceNotFoundException;
import com.fitness.nutritionService.mapper.RecommendationMapper;
import com.fitness.nutritionService.model.Nutrition;
import com.fitness.nutritionService.model.NutritionRecommendation;
import com.fitness.nutritionService.repo.NutritionPlanRepository;
import com.fitness.nutritionService.service.AiRecommendationsService;
import com.fitness.nutritionService.service.NutritionRecommendationService;
import com.fitness.nutritionService.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/nutritionRecommendations")
@RequiredArgsConstructor
@Slf4j
public class NutritionRecommendationController {

    private final NutritionRecommendationService recommendationService;
    private final NutritionPlanRepository nutritionPlanRepository;
    private final RecommendationMapper mapper;

      // Get all AI nutrition recommendations for a specific user

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecommendationResponse>> getByUser(@PathVariable String userId) {
        log.info("Fetching AI nutrition recommendations for userId: {}", userId);
        List<NutritionRecommendation> list = recommendationService.getByUserId(userId);
        return ResponseEntity.ok(mapper.toResponseList(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecommendationResponse> getById(@PathVariable String id) {
        log.info("Fetching AI nutrition recommendation by id: {}", id);
        NutritionRecommendation rec = recommendationService.getById(id);
        return ResponseEntity.ok(mapper.toResponse(rec));
    }


    @PostMapping("/generate/{nutritionId}")
    public ResponseEntity<RecommendationResponse> generate(@PathVariable String nutritionId) {
        log.info("Manually generating AI recommendation for nutritionId: {}", nutritionId);

        // Validate that the nutrition plan exists
        Nutrition nutrition = nutritionPlanRepository.findById(nutritionId)
                .orElseThrow(() -> new ResourceNotFoundException("Nutrition plan not found with id: " + nutritionId));

        //  Generate AI-based recommendation instantly
        NutritionRecommendation rec = recommendationService.generateNow(nutrition);
        log.info(" AI recommendation generated successfully with id: {}", rec.getId());

        return ResponseEntity.ok(mapper.toResponse(rec));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteById(@PathVariable String id) {
        log.info("Deleting AI recommendation with id: {}", id);
        recommendationService.deleteById(id);
        return ResponseEntity.ok("Recommendation deleted successfully with id: " + id);
    }

    /**
     * 🔹 Delete all recommendations linked to a nutrition plan
     */
    @DeleteMapping("/nutrition/{nutritionId}")
    public ResponseEntity<String> deleteByNutritionId(@PathVariable String nutritionId) {
        log.info("Deleting all AI recommendations for nutritionId: {}", nutritionId);
        recommendationService.deleteByNutritionId(nutritionId);
        return ResponseEntity.ok("All recommendations deleted for nutritionId: " + nutritionId);
    }
}
