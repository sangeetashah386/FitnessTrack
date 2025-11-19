package com.fitness.nutritionService.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.nutritionService.model.Nutrition;
import com.fitness.nutritionService.model.NutritionRecommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class AiRecommendationsService {

    private final GeminiService geminiService;

    public NutritionRecommendation generateRecommendation(Nutrition nutrition) {
        String prompt = createPromptForNutrition(nutrition);
        String aiResponse = geminiService.getAnswer(prompt);
        log.info("RESPONSE FROM AI: {}", aiResponse);

        return processAiResponse(nutrition, aiResponse);
    }

    /**
     * Process the AI response and extract structured data
     */
    private NutritionRecommendation processAiResponse(Nutrition nutrition, String aiResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponse);

            // Extract the text content from Gemini response
            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            // Clean up the JSON content
            String jsonContent = textNode.asText()
                    .replaceAll("```json\\n", "")
                    .replaceAll("\\n```", "")
                    .trim();

            log.info("PARSED RESPONSE FROM AI: {}", jsonContent);

            JsonNode nutritionJson = mapper.readTree(jsonContent);

            // Extract summary
            String summary = nutritionJson.path("summary").asText();

            // Extract suggested calories
            Double suggestedCalories = nutritionJson.path("suggestedCalories").asDouble(nutrition.getDailyCalories());

            // Extract daily meals
            List<String> dailyMeals = extractDailyMeals(nutritionJson.path("dailyMeals"));

            // Extract suggested meals (meal ideas/alternatives)
            List<String> suggestedMeals = extractSuggestedMeals(nutritionJson.path("suggestedMeals"));

            // Extract AI recommendations (insights from Gemini)
            List<String> aiRecommendations = extractAiRecommendations(nutritionJson.path("recommendations"));

            // Extract safety guidelines
            List<String> safetyGuidelines = extractSafetyGuidelines(nutritionJson.path("safetyGuidelines"));

            return NutritionRecommendation.builder()
                    .nutritionId(nutrition.getId())
                    .userId(nutrition.getUserId())
                    .goal(nutrition.getGoal())
                    .suggestedCalories(suggestedCalories)
                    .dailyMeals(dailyMeals)
                    .suggestedMeals(suggestedMeals)
                    .aiRecommendations(aiRecommendations)
                    .safetyGuidelines(safetyGuidelines)
                    .summary(summary)
                    .createdAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            log.error("Failed to parse nutrition AI response", e);
            return createDefaultRecommendation(nutrition);
        }
    }

    /**
     * Create default recommendation if AI parsing fails
     */
    private NutritionRecommendation createDefaultRecommendation(Nutrition nutrition) {
        return NutritionRecommendation.builder()
                .nutritionId(nutrition.getId())
                .userId(nutrition.getUserId())
                .goal(nutrition.getGoal())
                .suggestedCalories(nutrition.getDailyCalories())
                .summary("Default nutrition plan: Eat a balanced diet with adequate protein, complex carbohydrates, and healthy fats.")
                .dailyMeals(Arrays.asList(
                        "Breakfast: Oatmeal with fruits and nuts (400 cal)",
                        "Lunch: Grilled chicken salad with quinoa (550 cal)",
                        "Snack: Greek yogurt with berries (200 cal)",
                        "Dinner: Baked salmon with vegetables and brown rice (650 cal)"
                ))
                .suggestedMeals(Arrays.asList(
                        "Alternative Breakfast: Scrambled eggs with whole wheat toast",
                        "Alternative Lunch: Turkey wrap with vegetables",
                        "Alternative Dinner: Grilled tofu stir-fry with brown rice"
                ))
                .aiRecommendations(Arrays.asList(
                        "Stay hydrated - drink at least 8 glasses of water daily",
                        "Eat whole, unprocessed foods whenever possible",
                        "Include protein in every meal to maintain satiety",
                        "Plan your meals ahead to avoid unhealthy choices"
                ))
                .safetyGuidelines(Arrays.asList(
                        "Consult a healthcare provider before major dietary changes",
                        "Monitor your calorie intake carefully",
                        "Don't drastically reduce calories - aim for gradual changes",
                        "Listen to your body and adjust as needed"
                ))
                .createdAt(LocalDateTime.now())
                .build();
    }

    /**
     * Extract daily meals from JSON
     */
    private List<String> extractDailyMeals(JsonNode mealsNode) {
        List<String> meals = new ArrayList<>();
        if (mealsNode.isArray()) {
            mealsNode.forEach(meal -> {
                String mealName = meal.path("meal").asText();
                String description = meal.path("description").asText();
                String calories = meal.path("calories").asText();
                meals.add(String.format("%s: %s (%s cal)", mealName, description, calories));
            });
        }
        return meals.isEmpty()
                ? Collections.singletonList("No meal plan provided")
                : meals;
    }

    /**
     * Extract suggested meals (alternatives/meal ideas)
     */
    private List<String> extractSuggestedMeals(JsonNode suggestedNode) {
        List<String> suggested = new ArrayList<>();
        if (suggestedNode.isArray()) {
            suggestedNode.forEach(meal -> {
                String mealType = meal.path("type").asText();
                String suggestion = meal.path("suggestion").asText();
                suggested.add(String.format("%s: %s", mealType, suggestion));
            });
        }
        return suggested.isEmpty()
                ? Collections.singletonList("No alternative meal suggestions provided")
                : suggested;
    }

    /**
     * Extract AI recommendations (insights from Gemini)
     */
    private List<String> extractAiRecommendations(JsonNode recommendationsNode) {
        List<String> recommendations = new ArrayList<>();
        if (recommendationsNode.isArray()) {
            recommendationsNode.forEach(rec -> recommendations.add(rec.asText()));
        }
        return recommendations.isEmpty()
                ? Collections.singletonList("Follow general nutrition guidelines")
                : recommendations;
    }

    /**
     * Extract safety guidelines
     */
    private List<String> extractSafetyGuidelines(JsonNode safetyNode) {
        List<String> safety = new ArrayList<>();
        if (safetyNode.isArray()) {
            safetyNode.forEach(guideline -> safety.add(guideline.asText()));
        }
        return safety.isEmpty()
                ? Collections.singletonList("Consult a healthcare provider for personalized advice")
                : safety;
    }

    /**
     * Create the AI prompt for nutrition recommendations
     */
    private String createPromptForNutrition(Nutrition nutrition) {
        return String.format("""
        Analyze this nutrition profile and provide a detailed meal plan in the following EXACT JSON format:
        {
            "summary": "Brief overview of the nutrition strategy and approach",
            "suggestedCalories": 2000,
            "dailyMeals": [
                {
                    "meal": "Breakfast",
                    "description": "Detailed meal description with ingredients",
                    "calories": "400"
                },
                {
                    "meal": "Lunch",
                    "description": "Detailed meal description with ingredients",
                    "calories": "550"
                },
                {
                    "meal": "Snack",
                    "description": "Detailed snack description",
                    "calories": "200"
                },
                {
                    "meal": "Dinner",
                    "description": "Detailed meal description with ingredients",
                    "calories": "650"
                }
            ],
            "suggestedMeals": [
                {
                    "type": "Alternative Breakfast",
                    "suggestion": "Detailed alternative meal idea"
                },
                {
                    "type": "Alternative Lunch",
                    "suggestion": "Detailed alternative meal idea"
                },
                {
                    "type": "Alternative Dinner",
                    "suggestion": "Detailed alternative meal idea"
                }
            ],
            "recommendations": [
                "Practical nutritional insight 1",
                "Practical nutritional insight 2",
                "Practical nutritional insight 3",
                "Practical nutritional insight 4"
            ],
            "safetyGuidelines": [
                "Important safety consideration 1",
                "Important safety consideration 2",
                "Important safety consideration 3"
            ]
        }
        
        Analyze this nutrition profile:
        User ID: %s
        Goal: %s
        Daily Calorie Target: %.0f
        Dietary Preferences: %s
        
        Provide a detailed, personalized meal plan that:
        1. Meets or is close to the daily calorie target
        2. Aligns with the user's goal (%s)
        3. Respects dietary preferences and restrictions
        4. Includes balanced macronutrients
        5. Provides practical, actionable advice
        6. Suggests alternative meal options for variety
        7. Includes important safety considerations
        
        Ensure the response follows the EXACT JSON format shown above.
        """,
                nutrition.getUserId(),
                nutrition.getGoal(),
                nutrition.getDailyCalories(),
                nutrition.getPrefs() != null ? nutrition.getPrefs().toString() : "None specified",
                nutrition.getGoal()
        );
    }
}
