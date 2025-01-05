import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createFloor, deleteFloor, getFloor, getFloors, updateFloor } from '../api/floor';

export const useFloors = () => {
    return useQuery({
        queryKey: ['floor'],
        queryFn: getFloors,
    });
};

export const useFloor = (id: number) => {
    return useQuery({
        queryKey: ['floor', id],
        queryFn: () => getFloor(id),
    });
};

export const useCreateFloor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createFloor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['floor'] });
            toast.success('Floor created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create Floor');
        },
    });
};

export const useUpdateFloor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateFloor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['floor'] });
            toast.success('Floor updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update Floor');
        },
    });
};

export const useDeleteFloor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteFloor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['floor'] });
            toast.success('Floor deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete Floor');
        },
    });
};