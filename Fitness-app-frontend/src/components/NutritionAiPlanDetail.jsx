/// src/components/NutritionAiPlanDetail.jsx
// src/pages/NutritionAiPlanDetail.jsx

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Alert,
  Divider
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import DeleteIcon from "@mui/icons-material/Delete";

import { useNavigate, useParams } from "react-router";

import {
  getAiNutritionRecommendationById,
  regenerateAiNutritionRecommendation,
  deleteAiRecommendation
} from "../services/api";

const NutritionAiPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rec, setRec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenLoading, setRegenLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchDetail = useCallback(async () => {
    try {
      const res = await getAiNutritionRecommendationById(id);
      setRec(res.data);
    } catch {
      setError("Failed to load details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleRegenerate = async () => {
    if (!rec?.nutritionId) return;
    setRegenLoading(true);

    try {
      await regenerateAiNutritionRecommendation(rec.nutritionId);
      setSuccess("Updated successfully!");
      setTimeout(fetchDetail, 3000);
    } catch {
      setError("Failed to regenerate.");
    } finally {
      setRegenLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAiRecommendation(rec.id);
      navigate("/nutrition/ai");
    } catch {
      setError("Failed to delete.");
    }
  };

  if (loading)
    return <Box textAlign="center" mt={10}><CircularProgress /></Box>;

  if (!rec)
    return <Typography>No data found.</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
        Back
      </Button>

      <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
        🍽️ AI Nutrition Plan
      </Typography>

      <Typography variant="subtitle2">
        {rec.goal} — {rec.suggestedCalories} kcal/day
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>

        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 3, mt: 3 }}>
        {/* SUMMARY */}
        <Typography variant="h6">🧠 Summary</Typography>
        <Typography sx={{ whiteSpace: "pre-line" }}>{rec.summary}</Typography>

        <Divider sx={{ my: 2 }} />

        {/* DAILY MEALS */}
        {rec.dailyMeals?.length > 0 && (
          <>
            <Typography variant="h6">🍽️ Daily Meals</Typography>
            <ul>
              {rec.dailyMeals.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* SUGGESTED MEALS */}
        {rec.suggestedMeals?.length > 0 && (
          <>
            <Typography variant="h6">🍛 Suggested Meals</Typography>
            <ul>
              {rec.suggestedMeals.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* AI RECOMMENDATIONS */}
        {rec.aiRecommendations?.length > 0 && (
          <>
            <Typography variant="h6">💡 AI Recommendations</Typography>
            <ul>
              {rec.aiRecommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* SAFETY GUIDELINES */}
        {rec.safetyGuidelines?.length > 0 && (
          <>
            <Typography variant="h6">⚠ Safety Guidelines</Typography>
            <ul>
              {rec.safetyGuidelines.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default NutritionAiPlanDetail;
