import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createExpense,
  deleteExpense,
  getExpense,
  getExpenses,
  updateExpense,
  getExpensesByDateRange,
  getExpensesByCategory,
  getTotalExpenses,
  getExpensesByCategoryAndDateRange,
  getTotalExpensesByCategory,
} from '../api/expense';
import { EXPENSE_CATEGORY } from '../types/employee';

export const useExpenses = () => {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses,
  });
};

export const useExpense = (id: number) => {
  return useQuery({
    queryKey: ['expense', id],
    queryFn: () => getExpense(id),
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create expense');
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update expense');
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete expense');
    },
  });
};

export const useExpensesByDateRange = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['expenses', 'range', startDate, endDate],
    queryFn: () => getExpensesByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

export const useExpensesByCategory = (category: EXPENSE_CATEGORY | 'all') => {
  return useQuery({
    queryKey: ['expenses', 'category', category],
    queryFn: () => getExpensesByCategory(category),
    enabled: !!category,
  });
};

export const useTotalExpenses = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['expenses', 'total', startDate, endDate],
    queryFn: () => getTotalExpenses(startDate, endDate),
  });
};

export const useExpensesByCategoryAndDateRange = (
  category: EXPENSE_CATEGORY | 'all',
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: ['expenses', 'category', category, 'range', startDate, endDate],
    queryFn: () => getExpensesByCategoryAndDateRange(category, startDate, endDate),
    enabled: !!category && !!startDate && !!endDate,
  });
};

export const useTotalExpensesByCategory = (
  category: EXPENSE_CATEGORY,
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['expenses', 'category', category, 'total', startDate, endDate],
    queryFn: () => getTotalExpensesByCategory(category, startDate, endDate),
    enabled: !!category,
  });
};