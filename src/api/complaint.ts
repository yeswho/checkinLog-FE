import axiosClient from './client';
import { Complaint, CreateComplaintDto, UpdateComplaintDto } from '../types/complaint';

export const getComplaints = async () => {
  const { data } = await axiosClient.get<Complaint[]>('/complaints');
  return data;
};

export const getComplaint = async (id: number) => {
  const { data } = await axiosClient.get<Complaint>(`/complaints/${id}`);
  return data;
};

export const createComplaint = async (complaintData: CreateComplaintDto) => {
  const { data } = await axiosClient.post<Complaint>('/complaints', complaintData);
  return data;
};

export const updateComplaint = async ({ id, ...complaintData }: UpdateComplaintDto & { id: number }) => {
  const { data } = await axiosClient.put<Complaint>(`/complaints/${id}`, complaintData);
  return data;
};

export const deleteComplaint = async (id: number) => {
  await axiosClient.delete(`/complaints/${id}`);
  return id;
};