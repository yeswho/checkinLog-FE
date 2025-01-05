import axiosClient from './client';
import { Floor, CreateFloorDto } from '../types/floor';

export const getFloors = async () => {
  const { data } = await axiosClient.get<Floor[]>('/floors');
  return data;
};

export const getFloor = async (id: number) => {
  const { data } = await axiosClient.get<Floor>(`/floors/${id}`);
  return data;
};

export const createFloor = async (floorData: CreateFloorDto) => {
  const { data } = await axiosClient.post<Floor>('/floors', floorData);
  return data;
};

export const updateFloor = async ({ id, ...floorData }: CreateFloorDto & { id: number }) => {
  const { data } = await axiosClient.put<Floor>(`/floors/${id}`, floorData);
  return data;
};

export const deleteFloor = async (id: number) => {
  await axiosClient.delete(`/floors/${id}`);
  return id;
};