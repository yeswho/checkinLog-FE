import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    DatePicker,
} from "@nextui-org/react";
import React from "react";
import { toast } from "sonner";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";

type Maintenance = {
    id: number;
    roomId: string;
    reason: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
};

interface MaintenanceProps {
    isOpen: boolean;
    onClose: () => void;
    maintenance: Maintenance | null;
}

export default function Maintenance({ isOpen, onClose, maintenance }: MaintenanceProps) {
    const [formData, setFormData] = React.useState({
        roomId: "",
        reason: "",
        startDate: "",
        endDate: "",
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
        if (maintenance) {
            setFormData({
                roomId: maintenance.roomId,
                reason: maintenance.reason,
                startDate: maintenance.startDate,
                endDate: maintenance.endDate,
            });
        }
    }, [maintenance]);

    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (!maintenance) return;

        const updatedMaintenance = {
            id: maintenance.id,
            roomId: formData.roomId,
            reason: formData.reason,
            startDate: formData.startDate,
            endDate: formData.endDate,
            createdAt: maintenance.createdAt,
            updatedAt: new Date().toISOString()
        };

        console.log("Updated Maintenance Data:", updatedMaintenance);
        toast.success("Maintenance record updated!");
        onClose();
    };

    return (
        <Modal
            backdrop={"blur"}
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Update Maintenance Record</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <Input
                                    label="Reason"
                                    placeholder="Enter maintenance reason"
                                    variant="bordered"
                                    value={formData.reason}
                                    onChange={(e) => handleChange("reason", e.target.value)}
                                />
                                <DatePicker
                                    label="Start Date"
                                    value={getDatePickerValue(formData.startDate)}
                                    onChange={(date) => handleChange("startDate", date)}
                                    classNames={{
                                        base: "w-full",
                                    }}
                                />
                                <DatePicker
                                    label="End Date"
                                    value={getDatePickerValue(formData.endDate)}
                                    onChange={(date) => handleChange("endDate", date)}
                                    classNames={{
                                        base: "w-full",
                                    }}
                                    minValue={getDatePickerValue(formData.startDate)}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit}>
                                Update Maintenance
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}