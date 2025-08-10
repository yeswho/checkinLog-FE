import { Customer } from "./customer";
import { PAYMENT_MODE, ROOM_STATUS, BOOKING_STATUS } from "./enums";
import { Room, UpdateRoomDto } from "./rooms";

export interface Booking {
  id: number;
  customer_id: number;
  room_id: number[];
  room_name: string;
  check_in: Date;
  check_out: Date;
  duration: number;
  totalPrice: number;
  status: ROOM_STATUS;
  rate: number;
  pax: number;
  requested_roomType: string[];
  payment_mode: PAYMENT_MODE;
  createdAt: Date;
  updatedAt: Date;
  customer: Customer;
  room: Room;
}

export interface BookingGetCustomer {
  id: number;
  customer_id: number;
  rooms: {
    id: number;
    name: string;
    floor: {
      name: string;
    };
    roomType: {
      name: string;
    };
    rate: number;
  }[];
  check_in: string; // Use `string` if backend returns date strings
  check_out: string; // Use `string` if backend returns date strings
  duration: number;
  totalPrice: number;
  status: BOOKING_STATUS;
  pax: number;
  payment_mode: PAYMENT_MODE;
  createdAt: string; // Use `string` if backend returns date strings
  updatedAt: string; // Use `string` if backend returns date strings
  customer: Customer;
}

export type BookingsResponse = {
  bookings: BookingGetCustomer[];
};


export interface CreateBookingDto {
  customer_id: number;
  room_id: number[];
  check_in: Date;
  check_out: Date;
  pax: number;
  payment_mode: PAYMENT_MODE;
  status: BOOKING_STATUS;
}

export interface UpdateBookingDto {
  // id: number;
  // customer: Customer;
  // rooms: UpdateRoomDto[];
  check_in: string;
  check_out: string;
  payment_mode: PAYMENT_MODE;
  // totalPrice: number;
  status: BOOKING_STATUS;
  pax: number;
  // createdAt: string;
  updatedAt: string;
};

export interface BookingDetails {
  bookingId: number;
  customer: {
    id: number;
    name: string;
    email: string;
    contactNumber: string;
  };
  room: {
    id: number;
    name: string;
    floor: string;
    roomType: string;
    rate: number;
  };
  checkIn: Date;
  checkOut: Date;
  duration: number;
  totalPrice: number;
}

export interface TopCustomer {
  customerId: number;
  name: string;
  email: string;
  bookingCount: number;
}


export interface GenerateBillDto {
  bookingId: number;
  totalAmount: number;
  discount?: number;
  extraCharge?: number;
  remarks?: string;
}

export interface AdditionalCharge {
  id: number;
  booking_id: number;
  description: string;
  amount: number;
  isFood: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddAdditionalChargeProps {
  bookingId: number;
  isOpen: boolean;
  onClose: () => void;
}

export interface UpdateAdditionalChargeProps {
  bookingId: number;
  charge: AdditionalCharge;
  isOpen: boolean;
  onClose: () => void;
}


export interface DeleteAdditionalChargeProps {
  bookingId: number;
  chargeId: number;
  isOpen: boolean;
  onClose: () => void;
}
