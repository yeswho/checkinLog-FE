import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createAdditionalCharge,
  deleteAdditionalCharge,
  getAdditionalCharges,
  updateAdditionalCharge,
} from '../api/additionalCharge';
import { AdditionalCharge } from '../types/booking';


export const useAdditionalCharges = (bookingId: number) => {
  return useQuery({
    queryKey: ['additionalCharges', bookingId],
    queryFn: () => getAdditionalCharges(bookingId),
  });
};

export const useCreateAdditionalCharge = (bookingId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chargeData: Omit<AdditionalCharge, 'id' | 'createdAt' | 'updatedAt'>) =>
      createAdditionalCharge(bookingId, chargeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additionalCharges', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Additional charge added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add additional charge');
    },
  });
};

export const useUpdateAdditionalCharge = (bookingId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...chargeData }: Partial<AdditionalCharge> & { id: number }) =>
      updateAdditionalCharge(bookingId, id, chargeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additionalCharges', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Additional charge updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update additional charge');
    },
  });
};

export const useDeleteAdditionalCharge = (bookingId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chargeId: number) => deleteAdditionalCharge(bookingId, chargeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additionalCharges', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Additional charge deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete additional charge');
    },
  });
};