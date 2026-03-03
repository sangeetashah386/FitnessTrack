import React, { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "./store/authSlice";
import { AuthContext } from "react-oauth2-code-pkce";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";

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
import AuthInitializer from "./components/AuthInitializer";
import RegisterPage from "./pages/RegisterPage";

// GLOBAL REGISTRATION HANDLER
import PostRegisterHandler from "./components/PostRegisterHandler";

function App() {
  const auth = useContext(AuthContext);
  const dispatch = useDispatch();

  const { logOut, loginInProgress, token: oauthToken } = auth || {};
  const { token } = useSelector((state) => state.auth); // Redux token
  const handleLogout = async () => {
      try {
        dispatch(logout());

        // Clear all stored tokens
        localStorage.clear();
        sessionStorage.clear();

        if (logOut) {
          await logOut(); // Proper OAuth logout
        }

        navigate("/", { replace: true });
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     dispatch(logout());
//     if (logOut) logOut();
//
//   };


  if (loginInProgress) {
    return <div>🔑 Logging you in… please wait</div>;
  }

  return (
    <BrowserRouter>
      {/* Initialize Redux from localStorage on refresh */}
      <AuthInitializer />

      {/* Top Navbar */}
      {token && (
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
        {/* ROOT ROUTE */}
        <Route
          path="/"
          element={
            oauthToken && !token ? (
              // Run once after OAuth login
              <PostRegisterHandler />
            ) : token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LandingPage />
            )
          }
        />

        <Route path="/register" element={<RegisterPage />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/activities"
          element={
            <ProtectedRoute>
              <ActivitiesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <RecommendationService />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommendations/:activityId"
          element={
            <ProtectedRoute>
              <RecommendationDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nutrition"
          element={
            <ProtectedRoute>
              <NutritionService />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nutrition/ai"
          element={
            <ProtectedRoute>
              <NutritionAiPlans />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nutrition/ai/:id"
          element={
            <ProtectedRoute>
              <NutritionAiPlanDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



