import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useState } from "react";
import { addActivity } from "../services/api";

const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({ type: "RUNNING", distance: "",averageHeartRate: "", caloriesBurned: "", startTime: "", endTime: "", });

  const handleSubmit = async (e) => {
    e.preventDefault();

//     const activityWithStartTime = {
//         ...activity,
//         startTime: new Date().toISOString(),
//       };
    const payload = {
          ...activity,
          distance: activity.distance ? Number(activity.distance) : null,
          averageHeartRate: activity.averageHeartRate
            ? Number(activity.averageHeartRate)
            : null,
          caloriesBurned: Number(activity.caloriesBurned),
    };

    await addActivity(payload);
    onActivityAdded?.();
    setActivity({ type: "RUNNING", distance: "",averageHeartRate: "", caloriesBurned: "", startTime: "", endTime: "", });
  };
  const isDistanceBased = ["RUNNING", "WALKING", "HIKING", "CYCLING", "SWIMMING", "SKIING"]
      .includes(activity.type);
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Activity Type</InputLabel>
        <Select value={activity.type} label="Activity Type"
          onChange={(e) => setActivity({ ...activity, type: e.target.value })}>
          <MenuItem value="RUNNING">Running</MenuItem>
          <MenuItem value="WALKING">Walking</MenuItem>
          <MenuItem value="HIKING">Hiking</MenuItem>
          <MenuItem value="DANCING">Dancing</MenuItem>
          <MenuItem value="CYCLING">Cycling</MenuItem>
          <MenuItem value="SWIMMING">Swimming</MenuItem>
          <MenuItem value="YOGA">Yoga</MenuItem>
          <MenuItem value="STRETCHING">Stretching</MenuItem>
          <MenuItem value="OTHER">Other</MenuItem>
          
        </Select>
      </FormControl>
      <TextField fullWidth label="Start Time" type="datetime-local" sx={{ mb: 2 }} InputLabelProps={{ shrink: true }}
        value={activity.startTime}
        onChange={(e) =>
          setActivity({ ...activity, startTime: e.target.value })
        }
      />

      <TextField fullWidth label="End Time" type="datetime-local" sx={{ mb: 2 }} InputLabelProps={{ shrink: true }}
         value={activity.endTime}
         onChange={(e) =>
           setActivity({ ...activity, endTime: e.target.value })
         }
      />

      {isDistanceBased && (
        <TextField
          fullWidth
          label="Distance (km)"
          type="number"
          sx={{ mb: 2 }}
          value={activity.distance}
          onChange={(e) =>
            setActivity({ ...activity, distance: e.target.value })
          }
        />
      )}

      <TextField fullWidth label="Average Heart Rate (bpm)" type="number" sx={{ mb: 2 }}
        value={activity.averageHeartRate}
        onChange={(e) => setActivity({ ...activity, averageHeartRate: e.target.value })} />

      <TextField fullWidth label="Calories Burned" type="number" sx={{ mb: 2 }}
        value={activity.caloriesBurned}
        onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })} />

      <Button type="submit" variant="contained">Add Activity</Button>
    </Box>
  );
};

export default ActivityForm;
