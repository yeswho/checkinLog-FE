import React from "react";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Select,
    SelectItem,
    DatePicker,
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

interface UpdateBookingProps {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking | null;
}

export default function UpdateBooking({ isOpen, onClose, booking }: UpdateBookingProps) {
    const [formData, setFormData] = React.useState({
        checkIn: "",
        checkOut: "",
        status: "",
        duration: 0,
        totalPrice: 0
    });

    const getDatePickerValue = (dateString: string) => {
        if (!dateString) return undefined;
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return undefined;

            return new CalendarDate(
                date.getFullYear(),
                date.getMonth() + 1,
                date.getDate()
            );
        } catch {
            return undefined;
        }
    };

    const formatDateToString = (date: CalendarDate) => {
        if (!date) return "";
        return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    };

    React.useEffect(() => {
        if (booking) {
            setFormData({
                checkIn: booking.checkIn,
                checkOut: booking.checkOut,
                status: booking.status,
                duration: booking.duration,
                totalPrice: booking.totalPrice
            });
        }
    }, [booking]);

    const handleChange = (name: string, value: any) => {
        if (name === "checkIn" || name === "checkOut") {
            setFormData(prev => {
                const newData = {
                    ...prev,
                    [name]: value ? formatDateToString(value) : ""
                };

                // Calculate duration and total price when dates change
                if (newData.checkIn && newData.checkOut && booking) {
                    const checkIn = new Date(newData.checkIn);
                    const checkOut = new Date(newData.checkOut);
                    const duration = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                    const totalPrice = duration * booking.room.rate;

                    return {
                        ...newData,
                        duration,
                        totalPrice
                    };
                }

                return newData;
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = () => {
        if (!booking) return;

        const updatedBooking = {
            ...booking,
            ...formData,
            updatedAt: new Date().toISOString()
        };

        console.log("Updated Booking Data:", updatedBooking);
        toast.success("Booking updated successfully!");
        onClose();
    };

    const statusOptions = [
        { value: "confirmed", label: "Confirmed" },
        { value: "checked-in", label: "Checked In" },
        { value: "checked-out", label: "Checked Out" },
        { value: "cancelled", label: "Cancelled" }
    ];

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
                        <ModalHeader className="flex flex-col gap-1">Update Booking</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
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

                                <div className="flex gap-4">
                                    <DatePicker
                                        isRequired
                                        label="Check-in Date"
                                        className="w-full"
                                        value={getDatePickerValue(formData.checkIn)}
                                        minValue={today(getLocalTimeZone())}
                                        onChange={(date) => handleChange("checkIn", date)}
                                    />

                                    <DatePicker
                                        isRequired
                                        label="Check-out Date"
                                        className="w-full"
                                        value={getDatePickerValue(formData.checkOut)}
                                        minValue={getDatePickerValue(formData.checkIn) || today(getLocalTimeZone())}
                                        onChange={(date) => handleChange("checkOut", date)}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <Select
                                        isRequired
                                        label="Status"
                                        placeholder="Select status"
                                        variant="bordered"
                                        selectedKeys={new Set([formData.status])}
                                        onSelectionChange={(keys) => handleChange("status", Array.from(keys)[0])}
                                    >
                                        {statusOptions.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    <Input
                                        isReadOnly
                                        label="Duration"
                                        value={`${formData.duration} nights`}
                                        variant="bordered"
                                    />

                                    <Input
                                        isReadOnly
                                        label="Total Price"
                                        value={`रु.${formData.totalPrice.toFixed(2)}`}
                                        variant="bordered"
                                    />
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit}>
                                Update Booking
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}