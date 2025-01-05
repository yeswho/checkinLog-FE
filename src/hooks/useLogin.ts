import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.data.accessToken) {
        localStorage.setItem("HMS-TOKEN", data.data.accessToken);
        window.location.href = "/";
      }
    },
    onError: (error: any) => {
      console.error("Login failed:", error.response?.data?.message || error.message);
    },
  });
};
