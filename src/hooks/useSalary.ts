import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createSalary,
  deleteSalary,
  getSalary,
  getSalaries,
  updateSalary,
  getSalariesByDateRange,
} from '../api/salary';

export const useSalaries = () => {
  return useQuery({
    queryKey: ['salaries'],
    queryFn: getSalaries,
  });
};

export const useSalary = (id: number) => {
  return useQuery({
    queryKey: ['salary', id],
    queryFn: () => getSalary(id),
  });
};

export const useCreateSalary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSalary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      toast.success('Salary created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create salary');
    },
  });
};

export const useUpdateSalary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSalary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      toast.success('Salary updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update salary');
    },
  });
};

export const useDeleteSalary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSalary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      toast.success('Salary deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete salary');
    },
  });
};

export const useSalariesByDateRange = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['salaries', 'range', startDate, endDate],
    queryFn: () => getSalariesByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate, 
  });
};