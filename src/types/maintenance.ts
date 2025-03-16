import { Room } from "./rooms";

export interface Maintenance {
    id: number;
    roomId: number;
    reason: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
    room: Room; // Optional: Include room details if needed
}

export interface CreateMaintenanceDto {
    room_id: number;
    reason: string;
    startDate: string;
    expectedEndDate: string;
}

export interface UpdateMaintenanceDto {
    reason?: string;
    startDate?: string;
    endDate?: string;
    updatedAt?: string;
}