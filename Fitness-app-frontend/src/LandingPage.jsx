import React, { useContext } from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import { AuthContext } from "react-oauth2-code-pkce";

const LandingPage = () => {
  const { logIn } = useContext(AuthContext);

  const handleGetStarted = () => {
    logIn(); // ✅ Opens Keycloak signup/login
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("/fitness-hero.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center",
        p: 3,
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            mb: 2,
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Welcome to FitTrack
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: 4,
            textShadow: "1px 1px 3px rgba(0,0,0,0.4)",
          }}
        >
          Your personalized fitness companion — track your workouts, get AI-based
          recommendations, monitor your nutrition, and plan your goals effortlessly.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleGetStarted}
          sx={{
            backgroundColor: "#00C853",
            fontSize: "1.1rem",
            px: 4,
            py: 1.2,
            borderRadius: "30px",
            textTransform: "none",
            boxShadow: "0px 4px 10px rgba(0, 200, 83, 0.3)",
            "&:hover": {
              backgroundColor: "#00B248",
              boxShadow: "0px 6px 15px rgba(0, 200, 83, 0.4)",
            },
          }}
        >
          Get Started
        </Button>
      </Container>
    </Box>
  );
};

export default LandingPage;
