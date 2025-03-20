import axiosClient from "./client";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  data: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      role: "admin" | "standard";
    };
  };
}

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>("/user/login", data);
  return response.data;
};