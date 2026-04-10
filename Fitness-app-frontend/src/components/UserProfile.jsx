import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Divider
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../services/api";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const userId = useSelector((s) => s.auth.userId);

  useEffect(() => {
    if (!userId) return;
    getUserProfile(userId).then((res) => setUser(res.data));
  }, [userId]);

  if (!user)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress />
      </Box>
    );

  const activities = user.activities || [];

  const totalCalories = activities.reduce(
    (sum, act) => sum + (act.caloriesBurned || 0),
    0
  );

  const totalDuration = activities.reduce(
    (sum, act) => sum + (act.duration || 0),
    0
  );

  const totalActivities = activities.length;

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        background: "linear-gradient(135deg,#f6f9fc,#eef3f9)"
      }}
    >
      {/* Back Button */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/dashboard")}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      {/* Profile Header */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(120deg,#1976d2,#42a5f5)",
          color: "white",
          boxShadow: 6
        }}
      >
        <CardContent>
          <Typography variant="h4" fontWeight="bold">
            {user.firstName} {user.lastName}
          </Typography>

          <Typography sx={{ opacity: 0.9, mt: 1 }}>
            {user.email}
          </Typography>

          <Typography sx={{ opacity: 0.9 }}>
            📱 {user.phone || "Not provided"}
          </Typography>

          <Typography sx={{ opacity: 0.9 }}>
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <DirectionsRunIcon color="primary" />
              <Typography variant="h6">Total Activities</Typography>
              <Typography variant="h4" fontWeight="bold">
                {totalActivities}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <LocalFireDepartmentIcon sx={{ color: "orange" }} />
              <Typography variant="h6">Calories Burned</Typography>
              <Typography variant="h4" fontWeight="bold">
                {totalCalories}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <AccessTimeIcon color="secondary" />
              <Typography variant="h6">Total Duration</Typography>
              <Typography variant="h4" fontWeight="bold">
                {totalDuration} mins
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Activities Section */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Recent Activities
      </Typography>

      {activities.length > 0 ? (
        <Grid container spacing={3}>
          {activities.map((activity, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {activity.type}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="body2">
                    ⏱ Duration: {activity.duration} mins
                  </Typography>

                  <Typography variant="body2">
                    🔥 Calories: {activity.caloriesBurned}
                  </Typography>

                  <Typography variant="body2">
                    🕒 Start: {new Date(activity.startTime).toLocaleString()}
                  </Typography>

                  {activity.additionalMetrics &&
                    Object.keys(activity.additionalMetrics).length > 0 && (
                      <Box mt={1}>
                        <Typography variant="body2" fontWeight="bold">
                          Additional Metrics
                        </Typography>

                        {Object.entries(activity.additionalMetrics).map(
                          ([key, value]) => (
                            <Typography
                              key={key}
                              variant="body2"
                              color="text.secondary"
                            >
                              {key}: {value}
                            </Typography>
                          )
                        )}
                      </Box>
                    )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color="text.secondary">
          No recent activities found.
        </Typography>
      )}
    </Box>
  );
};

export default UserProfile;