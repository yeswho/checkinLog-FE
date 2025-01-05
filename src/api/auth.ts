import axiosClient from "./client";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  data: any;
  token: string;
}

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>("/user/login", data);
  return response.data;
};
