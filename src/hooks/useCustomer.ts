import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createCustomer, deleteCustomer, getCustomer, getCustomers, updateCustomer } from '../api/customer';

export const useCustomers = () => {
    return useQuery({
        queryKey: ['customer'],
        queryFn: getCustomers,
    });
};

export const useCustomer = (id: number) => {
    return useQuery({
        queryKey: ['customer', id],
        queryFn: () => getCustomer(id),
    });
};

export const useCreateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customer'] });
            toast.success('Customer created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create Customer');
        },
    });
};

export const useUpdateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customer'] });
            toast.success('Customer updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update Customer');
        },
    });
};

export const useDeleteCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customer'] });
            toast.success('Customer deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete Customer');
        },
    });
};