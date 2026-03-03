package com.fitness.nutritionService.model;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "nutrition_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Nutrition {

    @Id
    private String id;
    @NotBlank
    private String userId;
    private String goal;                 // lose-weight, gain-muscle, maintain
    private Map<String, String> prefs;   // e.g. vegetarian:true, allergies:peanut
    private Double dailyCalories;
    private List<String> dailyMeals;     // textual meal plan
    private List<String> recommendations;// recommendations from recommendation-service



    private Map<String, Object> extraData;
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
