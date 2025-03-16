import axiosClient from './client';
import {
  Booking,
  CreateBookingDto,
  BookingDetails,
  TopCustomer,
  UpdateBookingDto,
  BookingGetCustomer,
  BookingsResponse,
  GenerateBillDto,
} from '../types/booking';

// Get all bookings
export const getBookings = async (): Promise<Booking[]> => {
  const { data } = await axiosClient.get<Booking[]>('/bookings');
  return data;
};

// Get a single booking by ID
export const getBooking = async (id: number): Promise<Booking> => {
  const { data } = await axiosClient.get<Booking>(`/bookings/${id}`);
  return data;
};

// Create a new booking
export const createBooking = async (
  bookingData: CreateBookingDto,
): Promise<Booking> => {
  const { data } = await axiosClient.post<Booking>('/bookings', bookingData);
  return data;
};

// Update an existing booking
export const updateBooking = async ({
  id,
  ...bookingData
}: UpdateBookingDto & { id: number }): Promise<Booking> => {
  const { data } = await axiosClient.put<Booking>(`/bookings/${id}`, bookingData);
  return data;
};

// Delete a booking
export const deleteBooking = async (id: number): Promise<number> => {
  await axiosClient.delete(`/bookings/${id}`);
  return id;
};

// Update the rate of a booking
export const updateBookingRate = async (
  bookingId: number,
  newRate: number,
): Promise<Booking> => {
  const { data } = await axiosClient.patch<Booking>(
    `/bookings/${bookingId}/rate`,
    { rate: newRate },
  );
  return data;
};

// Get bookings within a date range
export const getBookingsInDateRange = async (
  checkInDate: Date,
  checkOutDate: Date,
): Promise<Booking[]> => {
  const { data } = await axiosClient.get<Booking[]>('/bookings/date-range', {
    params: {
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
    },
  });
  return data;
};

// Get bookings by customer ID
export const getBookingsByCustomerId = async (
  customerId: number,
): Promise<BookingsResponse> => {
  const { data } = await axiosClient.get<BookingsResponse>(
    `/bookings/customer/${customerId}`,
  );
  return data; // Return the entire response object
};

// Get booking details (including room, customer, floor, and room type details)
export const getBookingDetails = async (
  bookingId: number,
): Promise<BookingDetails> => {
  const { data } = await axiosClient.get<BookingDetails>(
    `/bookings/${bookingId}/details`,
  );
  return data;
};

// Get top customers with the highest number of bookings
export const getTopCustomersWithHighestBookings = async (
  limit: number,
): Promise<TopCustomer[]> => {
  const { data } = await axiosClient.get<TopCustomer[]>(
    '/bookings/top-customers',
    {
      params: { limit },
    },
  );
  return data;
};

// Generate a bill for a booking
export const generateBill = async (
  bookingId: number,
  billData: GenerateBillDto,
): Promise<Booking> => {
  const { data } = await axiosClient.post<Booking>(`/bookings/bill/${bookingId}`, billData);
  return data;
};