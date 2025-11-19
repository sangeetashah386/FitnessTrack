package com.fitness.recommendationService.service.impl;

import com.fitness.recommendationService.model.Recommendation;
import com.fitness.recommendationService.repo.RecommendationRepository;
import com.fitness.recommendationService.service.RecommendationService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final RecommendationRepository repository;

    @Override
    public List<Recommendation> getUserRecommendation(String userId){
        return repository.findByUserId(userId);
    }

    @Override
    public Recommendation getActivityRecommendation(Long activityId) {
        return repository.findByActivityId(activityId)
             .orElseThrow(()-> new RuntimeException("No recommendation found for this activity: "+activityId));
    }

}
