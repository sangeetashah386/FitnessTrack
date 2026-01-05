package com.fitness.recommendationService.events;

import com.fitness.recommendationService.repo.RecommendationRepository;
import com.fitness.recommendationService.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ActivityDeletedListener {

    private final RecommendationService recommendationService;

    @RabbitListener(queues = "${rabbitmq.delete.queue}")
    public void onActivityDeleted(ActivityDeletedEvent event) {

        log.info("Received delete event for activityId {}", event.getActivityId());

        recommendationService.deleteByActivityId(event.getActivityId());

        log.info("Deleted recommendations for activityId {}", event.getActivityId());
    }
}
