import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getActivityRecommendation } from "../services/api";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const RecommendationDetail = () => {
  const { activityId } = useParams();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendationDetail = async () => {
      try {
        console.log("📡 Fetching recommendation for activity:", activityId);
        const res = await getActivityRecommendation(activityId);
        console.log("✅ Raw API response:", res.data);

        // 👇 Store entire object (we’ll extract fields safely below)
        setRecommendation(res.data);
      } catch (error) {
        console.error("❌ Error fetching recommendation:", error);
      } finally {
        setLoading(false);
      }
    };

    if (activityId) fetchRecommendationDetail();
  }, [activityId]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (!recommendation)
    return (
      <Box sx={{ p: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Back
        </Button>
        <Typography color="error">No recommendation data found.</Typography>
      </Box>
    );

  // 🧠 Flexible extractor for Gemini & flat responses
  const extractText = (data) => {
    if (!data) return "";
    if (data.recommendation) return data.recommendation;
    if (data.description) return data.description;
    if (data.content) return data.content;
    if (data.text) return data.text;
    if (Array.isArray(data.candidates)) {
      const candidate = data.candidates[0];
      return (
        candidate?.content?.parts?.[0]?.text ||
        candidate?.content?.[0]?.text ||
        ""
      );
    }
    if (data.parts) return data.parts[0]?.text;
    return "";
  };

  const mainText = extractText(recommendation);

  return (
    <Box sx={{ p: 4 }}>
      {/* 🔙 Back button */}
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Back
      </Button>

      <Paper elevation={4} sx={{ p: 4, borderRadius: "16px", backgroundColor: "#fafafa" }}>
        <Typography variant="h4" fontWeight="bold" mb={2} color="primary">
          AI Recommendation
        </Typography>

        <Typography variant="body1" mb={2} sx={{ whiteSpace: "pre-line" }}>
          {mainText || "No detailed description provided by Gemini API."}
        </Typography>

        {/* Optional extra fields */}
        {recommendation.improvements && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" fontWeight="bold">Improvements</Typography>
            <Typography color="text.secondary">
              {Array.isArray(recommendation.improvements)
                ? recommendation.improvements.join(", ")
                : recommendation.improvements}
            </Typography>
          </>
        )}

        {recommendation.suggestions && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" fontWeight="bold">Suggestions</Typography>
            <Typography color="text.secondary">
              {Array.isArray(recommendation.suggestions)
                ? recommendation.suggestions.join(", ")
                : recommendation.suggestions}
            </Typography>
          </>
        )}

        {recommendation.safety && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" fontWeight="bold">Safety Tips</Typography>
            <Typography color="text.secondary">
              {Array.isArray(recommendation.safety)
                ? recommendation.safety.join(", ")
                : recommendation.safety}
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default RecommendationDetail;
