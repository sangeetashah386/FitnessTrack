package com.fitness.nutritionService.service.impl;

import com.fitness.nutritionService.dto.PlanRequest;
import com.fitness.nutritionService.dto.PlanResponse;
import com.fitness.nutritionService.dto.UserResponse;
import com.fitness.nutritionService.exception.ResourceNotFoundException;
import com.fitness.nutritionService.mapper.NutritionMapper;
import com.fitness.nutritionService.model.Nutrition;
import com.fitness.nutritionService.repo.NutritionPlanRepository;
import com.fitness.nutritionService.service.NutritionRecommendationService;
import com.fitness.nutritionService.service.NutritionService;
import com.fitness.nutritionService.service.client.ActivityClient;
import com.fitness.nutritionService.service.client.UserClient;
import com.fitness.nutritionService.exception.UserServiceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class NutritionServiceImpl implements NutritionService {

    private final NutritionPlanRepository repo;
    private final NutritionMapper mapper;
    private final UserClient userClient;
    private final ActivityClient activityClient;
    private final NutritionRecommendationService recommendationService; // <— New direct service call

    @Override
    @Transactional
    public PlanResponse create(PlanRequest req) {
        log.info("Creating nutrition plan for userId: {}", req.getUserId());

        // Validate user
        UserResponse user;
        try {
            user = userClient.getUserById(req.getUserId());
        } catch (UserServiceException ex) {
            log.error("User validation failed for userId: {}", req.getUserId());
            throw new ResourceNotFoundException(ex.getMessage());
        }

        // Calculate calories if not provided
        if (req.getDailyCalories() == null) {
            throw new IllegalArgumentException("dailyCalories must be provided for a nutrition plan");
        }

        //  Map and save nutrition plan
        Nutrition plan = mapper.toEntity(req);
        Nutrition savedPlan = repo.save(plan);
        log.info(" Nutrition plan saved successfully: {}", savedPlan.getId());

        //  Immediately trigger AI recommendation (no RabbitMQ)
        try {
            recommendationService.generateNow(savedPlan);
            log.info(" AI recommendation generated for nutritionId: {}", savedPlan.getId());
        } catch (Exception e) {
            log.error(" Failed to generate AI recommendation for nutritionId: {} — {}",
                    savedPlan.getId(), e.getMessage());
        }

        return mapper.toResponse(savedPlan);
    }

    @Override
    @Transactional
    public PlanResponse update(String id, PlanRequest req) {
        log.info("Updating nutrition plan with id: {}", id);

        Nutrition existing = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nutrition plan not found with id: " + id));

        existing.setGoal(req.getGoal());
        existing.setPrefs(req.getPrefs());
        existing.setDailyCalories(req.getDailyCalories());
        existing.setDailyMeals(req.getDailyMeals());
        existing.setRecommendations(req.getRecommendations());
        existing.setExtraData(req.getExtraData());
        existing.setUpdatedAt(LocalDateTime.now());

        Nutrition updated = repo.save(existing);
        log.info("✅ Nutrition plan updated successfully: {}", updated.getId());

        // ✅ Automatically regenerate AI recommendation after update
        try {
            recommendationService.generateNow(updated);
            log.info("🤖 AI recommendation regenerated for nutritionId: {}", updated.getId());
        } catch (Exception e) {
            log.warn("⚠️ Could not regenerate AI recommendation: {}", e.getMessage());
        }

        return mapper.toResponse(updated);
    }

    @Override
    public PlanResponse getById(String id) {
        log.debug("Fetching nutrition plan with id: {}", id);
        Nutrition plan = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nutrition plan not found with id: " + id));
        return mapper.toResponse(plan);
    }

    @Override
    public List<PlanResponse> getByUser(String userId) {
        List<Nutrition> plans = repo.findByUserId(userId);
        if (plans.isEmpty()) {
            throw new ResourceNotFoundException("No nutrition plans found for userId: " + userId);
        }
        return plans.stream().map(mapper::toResponse).toList();
    }

    @Override
    public List<PlanResponse> getAll() {
        log.info("Fetching all nutrition plans");
        List<Nutrition> plans = repo.findAll();
        log.info("Found {} total nutrition plans", plans.size());
        return plans.stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional
    public void delete(String id) {
        log.info("Deleting nutrition plan with id: {}", id);
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Nutrition plan not found with id: " + id);
        }
        try {
            recommendationService.deleteByNutritionId(id);
            log.info("🗑️ Deleted all recommendations for nutritionId: {}", id);
        } catch (Exception e) {
            log.warn("⚠️ Failed to delete recommendations for nutritionId {}: {}", id, e.getMessage());
        }
        repo.deleteById(id);
        log.info("🗑️ Successfully deleted nutrition plan with id: {}", id);
    }


}
