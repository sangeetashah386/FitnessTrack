import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  getActivityRecommendations,
  deleteRecommendationByActivityId,
} from "../services/api";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const RecommendationService = () => {
  const userId = useSelector((state) => state.auth.userId);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRecommendations = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const res = await getActivityRecommendations(userId);
      const recs = Array.isArray(res?.data)
        ? res.data
        : res?.data?.recommendations || [];

      setRecommendations(recs);
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

  const handleDeleteRecommendation = async (activityId, e) => {
    e.stopPropagation(); // Prevent opening detail page
    if (!window.confirm("Delete recommendation for this activity?")) return;

    try {
      const res = await deleteRecommendationByActivityId(activityId);
      alert(res.data);

      fetchRecommendations();  // refresh list
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Failed to delete recommendation.");
    }
  };

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

      <Typography variant="h4" fontWeight="bold" mb={3}>
        AI Activity Recommendations
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <Grid item xs={12} sm={6} md={4} key={rec.activityId || index}>
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
                    navigate(`/recommendations/${rec.activityId}`)
                  }
                >
                  <Typography variant="h6" color="primary" gutterBottom>
                    Recommendation #{index + 1}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ fontStyle: "italic", mb: 2 }}
                  >
                    Activity ID: {rec.activityId}
                  </Typography>

                  {/* ⭐ Delete button */}
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={(e) =>
                      handleDeleteRecommendation(rec.activityId, e)
                    }
                  >
                    Delete
                  </Button>
                </Paper>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary">
              No AI recommendations yet.
            </Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default RecommendationService;
