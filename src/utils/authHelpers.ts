import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  userId: string;
  email: string;
  tokenVersion: number;
  exp: number;
}

export const isAuthenticated = (): boolean => {
  try {
    const token = localStorage.getItem("HMS-TOKEN");
    if (!token) return false;

    const decoded = jwtDecode<TokenPayload>(token);
    console.log(decoded);
    
    if (!decoded.userId || !decoded.email || decoded.tokenVersion === undefined) {
      return false;
    }

    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      localStorage.removeItem("HMS-TOKEN");
      return false;
    }

    return true;
  } catch {
    localStorage.removeItem("HMS-TOKEN");
    return false;
  }
};