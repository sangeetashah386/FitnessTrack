import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Box,
  Collapse,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getUserActivities, getActivityRecommendation, deleteActivity } from "../services/api";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState({});
  const userId = useSelector((state) => state.auth.userId);

  //  Fetch user activities
  const fetchActivities = async () => {
    try {
      const response = await getUserActivities(userId);
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching user activities:", error);
    }
  };

  // Load activities on mount
  useEffect(() => {
    if (userId) fetchActivities();
  }, [userId]);

  // 🗑️ Delete handler FIXED (no double alerts)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;

    try {
      await deleteActivity(id);
      alert("Activity deleted successfully!");

      //  Update UI safely WITHOUT triggering errors
      setActivities((prev) => prev.filter((a) => a.id !== id));

      //  Remove recommendation from UI as well
      setRecommendations((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

    } catch (err) {
      console.error("Delete failed: ", err);
      alert("Failed to delete activity.");
    }
  };

  const handleGetRecommendation = async (activityId) => {
    setLoading(true);
    try {
      const response = await getActivityRecommendation(activityId);
      setRecommendations((prev) => ({
        ...prev,
        [activityId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching recommendation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
      {activities.length > 0 ? (
        activities.map((activity) => (
          <Grid item xs={12} sm={6} md={4} key={activity.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {activity.type}
                </Typography>
                <Typography>Duration: {activity.duration} min</Typography>
                {activity.distance && (
                    <Typography>Distance: {activity.distance} km</Typography>
                )}

                {activity.pace && (
                  <Typography>Pace: {activity.pace} min/km</Typography>
                )}

                {activity.averageHeartRate && (
                  <Typography>Avg HR: {activity.averageHeartRate} bpm</Typography>
                )}
                <Typography>Calories: {activity.caloriesBurned}</Typography>

                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => handleGetRecommendation(activity.id)}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Show Recommendation"}
                </Button>

                <IconButton
                  color="error"
                  sx={{ mt: 1, ml: 1 }}
                  onClick={() => handleDelete(activity.id)}
                >
                  <DeleteIcon />
                </IconButton>

                <Collapse in={!!recommendations[activity.id]}>
                  {recommendations[activity.id] && (
                    <Box mt={2} p={2} bgcolor="#f9f9f9" borderRadius={2}>
                      <Divider sx={{ mb: 1 }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        AI Recommendation:
                      </Typography>
                      <Typography sx={{ whiteSpace: "pre-line" }}>
                        {recommendations[activity.id].recommendation ||
                          "No analysis available."}
                      </Typography>

                      {recommendations[activity.id].improvements && (
                        <Typography sx={{ mt: 1 }}>
                          <strong>Improvements:</strong>{" "}
                          {recommendations[activity.id].improvements.join(", ")}
                        </Typography>
                      )}

                      {recommendations[activity.id].suggestions && (
                        <Typography sx={{ mt: 1 }}>
                          <strong>Suggestions:</strong>{" "}
                          {recommendations[activity.id].suggestions.join(", ")}
                        </Typography>
                      )}

                      {recommendations[activity.id].safety && (
                        <Typography sx={{ mt: 1 }}>
                          <strong>Safety Tips:</strong>{" "}
                          {recommendations[activity.id].safety.join(", ")}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Box sx={{ mt: 4, textAlign: "center", width: "100%" }}>
          <Typography color="textSecondary">No activities found.</Typography>
        </Box>
      )}
    </Grid>
  );
};

export default ActivityList;
