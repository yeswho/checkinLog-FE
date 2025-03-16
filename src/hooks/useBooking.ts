import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    createBooking,
    deleteBooking,
    generateBill,
    getBooking,
    getBookingDetails,
    getBookings,
    getBookingsByCustomerId,
    getBookingsInDateRange,
    getTopCustomersWithHighestBookings,
    updateBooking,
    updateBookingRate,
} from '../api/booking';


import {
    Booking,
    BookingDetails,
    BookingGetCustomer,
    BookingsResponse,
    GenerateBillDto,
    TopCustomer
} from '../types/booking';

// Fetch all bookings
export const useBookings = () => {
    return useQuery<Booking[]>({
        queryKey: ['bookings'],
        queryFn: getBookings,
    });
};

// Fetch a single booking by ID
export const useBooking = (id: number) => {
    return useQuery<Booking>({
        queryKey: ['booking', id],
        queryFn: () => getBooking(id),
    });
};

// Create a new booking
export const useCreateBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['roomsDetail'] });

            toast.success('Booking created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create booking');
        },
    });
};

// Update an existing booking
export const useUpdateBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast.success('Booking updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update booking');
        },
    });
};

// Delete a booking
export const useDeleteBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast.success('Booking deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete booking');
        },
    });
};

// Update the rate of a booking
export const useUpdateBookingRate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ bookingId, newRate }: { bookingId: number; newRate: number }) =>
            updateBookingRate(bookingId, newRate),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast.success('Booking rate updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update booking rate');
        },
    });
};

// Fetch bookings within a date range
export const useBookingsInDateRange = (
    checkInDate: Date,
    checkOutDate: Date,
) => {
    return useQuery<Booking[]>({
        queryKey: ['bookings', 'date-range', checkInDate, checkOutDate],
        queryFn: () => getBookingsInDateRange(checkInDate, checkOutDate),
    });
};

// Fetch bookings by customer ID
export const useBookingsByCustomerId = (customerId: number) => {
    return useQuery<BookingsResponse>({
      queryKey: ['bookings', 'customer', customerId],
      queryFn: () => getBookingsByCustomerId(customerId),
    });
  };

// Fetch booking details (including room, customer, floor, and room type details)
export const useBookingDetails = (bookingId: number) => {
    return useQuery<BookingDetails>({
        queryKey: ['booking', 'details', bookingId],
        queryFn: () => getBookingDetails(bookingId),
    });
};

// Fetch top customers with the highest number of bookings
export const useTopCustomersWithHighestBookings = (limit: number) => {
    return useQuery<TopCustomer[]>({
        queryKey: ['bookings', 'top-customers', limit],
        queryFn: () => getTopCustomersWithHighestBookings(limit),
    });
};

// Generate a bill for a booking
export const useGenerateBill = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({ bookingId, billData }: { bookingId: number; billData: GenerateBillDto }) =>
        generateBill(bookingId, billData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bookings'] }); 
        toast.success('Booking bill generated successfully');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to generate booking bill');
      },
    });
  };