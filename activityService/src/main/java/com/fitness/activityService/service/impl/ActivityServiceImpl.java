package com.fitness.activityService.service.impl;

import com.fitness.activityService.config.UserFeignClient;
import com.fitness.activityService.dto.ActivityRequest;
import com.fitness.activityService.dto.ActivityResponse;
import com.fitness.activityService.events.ActivityDeletedEvent;
import com.fitness.activityService.events.ActivityEventPublisher;
import com.fitness.activityService.exception.InvalidUserException;
import com.fitness.activityService.mapper.ActivityMapper;
import com.fitness.activityService.model.Activity;
import com.fitness.activityService.repo.ActivityRepository;
import com.fitness.activityService.service.ActivityService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityServiceImpl implements ActivityService {

    private final ActivityRepository repository;
    private final ActivityMapper activityMapper;
    private final UserFeignClient client;
    private final RabbitTemplate rabbitTemplate;
    private final ActivityEventPublisher publisher;

    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    @Value("${rabbitmq.routing.key}")
    private String routingKey;

    @Value("${rabbitmq.delete.routing.key}")
    private String deleteRoutingKey;


    @Override
    public ActivityResponse trackActivity(ActivityRequest request) {
//        try {
//            client.getUserById((request.getUserId()));
//        } catch (Exception e) {
//            throw new InvalidUserException(request.getUserId());
//        }
        try {
        boolean isValidUser = client.validateUser(request.getUserId()).getBody();
        if (!isValidUser) {
            throw new InvalidUserException("Invalid User ID: " + request.getUserId());
        }
        }catch (Exception e) {
           throw new InvalidUserException(request.getUserId());
        }

        Activity activity = activityMapper.toEntity(request);
        Activity savedActivity =repository.save(activity);

        //Publish to RabbitMQ for AI Processing
        try{
            rabbitTemplate.convertAndSend(exchange,routingKey,savedActivity);
        }catch(Exception e){
            log.error("failed to publish activity to RabbitMQ: ", e);
        }

        return activityMapper.toResponse(savedActivity);
    }

    @Override
    public List<ActivityResponse> getUserActivities(String userId) {
       List<Activity> activities= repository.findByUserId(userId);
       return activities.stream()
               .map(activityMapper::toResponse)
               .collect(Collectors.toList());
    }

    @Override
    public ActivityResponse getActivityById(Long activityId) {
        return repository.findById(activityId)
                .map(activityMapper::toResponse)
                .orElseThrow(() ->new RuntimeException("Activity not found with id: " + activityId));

    }

    @Override
    public void deleteActivity(Long activityId) {
        Activity activity = repository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + activityId));

        // Delete from DB
        repository.delete(activity);

        log.info("Deleted activity with id {}", activityId);

        //Publish delete event to RabbitMQ
        try {
            ActivityDeletedEvent event = new ActivityDeletedEvent(activityId);

            rabbitTemplate.convertAndSend(exchange, deleteRoutingKey, event);

            log.info("Published delete event for activity {}", activityId);

        } catch (Exception e) {
            log.error("Failed to publish delete event", e);
        }
    }




}
