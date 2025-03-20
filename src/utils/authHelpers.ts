import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  userId: string;
  email: string;
  tokenVersion: number;
  exp: number;
  role: "admin" | "standard";
}

export const isAuthenticated = (requiredRole?: "admin" | "standard"): boolean => {
  try {
    const token = localStorage.getItem("HMS-TOKEN");
    if (!token) return false;

    const decoded = jwtDecode<TokenPayload>(token);
    console.log(decoded);

    // Validate token fields
    if (!decoded.userId || !decoded.email || decoded.tokenVersion === undefined) {
      return false;
    }

    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      localStorage.removeItem("HMS-TOKEN");
      localStorage.removeItem("HMS-ROLE");
      return false;
    }

    // Check role (if required)
    if (requiredRole) {
      const role = localStorage.getItem("HMS-ROLE");
      if (role !== requiredRole) {
        return false;
      }
    }

    return true;
  } catch {
    localStorage.removeItem("HMS-TOKEN");
    localStorage.removeItem("HMS-ROLE");
    return false;
  }
};