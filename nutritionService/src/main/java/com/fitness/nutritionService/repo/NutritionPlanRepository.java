package com.fitness.nutritionService.repo;

import com.fitness.nutritionService.model.Nutrition;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NutritionPlanRepository extends MongoRepository<Nutrition, String> {
    List<Nutrition> findByUserId(String userId);
    Optional<Nutrition> findFirstByUserIdOrderByCreatedAtDesc(String userId);

}

