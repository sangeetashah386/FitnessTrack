import React, { useState } from "react";
import { Box, Typography, Snackbar, Alert, Button } from "@mui/material";
import ActivityForm from "../components/ActivityForm";
import ActivityList from "../components/ActivityList";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";

const ActivitiesPage = () => {
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/dashboard")}
        sx={{ mb: 2 }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Track Your Activities
      </Typography>

      <ActivityForm onActivityAdded={() => setSuccess(true)} />
      <ActivityList />

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Activity added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ActivitiesPage;
