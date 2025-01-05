import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createRoomType, deleteRoomType, getRoomType, getRoomTypes, updateRoomType } from '../api/roomType';

export const useRoomTypes = () => {
    return useQuery({
        queryKey: ['room-type'],
        queryFn: getRoomTypes,
    });
};

export const useRoomType = (id: number) => {
    return useQuery({
        queryKey: ['room-type', id],
        queryFn: () => getRoomType(id),
    });
};

export const useCreateRoomType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRoomType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['room-type'] });
            toast.success('RoomType created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create RoomType');
        },
    });
};

export const useUpdateRoomType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateRoomType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['room-type'] });
            toast.success('RoomType updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update RoomType');
        },
    });
};

export const useDeleteRoomType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteRoomType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['room-type'] });
            toast.success('RoomType deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete RoomType');
        },
    });
};