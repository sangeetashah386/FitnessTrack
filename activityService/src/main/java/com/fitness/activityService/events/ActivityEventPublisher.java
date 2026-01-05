package com.fitness.activityService.events;

import com.fitness.activityService.config.RabbitMqConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityEventPublisher {
    private final RabbitTemplate rabbitTemplate;

    public void publishActivityDeleted(Long activityId) {
        ActivityDeletedEvent event = new ActivityDeletedEvent(activityId);

        rabbitTemplate.convertAndSend(
                RabbitMqConfig.ACTIVITY_EXCHANGE,
                RabbitMqConfig.ACTIVITY_DELETED_ROUTING_KEY,
                event
        );
    }
}
