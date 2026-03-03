import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// const ProtectedRoute = ({ isAuthed, children }) => {
//   if (!isAuthed) return <Navigate to="/" replace />;
//   return children;
// };
//
// export default ProtectedRoute;

const ProtectedRoute = ({ children }) => {
  const { token, isInitialized } = useSelector((state) => state.auth);

  // Wait until auth state is ready
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;