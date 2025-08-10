import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/client';

// Keep existing hooks that you're not removing
export const useRoomOccupancy = () => {
  return useQuery({
    queryKey: ['dashboard', 'room-occupancy'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/dashboard/room-occupancy');
      return data;
    }
  });
};

export const useBookingTrends = (startDate?: Date, endDate?: Date) => {
  return useQuery({
    queryKey: ['dashboard', 'booking-trends', startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate) return [];
      const { data } = await axiosClient.get('/dashboard/booking-trends', {
        params: { 
          startDate: startDate.toISOString().split('T')[0], 
          endDate: endDate.toISOString().split('T')[0] 
        }
      });
      return data;
    },
    enabled: !!startDate && !!endDate
  });
};

export const useCustomerDemographics = () => {
  return useQuery({
    queryKey: ['dashboard', 'customer-demographics'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/dashboard/customer-demographics');
      return data;
    }
  });
};

// New hooks for dashboard
export const useTodaysSnapshot = () => {
  return useQuery({
    queryKey: ['dashboard', 'todays-snapshot'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/dashboard/todays-snapshot');
      return data;
    },
    refetchInterval: 300000 // Refresh every 5 minutes
  });
};

export const useRoomAvailability = () => {
  return useQuery({
    queryKey: ['dashboard', 'room-availability'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/dashboard/room-availability');
      return data;
    }
  });
};

export const useUpcomingReservations = () => {
  return useQuery({
    queryKey: ['dashboard', 'upcoming-reservations'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/dashboard/upcoming-reservations');
      return data;
    }
  });
};

export const useRecentBookings = () => {
  return useQuery({
    queryKey: ['dashboard', 'recent-bookings'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/dashboard/recent-bookings');
      return data;
    }
  });
};

export const useCancellations = (period: 'today' | 'week') => {
  return useQuery({
    queryKey: ['dashboard', 'cancellations', period],
    queryFn: async () => {
      const { data } = await axiosClient.get('/dashboard/cancellations', {
        params: { period }
      });
      return data;
    }
  });
};

export const useNotifications = () => {
  return useQuery({
    queryKey: ['dashboard', 'notifications'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/dashboard/notifications');
      return data;
    },
    refetchInterval: 300000 // Refresh every 5 minutes
  });
};

export const useWeather = (location: string) => {
  return useQuery({
    queryKey: ['weather', location],
    queryFn: async () => {
      // This is a placeholder - you'll need to implement actual weather API integration
      // For example, using OpenWeatherMap API
      return {
        current: {
          temp: 22,
          condition: 'Partly Cloudy',
          icon: 'partly-cloudy'
        },
        forecast: [
          { day: 'Today', high: 24, low: 18, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
          { day: 'Tomorrow', high: 26, low: 19, condition: 'Sunny', icon: 'sunny' },
          { day: 'Day 3', high: 25, low: 20, condition: 'Rain', icon: 'rain' }
        ]
      };
    }
  });
};