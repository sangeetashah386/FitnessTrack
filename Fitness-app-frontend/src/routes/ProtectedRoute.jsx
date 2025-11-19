import React from "react";
import { Navigate } from "react-router";

const ProtectedRoute = ({ isAuthed, children }) => {
  if (!isAuthed) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
