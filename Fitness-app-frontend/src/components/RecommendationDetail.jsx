import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getActivityRecommendation, deleteRecommendationByActivityId } from "../services/api";
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
        const res = await getActivityRecommendation(activityId);
        setRecommendation(res.data);
      } catch (error) {
        console.error("❌ Error fetching recommendation:", error);
      } finally {
        setLoading(false);
      }
    };

    if (activityId) fetchRecommendationDetail();
  }, [activityId]);

  const handleDeleteRecommendation = async () => {
    if (!window.confirm("Are you sure you want to delete this recommendation?")) return;

    try {
      const res = await deleteRecommendationByActivityId(activityId);
      alert(res.data); // Message from backend
      navigate("/recommendations"); // Go back to list page
    } catch (err) {
      console.error("❌ Failed to delete:", err);
      alert("Failed to delete recommendation.");
    }
  };

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
        <Typography color="error">No recommendation found.</Typography>
      </Box>
    );

  const extractText = (data) => {
    if (!data) return "";
    if (data.recommendation) return data.recommendation;
    if (data.description) return data.description;
    if (data.content) return data.content;
    if (data.text) return data.text;

    if (Array.isArray(data.candidates)) {
      const c = data.candidates[0];
      return (
        c?.content?.parts?.[0]?.text ||
        c?.content?.[0]?.text ||
        ""
      );
    }

    return "";
  };

  const mainText = extractText(recommendation);

  return (
    <Box sx={{ p: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Back
      </Button>

      <Paper elevation={4} sx={{ p: 4, borderRadius: "16px", backgroundColor: "#fafafa" }}>
        <Typography variant="h4" fontWeight="bold" mb={2} color="primary">
          AI Recommendation
        </Typography>

        <Typography variant="body1" mb={2} sx={{ whiteSpace: "pre-line" }}>
          {mainText || "No description available."}
        </Typography>

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

        {/* ⭐ DELETE BUTTON */}
        <Button
          variant="outlined"
          color="error"
          sx={{ mt: 3 }}
          onClick={handleDeleteRecommendation}
        >
          Delete Recommendation
        </Button>
      </Paper>
    </Box>
  );
};

export default RecommendationDetail;
