import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createCustomer, deleteCustomer, fetchCustomers, getCustomer, getCustomers, updateCustomer } from '../api/customer';

export const useCustomers = (page: number = 1, limit: number = 10) => {
  return useQuery<{ data: any[]; pagination: any }>({
    queryKey: ['customers', page, limit],
    queryFn: () => getCustomers(page, limit),
  });
};

export const useCustomersSearch = (query: string = "") => {
    return useQuery<any[]>({
      queryKey: ["customers", query],
      queryFn: () => fetchCustomers(query),
      enabled: !!query,
    });
  };

export const useCustomer = (id: number) => {
    return useQuery({
        queryKey: ['customers', id],
        queryFn: () => getCustomer(id),
    });
};

export const useCreateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
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
            queryClient.invalidateQueries({ queryKey: ['customers'] });
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
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            toast.success('Customer deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete Customer');
        },
    });
};