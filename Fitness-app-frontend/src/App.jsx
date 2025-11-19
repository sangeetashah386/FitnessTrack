import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useDispatch } from "react-redux";
import { setCredentials } from "./store/authSlice";
import { AuthContext } from "react-oauth2-code-pkce";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

import Dashboard from "./pages/Dashboard";
import LandingPage from "./LandingPage";
import UserProfile from "./components/UserProfile";
import ActivitiesPage from "./pages/ActivitiesPage";
import RecommendationService from "./pages/RecommendationService";
import NutritionService from "./pages/NutritionService";
import NutritionAiPlans from "./pages/NutritionAiPlans";
import NutritionAiPlanDetail from "./components/NutritionAiPlanDetail";
import PostRegisterHandler from "./components/PostRegisterHandler";
import RecommendationDetail from "./components/RecommendationDetail";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const { token, tokenData, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
      setShowLanding(false);
    }
  }, [token, tokenData, dispatch]);

  const isAuthed = Boolean(token);

  return (
    <BrowserRouter>
      {!isAuthed && showLanding ? (
        <LandingPage />
      ) : isAuthed ? (
        <>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>FitTrack Dashboard</Typography>
              <Button color="inherit" onClick={logOut}>Logout</Button>
            </Toolbar>
          </AppBar>

          <PostRegisterHandler />

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute isAuthed={isAuthed}><Dashboard /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute isAuthed={isAuthed}><UserProfile /></ProtectedRoute>
            } />
            <Route path="/activities" element={
              <ProtectedRoute isAuthed={isAuthed}><ActivitiesPage /></ProtectedRoute>
            } />
            <Route path="/recommendations" element={
              <ProtectedRoute isAuthed={isAuthed}><RecommendationService /></ProtectedRoute>
            } />
            <Route path="/recommendations/:activityId" element={
              <ProtectedRoute isAuthed={isAuthed}><RecommendationDetail /></ProtectedRoute>
            } />
            <Route path="/nutrition" element={
              <ProtectedRoute isAuthed={isAuthed}><NutritionService /></ProtectedRoute>
            } />
            <Route path="/nutrition/ai" element={
              <ProtectedRoute isAuthed={isAuthed}><NutritionAiPlans /></ProtectedRoute>
            } />
            <Route path="/nutrition/ai/:id" element={
              <ProtectedRoute isAuthed={isAuthed}>{/* pass params manually */}
              {(props) => <NutritionAiPlanDetail {...props} />}<NutritionAiPlanDetail /></ProtectedRoute>
            } />
          </Routes>
        </>
      ) : <LandingPage />}
    </BrowserRouter>
  );
}

export default App;
