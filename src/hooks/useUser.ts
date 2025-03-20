import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserDetails, updateUser } from "../api/user";
import { toast } from "sonner";

// Fetch user details
export const useUserDetails = (id: number) => {
  return useQuery({
    queryKey: ["userDetails", id],
    queryFn: () => getUserDetails(id),
  });
};

// Update user details
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userDetails"] });
      toast.success("User updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });
};