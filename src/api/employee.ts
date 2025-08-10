import axiosClient from './client';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../types/employee';

export const getEmployees = async () => {
  const { data } = await axiosClient.get<Employee[]>('/employees');
  return data;
};

export const getEmployee = async (id: number) => {
  const { data } = await axiosClient.get<Employee>(`/employees/${id}`);
  return data;
};

export const createEmployee = async (employeeData: CreateEmployeeDto) => {
  const { data } = await axiosClient.post<Employee>('/employees', employeeData);
  return data;
};

export const updateEmployee = async ({ id, ...employeeData }: UpdateEmployeeDto & { id: number }) => {
  const { data } = await axiosClient.put<Employee>(`/employees/${id}`, employeeData);
  return data;
};

export const deleteEmployee = async (id: number) => {
  await axiosClient.delete(`/employees/${id}`);
  return id;
};