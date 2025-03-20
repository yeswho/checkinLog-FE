import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/authHelpers";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "standard";
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  if (!isAuthenticated(requiredRole)) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}