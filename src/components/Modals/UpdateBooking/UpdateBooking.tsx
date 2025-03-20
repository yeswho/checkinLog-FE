import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import {
    Button,
    DatePicker,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    User
} from "@nextui-org/react";
import React from "react";
import { useUpdateBooking } from "../../../hooks/useBooking";
import { BOOKING_STATUS, PAYMENT_MODE } from "../../../types/enums";
import { Customer } from "../../../types/customer";


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

interface UpdateBookingProps {
    isOpen: boolean;
    onClose: () => void;
    bookingProp: any;
}

export default function UpdateBooking({ isOpen, onClose, bookingProp }: UpdateBookingProps) {
    console.log("Booking Data:", bookingProp);
    var booking: Booking | null = null;
    if (bookingProp && bookingProp.data) {
        booking = bookingProp.data;
    }
    const updateBooking = useUpdateBooking();

    const [formData, setFormData] = React.useState({
        checkIn: "",
        checkOut: "",
        status: BOOKING_STATUS.BOOKED,
        paymentMode: PAYMENT_MODE.CASH,
        pax: 1,
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
                checkIn: booking.check_in,
                checkOut: booking.check_out,
                status: booking.status,
                paymentMode: booking.payment_mode,
                totalPrice: booking.totalPrice,
                pax: booking.pax
            });
        }
    }, [booking]);

    const handleChange = (name: string, value: any) => {
        if (name === "checkIn" || name === "checkOut") {
            setFormData(prev => ({
                ...prev,
                [name]: value ? formatDateToString(value) : ""
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = () => {
        if (!booking) return;

        const { rooms, ...bookingWithoutRooms } = booking;
        console.log(bookingWithoutRooms);
        console.log(formData);
        
        
        const updatedBooking = {
            id: booking.id,
            customer_id: booking.customer.id,
            room_id: booking.rooms.map(room => room.id),
            check_in: formData.checkIn,
            check_out: formData.checkOut,
            pax: formData.pax,
            payment_mode: formData.paymentMode,
            status: formData.status,
            updatedAt: new Date().toISOString()
        };

        console.log("Updated Booking Data:", updatedBooking);
        updateBooking.mutate(updatedBooking);
        onClose();
    };

    const statusOptions = Object.values(BOOKING_STATUS).map(status => ({
        value: status,
        label: status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, " ")
    }));

    const paymentModeOptions = Object.values(PAYMENT_MODE).map(mode => ({
        value: mode,
        label: mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase()
    }));

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

                                    <Select
                                        isRequired
                                        label="Payment Mode"
                                        placeholder="Select payment mode"
                                        variant="bordered"
                                        selectedKeys={new Set([formData.paymentMode])}
                                        onSelectionChange={(keys) => handleChange("paymentMode", Array.from(keys)[0])}
                                    >
                                        {paymentModeOptions.map((mode) => (
                                            <SelectItem key={mode.value} value={mode.value}>
                                                {mode.label}
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    <Input
                                        isRequired
                                        type="number"
                                        label="Pax"
                                        placeholder="Number of guests"
                                        value={formData.pax.toString()}
                                        onChange={(e) => handleChange("pax", parseInt(e.target.value, 10))}
                                        variant="bordered"
                                    />
                                </div>

                                <Input
                                    isReadOnly
                                    label="Total Price"
                                    value={`रु.${formData.totalPrice}`}
                                    variant="bordered"
                                />
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