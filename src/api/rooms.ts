import axiosClient from './client';
import { Room, CreateRoomDto } from '../types/rooms';

export const getRooms = async () => {
  const { data } = await axiosClient.get<Room[]>('/rooms');
  return data;
};

export const getAvailableRooms = async (params?: { checkIn?: string; checkOut?: string }) => {
  const { data } = await axiosClient.get<Room[]>('/rooms/available', {
    params: {
      checkIn: params?.checkIn,
      checkOut: params?.checkOut
    }
  });
  return data;
};

export const getRoom = async (id: number) => {
  const { data } = await axiosClient.get<Room>(`/rooms/${id}`);
  return data;
};

export const createRoom = async (roomData: CreateRoomDto) => {
  const { data } = await axiosClient.post<Room>('/rooms', roomData);
  return data;
};

export const updateRoom = async ({ id, ...roomData }: CreateRoomDto & { id: number }) => {
  const { data } = await axiosClient.put<Room>(`/rooms/${id}`, roomData);
  return data;
};

export const deleteRoom = async (id: number) => {
  await axiosClient.delete(`/rooms/${id}`);
  return id;
};

export const getRoomDetails = async () => {
  const { data } = await axiosClient.get('/rooms/details');
  return data;
}