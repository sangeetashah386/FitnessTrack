import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { getActivityRecommendations } from "../services/api";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";

const RecommendationService = () => {
  const userId = useSelector((state) => state.auth.userId);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔁 Fetch all recommendations for a user
  const fetchRecommendations = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await getActivityRecommendations(userId);
      let recs = [];
      if (Array.isArray(res?.data)) {
        recs = res.data;
      } else if (Array.isArray(res?.data?.recommendations)) {
        recs = res.data.recommendations;
      }

      setRecommendations(recs);
      console.log("✅ AI Recommendations:", recs);
    } catch (error) {
      console.error("❌ Error fetching recommendations:", error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return (
    <Box sx={{ p: 4 }}>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/dashboard")}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={2}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          Back
        </Button>
        <Typography variant="h4" fontWeight="bold">
          AI Activity Recommendations
        </Typography>
      </Box>

      {/* Refresh Button */}
      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={fetchRecommendations}
        sx={{ mb: 3 }}
      >
        Regenerate AI Recommendations
      </Button>

      {/* Content */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <Grid item xs={12} sm={6} md={4} key={rec.activityId || rec.id || index}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    mb: 2,
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: 6,
                    },
                  }}
                  onClick={() =>
                    (rec.activityId || rec.id) &&
                    navigate(`/recommendations/${rec.activityId || rec.id}`)
                  }
                >
                  {/* ✅ Title */}
                  <Typography variant="h6" color="primary" gutterBottom>
                    {`Recommendation #${index + 1}`}
                  </Typography>

                  {/* ❌ Hidden recommendation text (removed) */}

                  {/* ✅ Activity ID */}
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ fontStyle: "italic" }}
                  >
                    Activity ID: {rec.activityId || rec.id || "N/A"}
                  </Typography>
                </Paper>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary">
              No AI recommendations yet. Click “Regenerate” to generate
              Gemini-based insights for your activities.
            </Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default RecommendationService;
