import axiosClient from './client';
import { Billing, GenerateBillDto, PrintableBill } from '../types/billing';

// Generate a bill for a booking
export const generateBill = async (billData: GenerateBillDto): Promise<Billing> => {
  const { data } = await axiosClient.post<Billing>('/billings/generate', billData);
  return data;
};

// Get a printable bill by booking ID
export const getPrintableBill = async (bookingId: number): Promise<PrintableBill> => {
  const { data } = await axiosClient.get<PrintableBill>(`/billings/printable/${bookingId}`);
  return data;
};

// Get all printable bill
export const getAllPrintableBill = async () : Promise<PrintableBill[]> => {
    const {data} = await axiosClient.get<PrintableBill[]>(`/billings/printable`)
    return data;
}

// Get all billings
export const getBillings = async (): Promise<Billing[]> => {
  const { data } = await axiosClient.get<Billing[]>('/billings');
  return data;
};

// Get a billing by ID
export const getBilling = async (id: number): Promise<Billing> => {
  const { data } = await axiosClient.get<Billing>(`/billings/${id}`);
  return data;
};

// Delete a billing
export const deleteBilling = async (id: number): Promise<number> => {
  await axiosClient.delete(`/billings/${id}`);
  return id;
};