import React, { useState, useEffect } from "react";
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
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  createNutritionPlan,
  getAllNutritionPlans,
  deleteNutritionPlan,
} from "../services/api";
import { useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";   // 🆕 import this
import { useNavigate } from "react-router";

const NutritionService = () => {
  const userId = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");
  const [dailyCalories, setDailyCalories] = useState("");
  const [dailyMeals, setDailyMeals] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [prefs, setPrefs] = useState([{ key: "", value: "" }]);

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  //  Fetch all nutrition plans
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await getAllNutritionPlans();
      setPlans(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch plans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // ➕ Add new preference row
  const addPref = () => {
    setPrefs([...prefs, { key: "", value: "" }]);
  };

  // ❌ Remove preference row
  const removePref = (index) => {
    setPrefs(prefs.filter((_, i) => i !== index));
  };

  // ✏️ Update preference row
  const updatePref = (index, field, newValue) => {
    const updated = [...prefs];
    updated[index][field] = newValue;
    setPrefs(updated);
  };

  // ➕ Create a new plan
  const handleCreatePlan = async () => {
    if (!goal || !userId) {
      alert("Please enter goal and ensure you are logged in.");
      return;
    }

    // Convert prefs array → map
    const prefsObj = {};
    prefs.forEach((p) => {
      if (p.key.trim()) prefsObj[p.key.trim()] = p.value.trim();
    });

    const payload = {
      userId,
      goal,
      prefs: prefsObj,
      dailyCalories: parseFloat(dailyCalories) || 0,
      dailyMeals: dailyMeals ? dailyMeals.split(",").map((s) => s.trim()) : [],
      recommendations: recommendations
        ? recommendations.split(",").map((s) => s.trim())
        : [],
      extraData: {},
    };

    console.log("📤 Creating plan:", payload);

    setCreating(true);
    try {
      await createNutritionPlan(payload);
      alert("✅ Nutrition plan created successfully!");
      setGoal("");
      setDailyCalories("");
      setDailyMeals("");
      setRecommendations("");
      setPrefs([{ key: "", value: "" }]);
      fetchPlans();
    } catch (err) {
      console.error("❌ Failed to create plan:", err);
      alert("Failed to create plan.");
    } finally {
      setCreating(false);
    }
  };

  // 🗑️ Delete a plan
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await deleteNutritionPlan(id);
      setPlans(plans.filter((p) => p.id !== id));
    } catch (err) {
      console.error("❌ Error deleting plan:", err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* 🔙 Back to Dashboard Button */}
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
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          🥗 Nutrition Plans
        </Typography>
        <Button startIcon={<RefreshIcon />} variant="outlined" onClick={fetchPlans}>
          Refresh
        </Button>
      </Box>

      {/* Create Form */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          Create Nutrition Plan
        </Typography>

        <Grid container spacing={2}>
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

          {/* 🧠 Dynamic Preferences Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Preferences
            </Typography>
            {prefs.map((pref, index) => (
              <Grid container spacing={1} key={index} alignItems="center" sx={{ mb: 1 }}>
                <Grid item xs={5}>
                  <TextField
                    label="Key"
                    fullWidth
                    value={pref.key}
                    onChange={(e) => updatePref(index, "key", e.target.value)}
                    placeholder="e.g., vegetarian"
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="Value"
                    fullWidth
                    value={pref.value}
                    onChange={(e) => updatePref(index, "value", e.target.value)}
                    placeholder="e.g., true"
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton color="error" onClick={() => removePref(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Button
              startIcon={<AddCircleIcon />}
              variant="outlined"
              size="small"
              onClick={addPref}
            >
              Add Preference
            </Button>
          </Grid>

          {/* Meals & Recommendations */}
          <Grid item xs={12}>
            <TextField
              label="Daily Meals (comma-separated)"
              fullWidth
              value={dailyMeals}
              onChange={(e) => setDailyMeals(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Recommendations (comma-separated)"
              fullWidth
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
            />
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

      {/* Plans List */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          All Nutrition Plans
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress />
          </Box>
        ) : plans.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>User ID</b></TableCell>
                <TableCell><b>Goal</b></TableCell>
                <TableCell><b>Calories</b></TableCell>
                <TableCell><b>Prefs</b></TableCell>
                <TableCell><b>Meals</b></TableCell>
                <TableCell><b>Recommendations</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.id}</TableCell>
                  <TableCell>{plan.userId}</TableCell>
                  <TableCell>{plan.goal}</TableCell>
                  <TableCell>{plan.dailyCalories}</TableCell>
                  <TableCell>
                    {plan.prefs
                      ? Object.entries(plan.prefs)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")
                      : "-"}
                  </TableCell>
                  <TableCell>{plan.dailyMeals?.join(", ")}</TableCell>
                  <TableCell>{plan.recommendations?.join(", ")}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDelete(plan.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            No nutrition plans found.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default NutritionService;
