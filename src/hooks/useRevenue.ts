import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    getDailyRevenue,
    generateDailyRevenue,
    getDateRangeRevenue,
    getRevenueKPIs,
    getMonthlyBreakdown,
    getYearOverYearComparison,
    getCurrentMonthRevenue
} from '../api/revenue';

export const useDailyRevenue = (date: string) => {
    return useQuery({
        queryKey: ['revenue', 'daily', date],
        queryFn: () => getDailyRevenue(date),
        enabled: !!date
    });
};

export const useGenerateDailyRevenue = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: generateDailyRevenue,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['revenue'] });
            toast.success('Daily revenue generated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to generate daily revenue');
        }
    });
};

export const useDateRangeRevenue = (startDate: string, endDate: string) => {
    return useQuery({
        queryKey: ['revenue', 'range', startDate, endDate],
        queryFn: () => getDateRangeRevenue(startDate, endDate),
        enabled: !!startDate && !!endDate
    });
};

export const useRevenueKPIs = (startDate: string, endDate: string) => {
    return useQuery({
        queryKey: ['revenue', 'kpis', startDate, endDate],
        queryFn: () => getRevenueKPIs(startDate, endDate),
        enabled: !!startDate && !!endDate
    });
};

export const useMonthlyBreakdown = (year: number) => {
    return useQuery({
        queryKey: ['revenue', 'monthly', year],
        queryFn: () => getMonthlyBreakdown(year)
    });
};

export const useYearOverYearComparison = (years: string) => {
    return useQuery({
        queryKey: ['revenue', 'compare', years],
        queryFn: () => getYearOverYearComparison(years),
        enabled: !!years
    });
};

export const useCurrentMonthRevenue = () => {
    return useQuery({
        queryKey: ['revenue', 'current-month'],
        queryFn: getCurrentMonthRevenue
    });
};