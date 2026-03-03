import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  createNutritionPlan,
  getAllNutritionPlans,
  deleteNutritionPlan,
  getAiNutritionRecommendationsByUser
} from "../services/api";

const NutritionService = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userId);

  const [goal, setGoal] = useState("");
  const [dailyCalories, setDailyCalories] = useState("");
  const [prefs, setPrefs] = useState([{ key: "", value: "" }]);

  const [plans, setPlans] = useState([]);
  const [aiPlansMap, setAiPlansMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // ============================
  // FETCH MANUAL + AI PLANS
  // ============================
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const [manualRes, aiRes] = await Promise.all([
        getAllNutritionPlans(),
        getAiNutritionRecommendationsByUser(userId),
      ]);

      // Manual plans
      setPlans(manualRes.data || []);

      // Map AI plans by nutritionId
      const aiMap = {};
      (aiRes.data || []).forEach((ai) => {
        aiMap[ai.nutritionId] = ai;
      });

      setAiPlansMap(aiMap);
    } catch (err) {
      console.error(" Failed to load nutrition plans", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // ============================
  // CREATE PLAN
  // ============================
  const handleCreatePlan = async () => {
    if (!goal || !userId) return alert("Goal required");

    const prefsObj = {};
    prefs.forEach((p) => {
      if (p.key.trim()) prefsObj[p.key] = p.value;
    });

    const payload = {
      userId,
      goal,
      dailyCalories: Number(dailyCalories) || 0,
      prefs: prefsObj,
    };

    try {
      setCreating(true);
      await createNutritionPlan(payload);
      setGoal("");
      setDailyCalories("");
      setPrefs([{ key: "", value: "" }]);
      fetchPlans();
    } catch (err) {
      console.error("Failed to create plan", err);
    } finally {
      setCreating(false);
    }
  };

  // ============================
  // DELETE PLAN
  // ============================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      await deleteNutritionPlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
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
{/*     <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}> */}
      <Paper sx={{ width: "100%", maxWidth: 1200, p: 4 }}>

        {/* BACK */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard")}
          sx={{ mb: 3 }}
        >
          Back to Dashboard
        </Button>

        <Typography variant="h4" fontWeight="bold" mb={3}>
          🥗 Nutrition Plans
        </Typography>

        {/* CREATE PLAN */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6">Create Nutrition Plan</Typography>

          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Goal"
                fullWidth
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Daily Calories"
                type="number"
                fullWidth
                value={dailyCalories}
                onChange={(e) => setDailyCalories(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography fontWeight="bold">Preferences</Typography>

              {prefs.map((p, i) => (
                <Grid container spacing={1} key={i} mt={1}>
                  <Grid item xs={5}>
                    <TextField
                      label="Key"
                      value={p.key}
                      fullWidth
                      onChange={(e) => {
                        const copy = [...prefs];
                        copy[i].key = e.target.value;
                        setPrefs(copy);
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      label="Value"
                      value={p.value}
                      fullWidth
                      onChange={(e) => {
                        const copy = [...prefs];
                        copy[i].value = e.target.value;
                        setPrefs(copy);
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      color="error"
                      onClick={() =>
                        setPrefs(prefs.filter((_, idx) => idx !== i))
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Button
                startIcon={<AddCircleIcon />}
                onClick={() =>
                  setPrefs([...prefs, { key: "", value: "" }])
                }
                sx={{ mt: 1 }}
              >
                Add Preference
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleCreatePlan}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Plan"}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* TABLE */}
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">All Nutrition Plans</Typography>
            <Button startIcon={<RefreshIcon />} onClick={fetchPlans}>
              Refresh
            </Button>
          </Box>

          {loading ? (
            <Box textAlign="center" mt={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Goal</TableCell>
                  <TableCell>Calories</TableCell>
                  <TableCell>AI Recommendation</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {plans.map((plan) => {
                  const aiPlan = aiPlansMap[plan.id];

                  return (
                    <TableRow key={plan.id}>
                      <TableCell>{plan.id}</TableCell>
                      <TableCell>{plan.goal}</TableCell>
                      <TableCell>{plan.dailyCalories}</TableCell>

                      {/* AI COLUMN */}
                      <TableCell>
                        {aiPlan ? (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<VisibilityIcon />}
                            onClick={() =>
                              navigate(`/nutrition/ai/${aiPlan.id}`)
                            }
                          >
                            View AI
                          </Button>
                        ) : (
                          <Typography color="text.secondary">
                            Not Generated
                          </Typography>
                        )}
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(plan.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Paper>
      </Box>
    </Box>
  );
};

export default NutritionService;
