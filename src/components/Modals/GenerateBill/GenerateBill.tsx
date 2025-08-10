import React from "react";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";
import { useGenerateBill } from "../../../hooks/useBooking";
import { GenerateBillDto } from "../../../types/booking";
import { Customer } from "../../../types/customer";
import { PAYMENT_MODE, BOOKING_STATUS } from "types/enums";
import { Room } from "types/rooms";

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

interface GenerateBillModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking | null;
}

export default function GenerateBill({ isOpen, onClose, booking }: GenerateBillModalProps) {
    const generateBill = useGenerateBill();

    const [formData, setFormData] = React.useState<GenerateBillDto>({
        bookingId: booking?.id || 0,
        totalAmount: booking?.totalPrice || 0,
        discount: 0,
        extraCharge: 0,
        remarks: "",
    });

    // Update formData when booking changes
    React.useEffect(() => {
        if (booking) {
            setFormData({
                bookingId: booking.id,
                totalAmount: booking.totalPrice,
                discount: 0,
                extraCharge: 0,
                remarks: "",
            });
        }
    }, [booking]);

    const handleChange = (name: keyof GenerateBillDto, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        generateBill.mutate({ bookingId: formData.bookingId, billData: formData });
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
                        <ModalHeader className="flex flex-col gap-1">Generate Bill</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <Input
                                    isRequired
                                    type="number"
                                    label="Total Amount"
                                    placeholder="Enter total amount"
                                    value={formData.totalAmount.toString()}
                                    onChange={(e) =>
                                        handleChange("totalAmount", parseFloat(e.target.value))
                                    }
                                    variant="bordered"
                                />

                                <Input
                                    type="number"
                                    label="Discount"
                                    placeholder="Enter discount"
                                    value={(formData.discount ?? 0).toString()}
                                    onChange={(e) =>
                                        handleChange("discount", parseFloat(e.target.value))
                                    }
                                    variant="bordered"
                                />

                                <Input
                                    type="number"
                                    label="Extra Charge"
                                    placeholder="Enter extra charge"
                                    value={(formData.extraCharge ?? 0).toString()}
                                    onChange={(e) =>
                                        handleChange("extraCharge", parseFloat(e.target.value))
                                    }
                                    variant="bordered"
                                />

                                <Input
                                    label="Remarks"
                                    placeholder="Enter remarks"
                                    value={formData.remarks}
                                    onChange={(e) => handleChange("remarks", e.target.value)}
                                    variant="bordered"
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit}>
                                Generate Bill
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}