package com.fitness.recommendationService.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.recommendationService.model.Activity;
import com.fitness.recommendationService.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityRecommendationService {
    private final GeminiService geminiService;

    public Recommendation generateRecommendation(Activity activity){
        try {
            String prompt = createPromptForActivity(activity);
            String aiResponse = geminiService.getAnswer(prompt);
            log.info("RESPONSE FROM AI: {} ", aiResponse);

            return processAiResponse(activity, aiResponse);
        }catch(Exception e){
            log.error("Failed to generate recommendation for activity {}", activity.getId(), e);
            return createDefaultRecommendation(activity);
        }

    }

    private Recommendation processAiResponse(Activity activity, String aiResponse ){
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponse);

            JsonNode textNode = rootNode
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String jsonContent = textNode.asText()
                    .replaceAll("```json\\n","")
                    .replaceAll("\\n```","")
                    .trim();

          //  log.info(" PARSED RESPONSE FROM AI: {} ", jsonContent);

            JsonNode analysisJson = mapper.readTree(jsonContent);
            JsonNode analysisNode = analysisJson.path("analysis");

            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall:");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace:");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "HeartRate:");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "CaloriesBurned:");

            List<String> improvements = extractImprovements(analysisJson.path("improvements"));

            List<String> suggestions = extractSuggestions(analysisJson.path("suggestions"));

            List<String> safety = extractSafetyGuidlines(analysisJson.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(String.valueOf(activity.getUserId()))
                    .activityType(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    .createdAt(LocalDateTime.now())
                    .build();
        }catch(Exception e){
            e.printStackTrace();
            return createDefaultRecommendation(activity);
        }
    }

    private Recommendation createDefaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(String.valueOf(activity.getUserId()))
                .activityType(activity.getType())
                .recommendation("Unable to generate detailed analysis")
                .improvements(Collections.singletonList("Continue with your current routine"))
                .suggestions(Collections.singletonList("Consider consulting a fitness professional"))
                .safety(Arrays.asList(
                        "Always warm up before exercise",
                        "Stay hydrated",
                        "Listen to your body"
                ))
                .createdAt(LocalDateTime.now())
                .build();
    }

    private List<String> extractSafetyGuidlines(JsonNode safetyNode) {
        List<String> safety = new ArrayList<>();
        if (safetyNode.isArray()) {
            safetyNode.forEach(item -> safety.add(item.asText()));

        }
        return safety.isEmpty() ?
                Collections.singletonList("Follow general safety guidlines") :
                safety;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String > suggestions = new ArrayList<>();
        if (suggestionsNode.isArray()){
            suggestionsNode.forEach(suggestion ->{
                String workout = suggestion.path("workout").asText();
                String description= suggestion.path("description").asText();
                suggestions.add(String.format("%s: %s", workout,description));
            });
        }
        return suggestions.isEmpty()?
                Collections.singletonList("No specific suggestions provided"):
                suggestions;

    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String > improvements = new ArrayList<>();
        if(improvementsNode.isArray()){
            improvementsNode.forEach(improvement -> {
                String area = improvement.path("area").asText();
                String detail = improvement.path("recommendation").asText();
                improvements.add(String.format("%s: %s", area,detail));

            });
        }
        return improvements.isEmpty()?
                Collections.singletonList("No specific improvements provided"):
                improvements;

    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if(!analysisNode.path(key).isMissingNode()){
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
                        Analyze this fitness activity and provide detailed recommendation in the following EXACT JSON format:
                        {
                            "analysis":{
                                "overall": "Overall analysis here",
                                "pace": "Pace analysis here",
                                "heartRate": "Heart rate analysis here",
                                "caloriesBurned": "Calories analysis here"
                            },
                            "improvements": [
                            {
                                "area": "Area name",
                                "recommendation": "Detailed recommendation"
                            }
                            ],
                            "suggestions":[
                            {
                                "workout": "Workout name",
                                "description": "Detailed workout description"
                            }],
                            "safety": [
                            "Safety point 1",
                            "Safety point 2"
                            ]
                        }  
                        Analyze this activity:
                        Activity Type: %s
                        Duration: %d minutes
                        Distance: %.2f km
                        Pace: %.2f min/km
                        Average Heart Rate: %d bpm
                        Calories Burned: %d
                        Additional Metrics: %s
                                
                        IMPORTANT:
                        - Return ONLY valid JSON
                        - Do NOT include markdown
                        - Do NOT include explanation text
                        - Do NOT wrap in ```json
                                
                        provide detailed analysis focusing on performance, improvements,next workout suggestions and safety guidlines.
                        Ensure the response follows the EXACT JSON format shown above.
                                """,
                activity.getType(),
                activity.getDuration() != null ? activity.getDuration() : 0,
                activity.getDistance() != null ? activity.getDistance() : 0.0,
                activity.getPace() != null ? activity.getPace() : 0.0,
                activity.getAverageHeartRate() != null ? activity.getAverageHeartRate() : 0,
                activity.getCaloriesBurned() != null ? activity.getCaloriesBurned() : 0,
                activity.getAdditionalMetrics() != null ? activity.getAdditionalMetrics() : "None"
                );
    }
}
