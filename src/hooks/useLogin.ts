import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.data.accessToken) {
        // Store the access token and role in localStorage
        localStorage.setItem("HMS-TOKEN", data.data.accessToken);
        localStorage.setItem("HMS-ROLE", data.data.user.role);
        localStorage.setItem("HMS-USER", data.data.user.id)

        // Redirect based on role
        const role = data.data.user.role;
        if (role === "admin") {
          window.location.href = "/";
        } else {
          window.location.href = "/";
        }
      }
    },
    onError: (error: any) => {
      console.error("Login failed:", error.response?.data?.message || error.message);
    },
  });
};