import axiosClient from './client';
import {
    RevenueSummary,
    DailyRevenueDetails,
    DateRangeRevenue,
    MonthlyBreakdown,
    RevenueKPIs,
    YearComparisonData,
    MonthlyRevenue
} from '../types/revenue';
import { formatDateToBackend } from '../utils/common';

export const getDailyRevenue = async (date: string) => {
    const { data } = await axiosClient.get<DailyRevenueDetails>('/revenue/daily', {
        params: { date: formatDateToBackend(date) }
    });
    return data;
};

export const generateDailyRevenue = async (date: string) => {
    const { data } = await axiosClient.post<RevenueSummary>('/revenue/generate', { date: formatDateToBackend(date) });
    return data;
};

export const getDateRangeRevenue = async (startDate: string, endDate: string) => {
    const { data } = await axiosClient.get<DateRangeRevenue>('/revenue/range', {
        params: {
            startDate: formatDateToBackend(startDate),
            endDate: formatDateToBackend(endDate)
        }
    });
    return data;
};

export const getRevenueKPIs = async (startDate: string, endDate: string) => {
    const { data } = await axiosClient.get<RevenueKPIs>('/revenue/kpis', {
        params: {
            startDate: formatDateToBackend(startDate),
            endDate: formatDateToBackend(endDate)
        }
    });
    return data;
};

export const getMonthlyBreakdown = async (year: number) => {
    const { data } = await axiosClient.get<MonthlyBreakdown>(`/revenue/monthly/${year}`);
    return data;
};

export const getYearOverYearComparison = async (years: string) => {
    const { data } = await axiosClient.get<YearComparisonData[]>('/revenue/compare', {
        params: { years }
    });
    return data;
};

export const getCurrentMonthRevenue = async () => {
    const { data } = await axiosClient.get<MonthlyRevenue>('/revenue/current-month');
    return data;
};