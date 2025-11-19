package com.fitness.recommendationService.service;

import com.fitness.recommendationService.model.Activity;
import com.fitness.recommendationService.model.Recommendation;
import com.fitness.recommendationService.repo.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {

    private final ActivityRecommendationService recommendationService;
    private final RecommendationRepository recommendationRepository;


    @RabbitListener(queues = "activity.queue")
    public void processActivity(Activity activity){
        log.info("Received activity for processing: {}", activity.getId());

        Recommendation recommendation = recommendationService.generateRecommendation(activity);
        log.info("Generate Recommendation: {}", recommendationService.generateRecommendation(activity));
        recommendationRepository.save(recommendation);

    }
}
