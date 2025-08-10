import axiosClient from './client';
import { AdditionalCharge } from '../types/booking';

interface AdditionalChargeGet {
  additionalCharges :AdditionalCharge[]
}

export const getAdditionalCharges = async (bookingId: number) => {
  const { data } = await axiosClient.get<AdditionalChargeGet>(`/bookings/${bookingId}/additional`);
  return data;
};

export const createAdditionalCharge = async (bookingId: number, chargeData: Omit<AdditionalCharge, 'id' | 'createdAt' | 'updatedAt'>) => {
  const { data } = await axiosClient.post<AdditionalCharge>(`/bookings/${bookingId}/additional`, chargeData);
  return data;
};

export const updateAdditionalCharge = async (bookingId: number, chargeId: number, chargeData: Partial<AdditionalCharge>) => {
  const { data } = await axiosClient.put<AdditionalCharge>(`/bookings/${bookingId}/additional/${chargeId}`, chargeData);
  return data;
};

export const deleteAdditionalCharge = async (bookingId: number, chargeId: number) => {
  await axiosClient.delete(`/bookings/${bookingId}/additional/${chargeId}`);
  return chargeId;
};