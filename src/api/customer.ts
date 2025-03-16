import axiosClient from './client';
import { Customer, CreateCustomerDto } from '../types/customer';

export const getCustomers = async () => {
  const { data } = await axiosClient.get<Customer[]>('/customers');
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