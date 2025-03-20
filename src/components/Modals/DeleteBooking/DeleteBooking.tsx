import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    User
} from "@nextui-org/react";
import { toast } from "sonner";
import { BOOKING_STATUS, PAYMENT_MODE } from "../../../types/enums";
import { useDeleteBooking } from "hooks/useBooking";

type Room = {
    id: number;
    name: string;
    floor: {
        name: string;
    };
    roomType: {
        name: string;
    };
    rate: number;
};

type Customer = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    contact: string;
};

type Booking = {
    id: number;
    customer: Customer;
    rooms: Room[];
    check_in: string;
    check_out: string;
    payment_mode: PAYMENT_MODE;
    totalPrice: number;
    status: BOOKING_STATUS;
    pax: number;
    createdAt: string;
    updatedAt: string;
};

interface DeleteBookingProps {
    isOpen: boolean;
    onClose: () => void;
    bookingProp: any;
}

export default function DeleteBooking({ isOpen, onClose, bookingProp }: DeleteBookingProps) {

    var booking: Booking | null = null;
    if (bookingProp && bookingProp.data) {
        booking = bookingProp.data;
    }
    const { mutate: deleteBooking } = useDeleteBooking();
    const handleSubmit = () => {
        if (!booking) return;
        console.log("Deleted booking:", booking);
        deleteBooking(booking.id);
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
                                            name={`${booking.customer.firstname} ${booking.customer.lastname}`}
                                            description={booking.customer.email}
                                        >
                                            {booking.customer.contact}
                                        </User>
                                    </div>
                                )}

                                {/* Room Information Display */}
                                {booking && (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm font-semibold">Room Information</p>
                                        {booking.rooms.map((room, index) => (
                                            <div key={room.id} className="flex flex-col">
                                                <p className="text-sm">{room.name}</p>
                                                <p className="text-xs text-default-500">
                                                    {`${room.floor.name} - ${room.roomType.name} - रु.${room.rate}/night`}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Booking Details */}
                                {booking && (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm font-semibold">Booking Details</p>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <p className="text-default-500">Check-in:</p>
                                                <p>{new Date(booking.check_in).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-default-500">Check-out:</p>
                                                <p>{new Date(booking.check_out).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-default-500">Total Price:</p>
                                                <p>रु.{booking.totalPrice.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-default-500">Status:</p>
                                                <p className="capitalize">{booking.status}</p>
                                            </div>
                                            <div>
                                                <p className="text-default-500">Payment Mode:</p>
                                                <p className="capitalize">{booking.payment_mode}</p>
                                            </div>
                                            <div>
                                                <p className="text-default-500">Pax:</p>
                                                <p>{booking.pax}</p>
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