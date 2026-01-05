import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import PersonIcon from "@mui/icons-material/Person";
import InsightsIcon from "@mui/icons-material/Insights";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const sections = [
  { title: "User Profile", path: "/profile", icon: <PersonIcon fontSize="large" /> },
  { title: "Activities", path: "/activities", icon: <FitnessCenterIcon fontSize="large" /> },
  { title: "Nutrition Service", path: "/nutrition", icon: <RestaurantIcon fontSize="large" /> },
  { title: "Recommendation Service", path: "/recommendations", icon: <InsightsIcon fontSize="large" /> },
  { title: "AI Nutrition Plans", path: "/nutrition/ai", icon: <SmartToyIcon fontSize="large" /> },
];

const Dashboard = () => {
  const navigate = useNavigate();

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
          backgroundColor: "rgba(255, 255, 255, 0.85)", // 🔥 makes background light
          backdropFilter: "blur(3px)",
          p: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={4}
          color="#2c2c2c"
        >
          🌟 FitTrack Dashboard
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {sections.map((s) => (
            <Grid item xs={12} sm={6} md={4} key={s.path}>
              <Card
                sx={{
                  textAlign: "center",
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.95)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                  transition: "0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardContent>
                  <Typography sx={{ mb: 2, color: "#1976d2" }}>
                    {s.icon}
                  </Typography>

                  <Typography variant="h6" fontWeight={600} mb={2}>
                    {s.title}
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={() => navigate(s.path)}
                    sx={{
                      borderRadius: 20,
                      px: 4,
                      background:
                        "linear-gradient(135deg, #42a5f5, #478ed1)",
                    }}
                  >
                    Open
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
