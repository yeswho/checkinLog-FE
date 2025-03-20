import axiosClient from "./client";
import { User } from "../types/types"; 

// Fetch user details
export const getUserDetails = async (id: number) => {
  const { data } = await axiosClient.get<User>(`/user/${id}`);
  return data;
};

// Update user details
export const updateUser = async ({ id, ...updates }: Partial<User> & { id: number }) => {
  const { data } = await axiosClient.put<User>(`/user/${id}`, updates);
  return data;
};