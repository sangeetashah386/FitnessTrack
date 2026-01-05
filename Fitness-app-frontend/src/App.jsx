import React, { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "./store/authSlice";
import { AuthContext } from "react-oauth2-code-pkce";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

// Pages
import Dashboard from "./pages/Dashboard";
import LandingPage from "./LandingPage";
import UserProfile from "./components/UserProfile";
import ActivitiesPage from "./pages/ActivitiesPage";
import RecommendationService from "./pages/RecommendationService";
import NutritionService from "./pages/NutritionService";
import NutritionAiPlans from "./pages/NutritionAiPlans";
import NutritionAiPlanDetail from "./components/NutritionAiPlanDetail";
import RecommendationDetail from "./components/RecommendationDetail";

// Protected routes
import ProtectedRoute from "./routes/ProtectedRoute";

// GLOBAL REGISTRATION HANDLER
import PostRegisterHandler from "./components/PostRegisterHandler";

function App() {
  const auth = useContext(AuthContext);
  const dispatch = useDispatch();

  const { token, logOut, loginInProgress, idTokenData } = auth || {};
  const isAuthed = Boolean(token);

  
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  
  useEffect(() => {
    if (idTokenData?.sub) {
      localStorage.setItem("userId", idTokenData.sub);
      dispatch(setCredentials({ user: idTokenData, token: token }));
    }
  }, [idTokenData, token, dispatch]);

  /* -----------------------------------------------------
     🚪 LOGOUT HANDLER (CLEAN)
  ----------------------------------------------------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    dispatch(logout());
    if (logOut) logOut();
  };

  if (loginInProgress) {
    return <div>🔑 Logging you in… please wait</div>;
  }

  return (
    <BrowserRouter>

      {/*  Runs user sync only when token exists */}
      {token && <PostRegisterHandler />}

      {/* 🔝 TOP NAVBAR */}
      {isAuthed && (
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              FitTrack Dashboard
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      )}

      <Routes>
        {/* LANDING / ROOT */}
        <Route
          path="/"
          element={
            isAuthed ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LandingPage />
            )
          }
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthed={isAuthed}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthed={isAuthed}>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/activities"
          element={
            <ProtectedRoute isAuthed={isAuthed}>
              <ActivitiesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommendations"
          element={
            <ProtectedRoute isAuthed={isAuthed}>
              <RecommendationService />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommendations/:activityId"
          element={
            <ProtectedRoute isAuthed={isAuthed}>
              <RecommendationDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nutrition"
          element={
            <ProtectedRoute isAuthed={isAuthed}>
              <NutritionService />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nutrition/ai"
          element={
            <ProtectedRoute isAuthed={isAuthed}>
              <NutritionAiPlans />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nutrition/ai/:id"
          element={
            <ProtectedRoute isAuthed={isAuthed}>
              <NutritionAiPlanDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
