import axiosClient from './client';

// Update to make dates optional in the API layer
export const getMonthlyRevenue = async (startDate?: Date, endDate?: Date) => {
  if (!startDate || !endDate) return [];
  
  const params = new URLSearchParams();
  params.append('startDate', startDate.toISOString());
  params.append('endDate', endDate.toISOString());
  
  const { data } = await axiosClient.get(`/dashboard/revenue/monthly?${params.toString()}`);
  return data;
};

// Apply similar changes to other API functions
export const getRoomTypeOccupancy = async (startDate?: Date, endDate?: Date) => {
  if (!startDate || !endDate) return [];
  
  const params = new URLSearchParams();
  params.append('startDate', startDate.toISOString());
  params.append('endDate', endDate.toISOString());
  
  const { data } = await axiosClient.get(`/dashboard/occupancy/room-types?${params.toString()}`);
  return data;
};

export const getWeeklyBookingTrends = async (startDate: Date, endDate: Date) => {
  const params = new URLSearchParams();
  params.append('startDate', startDate.toISOString());
  params.append('endDate', endDate.toISOString());
  
  const { data } = await axiosClient.get(`/dashboard/bookings/weekly-trends?${params.toString()}`);
  return data;
};

export const getCustomerAgeDistribution = async () => {
  const { data } = await axiosClient.get('/dashboard/customers/age-distribution');
  return data;
};

export const getDashboardSummary = async () => {
  const { data } = await axiosClient.get('/dashboard/metrics/summary');
  return data;
};