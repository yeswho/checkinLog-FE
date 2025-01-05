import { GENDER, PAYMENT_MODE, ROOM_TYPE } from "./enums";

export interface Room {
    id: number;
    floor: string;
    roomType: string;
    rate: number;
    status: ROOM_TYPE;
  }

  export interface RoomType {
    id: number;
    name: string;
    description?: string;
  }

  export interface Floor {
    id: number;
    name: string;
  }

  export interface Customer {
    id: number;
    fullName: string;
    email: string;
    gender: GENDER;
    phone?: string;
  }

  export interface Booking {
    id: number;
    customer: string;
    room: string;
    checkIn: string;
    checkOut: string;
    totalAmount?: number;
    paymentMode: PAYMENT_MODE;
  }

