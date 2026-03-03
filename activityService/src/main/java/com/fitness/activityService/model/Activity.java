package com.fitness.activityService.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Data
@Table(name="activities")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userId;
    @Enumerated(EnumType.STRING)
    private ActivityType type;

    private Double distance;

    private Integer duration;
    private Double pace;
    private Integer averageHeartRate;
    private Integer caloriesBurned;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @ElementCollection
    @CollectionTable(
            name = "activity_metrics",
            joinColumns = @JoinColumn(name = "activity_id")
    )
    @MapKeyColumn(name = "metric_key")
    @Column(name = "metric_value")
    private Map<String, String> additionalMetrics = new HashMap<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
