import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createRoom, deleteRoom, getRoom, getRooms, updateRoom, getRoomDetails, getAvailableRooms } from '../api/rooms';

export const useRooms = () => {
    return useQuery({
        queryKey: ['rooms'],
        queryFn: getRooms,
    });
};

export const useAvailableRooms = (checkIn?: Date, checkOut?: Date) => {
    return useQuery({
        queryKey: ['availableRooms', checkIn?.toISOString(), checkOut?.toISOString()],
        queryFn: () => getAvailableRooms({
            checkIn: checkIn?.toISOString(),
            checkOut: checkOut?.toISOString()
        }),
        enabled: !!checkIn && !!checkOut,
    });
};

export const useRoom = (id: number) => {
    return useQuery({
        queryKey: ['rooms', id],
        queryFn: () => getRoom(id),
    });
};

export const useCreateRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRoom,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            queryClient.invalidateQueries({ queryKey: ['roomsDetail'] })
            toast.success('Room created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create room');
        },
    });
};

export const useUpdateRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateRoom,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roomsDetail'] });
            toast.success('Room updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update room');
        },
    });
};

export const useDeleteRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteRoom,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            toast.success('Room deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete room');
        },
    });
};

export const useRoomsDetail = () => {
    return useQuery({
        queryKey: ['roomsDetail'],
        queryFn: getRoomDetails,
    });
};