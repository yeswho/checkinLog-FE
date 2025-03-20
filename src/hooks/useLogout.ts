import axiosClient from "api/client";

export const useLogout = () => {
  return async () => {
    try {
      await axiosClient.post('/user/logout');
    } finally {
      // Clear token and role from localStorage
      localStorage.removeItem("HMS-TOKEN");
      localStorage.removeItem("HMS-ROLE");

      // Redirect to login page
      window.location.href = "/login";
    }
  };
};