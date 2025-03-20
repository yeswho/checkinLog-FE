import axiosClient from './client';
import { Customer, CreateCustomerDto } from '../types/customer';

export const getCustomers = async (page: number = 1, limit: number = 10): Promise<{ data: Customer[]; pagination: any }> => {
  const { data } = await axiosClient.get<{ data: Customer[]; pagination: any }>('/customers', {
    params: { page, limit },
  });
  return data;
};

export const fetchCustomers = async (query: string = ""): Promise<Customer[]> => {
  const { data } = await axiosClient.get<Customer[]>("/customers/search", {
    params: { query },
  });
  return data;
};

export const getCustomer = async (id: number) => {
  const { data } = await axiosClient.get<Customer>(`/customers/${id}`);
  return data;
};

export const createCustomer = async (roomData: CreateCustomerDto) => {
  const { data } = await axiosClient.post<Customer>('/customers', roomData);
  return data;
};

export const updateCustomer = async ({ id, ...roomData }: CreateCustomerDto & { id: number }) => {
  const { data } = await axiosClient.put<Customer>(`/customers/${id}`, roomData);
  return data;
};

export const deleteCustomer = async (id: number) => {
  await axiosClient.delete(`/customers/${id}`);
  return id;
};