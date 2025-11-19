package com.fitness.nutritionService.repo;

import com.fitness.nutritionService.model.Nutrition;
import com.fitness.nutritionService.model.NutritionRecommendation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NutritionRecommendationRepository extends MongoRepository<NutritionRecommendation, String> {
    List<NutritionRecommendation> findByUserIdOrderByCreatedAtDesc(String userId);
    void deleteAllByNutritionId(String nutritionId);

}
