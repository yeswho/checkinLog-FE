export interface Billing {
    id: number;
    booking_id: number;
    total_amount: number;
    discount: number;
    extra_charge: number;
    final_amount: number;
    remarks: string | null;
    billing_date: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface PrintableBill {
    customer: {
      name: string;
      email: string;
      contact: string;
    };
    booking: {
      checkIn: string;
      checkOut: string;
      duration: string;
    };
    rooms: {
      name: string;
      floor: string;
      roomType: string;
      rate: number;
      total: number;
    }[];
    foodCharges: {
      description: string;
      amount: number;
    }[];
    otherCharges: {
      description: string;
      amount: number;
    }[];
    charges: {
      totalRoomCharges: string;
      totalFoodCharges: string;
      totalOtherCharges: string;
      tax: string;
      vat: string;
      serviceCharge: string;
      subtotal: string;
    };
    billing: {
      discount: string;
      extraCharge: string;
      finalAmount: string;
      remarks: string | null;
      billingDate: string;
    };
  }
  
  export interface GenerateBillDto {
    bookingId: number;
    totalAmount: number;
    discount?: number;
    extraCharge?: number;
    remarks?: string;
  }