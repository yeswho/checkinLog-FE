import axiosClient from './client';
import { Salary, CreateSalaryDto, UpdateSalaryDto } from '../types/salary';

export const getSalaries = async () => {
  const { data } = await axiosClient.get<Salary[]>('/salaries');
  return data;
};

export const getSalary = async (id: number) => {
  const { data } = await axiosClient.get<Salary>(`/salaries/${id}`);
  return data;
};

export const createSalary = async (salaryData: CreateSalaryDto) => {
  const { data } = await axiosClient.post<Salary>('/salaries', salaryData);
  return data;
};

export const updateSalary = async ({ id, ...salaryData }: UpdateSalaryDto & { id: number }) => {
  const { data } = await axiosClient.put<Salary>(`/salaries/${id}`, salaryData);
  return data;
};

export const deleteSalary = async (id: number) => {
  await axiosClient.delete(`/salaries/${id}`);
  return id;
};

export const getSalariesByDateRange = async (startDate: string, endDate: string) => {
  const { data } = await axiosClient.get<Salary[]>('/salaries/range', {
    params: { startDate, endDate },
  });
  return data;
};