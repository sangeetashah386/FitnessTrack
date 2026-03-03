// src/pages/NutritionAiPlans.jsx

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Alert
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import ReplayIcon from "@mui/icons-material/Replay";
import DeleteIcon from "@mui/icons-material/Delete";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";

import {
  getAiNutritionRecommendationsByUser,
  regenerateAiNutritionRecommendation,
  deleteAiRecommendation
} from "../services/api";

const NutritionAiPlans = () => {
  const navigate = useNavigate();
  const userId = useSelector((s) => s.auth.userId);

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regenId, setRegenId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch AI recommendations
  const fetchPlans = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const res = await getAiNutritionRecommendationsByUser(userId);
      console.log("🔥 AI RECOMMENDATIONS:", res.data);
      setPlans(res.data || []);
    } catch (err) {
      setError("Failed to load AI nutrition plans.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Regenerate AI Recommendation
  const handleRegenerate = async (plan) => {
    setRegenId(plan.id);

    try {
      await regenerateAiNutritionRecommendation(plan.nutritionId);
      setSuccess("Regenerating AI recommendation...");
      setTimeout(fetchPlans, 3000);
    } catch {
      setError("Failed to regenerate.");
    } finally {
      setRegenId(null);
    }
  };

  // Delete Recommendation
  const handleDelete = async (plan) => {
    setDeleteId(plan.id);

    try {
      await deleteAiRecommendation(plan.id);
      setSuccess("Deleted successfully.");
      fetchPlans();
    } catch {
      setError("Failed to delete.");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    //<Box
    <Box
        sx={{
            minHeight: "100vh",
            backgroundImage: "url('/fitness-hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            }}
        >
              {/* LIGHT OVERLAY */}
            <Box
               sx={{
                 minHeight: "100vh",
                 backgroundColor: "rgba(255, 255, 255, 0.6)", // 🔥 makes background light
                 backdropFilter: "blur(15px)",
                 WebkitBackdropFilter: "blur(15px)",
                 borderRadius: 3,
                 boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                 p: 4,
               }}
            >
      <Button
  variant="contained"
  startIcon={<ArrowBackIcon />}
  onClick={() => navigate("/dashboard")}
  sx={{ mb: 2 }}
>
  Back to Dashboard
</Button>
      
      <Typography variant="h4" fontWeight="bold">
        🧠 AI Nutrition Recommendations
      </Typography>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

      <Paper sx={{ mt: 3, p: 2 }}>
        {loading ? (
          <Box textAlign="center"><CircularProgress /></Box>
        ) : plans.length === 0 ? (
          <Typography>No AI recommendations found.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Goal</TableCell>
                <TableCell>Calories</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {plans.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.goal}</TableCell>
                  <TableCell>{p.suggestedCalories}</TableCell>
                  <TableCell>
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleString()
                      : "—"}
                  </TableCell>

                  <TableCell align="right">
                    {/* View Details */}
                    <IconButton onClick={() => navigate(`/nutrition/ai/${p.id}`)}>
                      <VisibilityIcon />
                    </IconButton>

                    {/* Regenerate */}
                    <IconButton
                      onClick={() => handleRegenerate(p)}
                      disabled={regenId === p.id}
                    >
                      {regenId === p.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <ReplayIcon />
                      )}
                    </IconButton>

                    {/* Delete */}
                    <IconButton
                      onClick={() => handleDelete(p)}
                      disabled={deleteId === p.id}
                    >
                      {deleteId === p.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <DeleteIcon color="error" />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
     </Box>
    </Box>
  );
};

export default NutritionAiPlans;
