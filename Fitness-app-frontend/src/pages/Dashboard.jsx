import React from "react";
import { Box, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import PersonIcon from "@mui/icons-material/Person";
import InsightsIcon from "@mui/icons-material/Insights";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const sections = [
  { title: "User Profile", path: "/profile", icon: <PersonIcon fontSize="large" /> },
  { title: "Activities", path: "/activities", icon: <FitnessCenterIcon fontSize="large" /> },
  { title: "Nutrition Service", path: "/nutrition", icon: <RestaurantIcon fontSize="large" /> },
  { title: "Recommendation Service", path: "/recommendations", icon: <InsightsIcon fontSize="large" /> },
  {
    title: "AI Nutrition Plans",
    path: "/nutrition/ai", // Navigates to NutritionAiPlans.jsx
    icon: <SmartToyIcon fontSize="large" />, // symbolizes AI
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        p: 4,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}>
        🌟 FitTrack Dashboard 🌟
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {sections.map((s) => (
          <Grid item xs={12} sm={6} md={4} key={s.path}>
            <Card
              sx={{
                textAlign: "center",
                p: 3,
                transition: "0.3s",
                borderRadius: 3,
                boxShadow: 3,
                "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
              }}
            >
              <CardContent>
                <Box sx={{ mb: 2, color: "#1976d2" }}>{s.icon}</Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {s.title}
                </Typography>
                <Button variant="contained" onClick={() => navigate(s.path)}>
                  Go
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;