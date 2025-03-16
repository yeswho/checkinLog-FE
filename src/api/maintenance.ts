import axiosClient from './client';
import { Maintenance, CreateMaintenanceDto, UpdateMaintenanceDto } from '../types/maintenance';

// Get all maintenance records
export const getMaintenances = async (): Promise<Maintenance[]> => {
  const { data } = await axiosClient.get<Maintenance[]>('/maintenances');
  return data;
};

// Get a single maintenance record by ID
export const getMaintenance = async (id: number): Promise<Maintenance> => {
  const { data } = await axiosClient.get<Maintenance>(`/maintenances/${id}`);
  return data;
};

// Create a new maintenance record
export const createMaintenance = async (
  maintenanceData: CreateMaintenanceDto,
): Promise<Maintenance> => {
  const { data } = await axiosClient.post<Maintenance>('/maintenances', maintenanceData);
  return data;
};

// Update an existing maintenance record
export const updateMaintenance = async ({
  id,
  ...maintenanceData
}: UpdateMaintenanceDto & { id: number }): Promise<Maintenance> => {
  const { data } = await axiosClient.put<Maintenance>(`/maintenances/${id}`, maintenanceData);
  return data;
};

// Delete a maintenance record
export const deleteMaintenance = async (id: number): Promise<number> => {
  await axiosClient.delete(`/maintenances/${id}`);
  return id;
};