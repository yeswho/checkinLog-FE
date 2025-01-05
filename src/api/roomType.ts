import axiosClient from './client';
import { RoomType, CreateRoomTypeDto } from '../types/roomType';

export const getRoomTypes = async () => {
  const { data } = await axiosClient.get<RoomType[]>('/room-type');
  return data;
};

export const getRoomType = async (id: number) => {
  const { data } = await axiosClient.get<RoomType>(`/room-type/${id}`);
  return data;
};

export const createRoomType = async (floorData: CreateRoomTypeDto) => {
  const { data } = await axiosClient.post<RoomType>('/room-type', floorData);
  return data;
};

export const updateRoomType = async ({ id, ...floorData }: CreateRoomTypeDto & { id: number }) => {
  const { data } = await axiosClient.put<RoomType>(`/room-type/${id}`, floorData);
  return data;
};

export const deleteRoomType = async (id: number) => {
  await axiosClient.delete(`/room-type/${id}`);
  return id;
};