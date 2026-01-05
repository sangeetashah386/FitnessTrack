import React, { useState, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, Avatar, Button, Grid, CircularProgress, Snackbar, Alert
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../services/api";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [success, setSuccess] = useState(false);
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

const hasActivities = Array.isArray(user?.activities) && user.activities.length > 0;


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target.result);
      reader.readAsDataURL(file);
      setSuccess(true);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/dashboard")}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar src={avatar || "/default-avatar.png"} sx={{ width: 100, height: 100 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography color="textSecondary">{user.email}</Typography>
              <Typography color="textSecondary" sx={{ mt: 0.5 }}>
                📱 {user.phone}
              </Typography>
              <Typography color="textSecondary" sx={{ mt: 0.5 }}>
                🕒 Joined: {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
              <Button component="label" variant="contained" sx={{ mt: 2 }}>
                Upload Picture
                <input type="file" hidden onChange={handleImageChange} />
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Activities Section */}
     <Typography variant="h5" fontWeight="bold" mb={2}>
        Recent Activities
      </Typography>

      {hasActivities ? (
  <Grid container spacing={2}>
    {user.activities.map((activity, index) => (
      <Grid item xs={12} md={6} key={index}>
        <Card variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {activity.type}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            🕒 Start: {new Date(activity.startTime).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            ⏱ Duration: {activity.duration} mins
          </Typography>
          <Typography variant="body2" color="textSecondary">
            🔥 Calories Burned: {activity.caloriesBurned}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            📅 Created: {new Date(activity.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            🛠 Updated: {new Date(activity.updatedAt).toLocaleString()}
          </Typography>

          {activity.additionalMetrics && Object.keys(activity.additionalMetrics).length > 0 && (
            <Box mt={1}>
              <Typography variant="body2" fontWeight="medium">📊 Additional Metrics:</Typography>
              <ul style={{ paddingLeft: "1rem", marginTop: "0.5rem" }}>
                {Object.entries(activity.additionalMetrics).map(([key, value]) => (
                  <li key={key}>
                    <Typography variant="body2" color="textSecondary">
                      {key}: {value}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </Card>
      </Grid>
    ))}
  </Grid>
) : (
  <Typography color="textSecondary">No recent activities found.</Typography>
)}



  



      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: "100%" }}>
          Profile picture updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;
