import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createMaintenance,
  deleteMaintenance,
  getMaintenance,
  getMaintenances,
  updateMaintenance,
} from '../api/maintenance';
import { Maintenance } from '../types/maintenance';

// Fetch all maintenance records
export const useMaintenances = () => {
  return useQuery<Maintenance[]>({
    queryKey: ['maintenances'],
    queryFn: getMaintenances,
  });
};

// Fetch a single maintenance record by ID
export const useMaintenance = (id: number) => {
  return useQuery<Maintenance>({
    queryKey: ['maintenance', id],
    queryFn: () => getMaintenance(id),
  });
};

// Create a new maintenance record
export const useCreateMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      toast.success('Maintenance record created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create maintenance record');
    },
  });
};

// Update an existing maintenance record
export const useUpdateMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      queryClient.invalidateQueries({ queryKey: ['roomsDetail'] });
      toast.success('Maintenance record updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update maintenance record');
    },
  });
};

// Delete a maintenance record
export const useDeleteMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      toast.success('Maintenance record deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete maintenance record');
    },
  });
};