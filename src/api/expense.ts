import axiosClient from './client';
import { Expense, CreateExpenseDto, UpdateExpenseDto } from '../types/expense';
import {  EXPENSE_CATEGORY } from '../types/employee';

export const getExpenses = async () => {
  const { data } = await axiosClient.get<Expense[]>('/expenses');
  return data;
};

export const getExpense = async (id: number) => {
  const { data } = await axiosClient.get<Expense>(`/expenses/${id}`);
  return data;
};

export const createExpense = async (expenseData: CreateExpenseDto) => {
  const { data } = await axiosClient.post<Expense>('/expenses', expenseData);
  return data;
};

export const updateExpense = async ({ id, ...expenseData }: UpdateExpenseDto & { id: number }) => {
  const { data } = await axiosClient.put<Expense>(`/expenses/${id}`, expenseData);
  return data;
};

export const deleteExpense = async (id: number) => {
  await axiosClient.delete(`/expenses/${id}`);
  return id;
};

export const getExpensesByDateRange = async (startDate: string, endDate: string) => {
  const { data } = await axiosClient.get<Expense[]>('/expenses/range', {
    params: { startDate, endDate },
  });
  return data;
};

export const getExpensesByCategory = async (category: EXPENSE_CATEGORY | 'all') => {
  const { data } = await axiosClient.get<Expense[]>(`/expenses/category/${category}`);
  return data;
};

export const getTotalExpenses = async (startDate?: string, endDate?: string) => {
  const { data } = await axiosClient.get<{ total: number }>('/expenses/total', {
    params: { startDate, endDate },
  });
  return data;
};

export const getExpensesByCategoryAndDateRange = async (
  category: EXPENSE_CATEGORY | 'all',
  startDate: string,
  endDate: string
) => {
  const { data } = await axiosClient.get<Expense[]>(`/expenses/category/${category}/range`, {
    params: { startDate, endDate },
  });
  return data;
};

export const getTotalExpensesByCategory = async (
  category: EXPENSE_CATEGORY,
  startDate?: string,
  endDate?: string
) => {
  const { data } = await axiosClient.get<{ category: string; total: number }>(
    `/expenses/category/${category}/total`,
    { params: { startDate, endDate } }
  );
  return data;
};