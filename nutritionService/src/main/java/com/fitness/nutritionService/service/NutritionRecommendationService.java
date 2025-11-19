package com.fitness.nutritionService.service;

import com.fitness.nutritionService.exception.ResourceNotFoundException;
import com.fitness.nutritionService.model.Nutrition;
import com.fitness.nutritionService.model.NutritionRecommendation;
import com.fitness.nutritionService.repo.NutritionRecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NutritionRecommendationService {
    private final NutritionRecommendationRepository repository;
    private final AiRecommendationsService aiService;

    public List<NutritionRecommendation> getByUserId(String userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public NutritionRecommendation getById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recommendation not found: " + id));
    }


    @Transactional
    public NutritionRecommendation generateNow(Nutrition nutrition) {
        log.info(" Generating AI recommendation for userId={}, nutritionId={}",
                nutrition.getUserId(), nutrition.getId());

        try {
            //  Step 1 — Ask Gemini through AiRecommendationsService
            NutritionRecommendation rec = aiService.generateRecommendation(nutrition);

            //  Step 2 — Save to MongoDB
            NutritionRecommendation saved = repository.save(rec);
            log.info(" AI recommendation saved successfully with ID: {}", saved.getId());
            return saved;

        } catch (Exception e) {
            log.error(" AI generation failed: {}", e.getMessage(), e);
            throw new RuntimeException("AI generation failed: " + e.getMessage());
        }
    }

    public void deleteById(String id) {
        repository.deleteById(id);
        log.info("Deleted recommendation with ID: {}", id);
    }

    public void deleteByNutritionId(String nutritionId) {
        repository.deleteAllByNutritionId(nutritionId);
        log.info("Deleted all recommendations for nutritionId: {}", nutritionId);
    }
}
