import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    User
} from "@nextui-org/react";
import { toast } from "sonner";

type Room = {
    id: number;
    name: string;
    floor: string;
    roomType: string;
    rate: number;
};

type Customer = {
    id: number;
    name: string;
    email: string;
    contactNumber: string;
};

type Booking = {
    bookingId: number;
    customer: Customer;
    room: Room;
    checkIn: string;
    checkOut: string;
    duration: number;
    totalPrice: number;
    status: string;
    createdAt: string;
    updatedAt: string;
};

interface DeleteBookingProps {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking | null;
}

export default function DeleteBooking({ isOpen, onClose, booking }: DeleteBookingProps) {
    const handleSubmit = () => {
        if (!booking) return;
        console.log("Deleted booking:", booking);
        toast.success("Booking deleted successfully!");
        onClose();
    };

    return (
        <Modal 
            backdrop="blur"
            isOpen={isOpen} 
            onClose={onClose}
            size="2xl"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Delete Booking</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <p className="text-danger">
                                    Are you sure you want to delete this booking?
                                </p>

                                {/* Customer Information Display */}
                                {booking && (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm font-semibold">Customer Information</p>
                                        <User
                                            name={booking.customer.name}
                                            description={booking.customer.email}
                                        >
                                            {booking.customer.contactNumber}
                                        </User>
                                    </div>
                                )}

                                {/* Room Information Display */}
                                {booking && (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm font-semibold">Room Information</p>
                                        <div className="flex flex-col">
                                            <p className="text-sm">{booking.room.name}</p>
                                            <p className="text-xs text-default-500">
                                                {`${booking.room.floor} - ${booking.room.roomType} - रु.${booking.room.rate}/night`}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Booking Details */}
                                {booking && (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm font-semibold">Booking Details</p>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <p className="text-default-500">Check-in:</p>
                                                <p>{new Date(booking.checkIn).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-default-500">Check-out:</p>
                                                <p>{new Date(booking.checkOut).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-default-500">Duration:</p>
                                                <p>{booking.duration} nights</p>
                                            </div>
                                            <div>
                                                <p className="text-default-500">Total Price:</p>
                                                <p>रु.{booking.totalPrice.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-default-500">Status:</p>
                                                <p className="capitalize">{booking.status}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <p className="text-sm text-danger">
                                    This action cannot be undone. This will permanently delete the booking.
                                </p>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="default" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="danger" onPress={handleSubmit}>
                                Delete Booking
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}