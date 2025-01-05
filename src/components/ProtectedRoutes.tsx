import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/authHelpers";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
}
