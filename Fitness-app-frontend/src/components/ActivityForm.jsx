import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useState } from "react";
import { addActivity } from "../services/api";

const ActivityForm = ({ onActivityAdded }) => {
 // const [activity, setActivity] = useState({ type: "RUNNING", distance: "",averageHeartRate: "", caloriesBurned: "", startTime: "", endTime: "", });
  const initialState = {
      type: "RUNNING",
      distance: "",
      averageHeartRate: "",
      caloriesBurned: "",
      startTime: "",
      endTime: "",
  };

  const [activity, setActivity] = useState(initialState);


 // const [activity, setActivity] = useState(initialState);
 // const toLocalDateTime = (value) => { if (!value) return null; return value + ":00";  };
 const formatForBackend = (value) => {
     if (!value) return null;
     return value.length === 16 ? value + ":00" : value;
   };

  const handleSubmit = async (e) => {
    e.preventDefault();

//     const activityWithStartTime = {
//         ...activity,
//         startTime: new Date().toISOString(),
//       };
     if (!activity.startTime || !activity.endTime) {
          alert("Please select start and end time.");
          return;
     }

     if (new Date(activity.endTime) <= new Date(activity.startTime)) {
          alert("End time must be after start time.");
          return;
     }

     const payload = {
          ...activity,

          // 🔵 UPDATED: safer number conversion
     distance: activity.distance ? Number(activity.distance) : null,
     averageHeartRate: activity.averageHeartRate
            ? Number(activity.averageHeartRate)
            : null,
     caloriesBurned: activity.caloriesBurned
            ? Number(activity.caloriesBurned)
            : 0,

          // 🔵 UPDATED: clean formatting
     startTime: formatForBackend(activity.startTime),
     endTime: formatForBackend(activity.endTime),
     };

     try {
        await addActivity(payload);
        onActivityAdded?.();

          // 🔵 UPDATED: reset using initialState
          setActivity(initialState);
     } catch (error) {
          console.error("Error saving activity:", error);
          alert("Failed to save activity.");
        }
     };


//     await addActivity(payload);
//     onActivityAdded?.();
//     setActivity({ type: "RUNNING", distance: "",averageHeartRate: "", caloriesBurned: "", startTime: "", endTime: "", });
//   };
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
          <MenuItem value="STRECTCHING">Stretching</MenuItem>
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
