export type ComplaintStatus = 'open' | 'in-progress' | 'resolved';
export type ComplaintPriority = 'low' | 'medium' | 'high';

export interface Complaint {
    id: number;
    title: string;
    description: string;
    status: ComplaintStatus;
    priority: ComplaintPriority;
    roomId: number | null;
    customerId: number | null;
    createdAt: string;
    updatedAt: string;
    room: {
        name: string;
    } | null;
    customer: {
        firstname: string;
        lastname: string;
    } | null;
}

export interface CreateComplaintDto {
    title: string;
    description: string;
    status: ComplaintStatus;
    priority: ComplaintPriority;
    roomId?: number;
    customerId?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateComplaintDto {
    title?: string;
    description?: string;
    status?: ComplaintStatus;
    priority?: ComplaintPriority;
    roomId?: number;
    customerId?: number;
    updatedAt?: string;
}