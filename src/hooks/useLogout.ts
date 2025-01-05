import axiosClient from "api/client";

export const useLogout = () => {
  return async () => {
    try {
      await axiosClient.post('/user/logout');
    } finally {
      localStorage.removeItem("HMS-TOKEN");
      window.location.href = "/login";
    }
  };
};