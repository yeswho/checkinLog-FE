import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Textarea,
} from "@nextui-org/react";
import React from "react";
import { toast } from "sonner";
import { useUpdateComplaint } from "../../../hooks/useComplaint";
import { ComplaintStatus, ComplaintPriority, UpdateComplaintDto } from "../../../types/complaint";

type Room = {
    id: number;
    name: string;
    floor: { id: number; name: string };
    room_type: { id: number; name: string };
    status: string;
    rate: string;
    createdAt: string;
    updatedAt: string;
};

type Customer = {
    id: number;
    firstname: string;
    lastname: string;
    address: string;
    dateofbirth: string;
    contact: string;
    email: string;
    gender: string;
    company: string;
    createdAt: string;
    updatedAt: string;
};

interface UpdateComplaintProps {
    isOpen: boolean;
    onClose: () => void;
    complaint: {
        id: number;
        title: string;
        description: string;
        status: ComplaintStatus;
        priority: ComplaintPriority;
        room?: Room;
        customer?: Customer;
    } | null;
}

export default function UpdateComplaint({ isOpen, onClose, complaint }: UpdateComplaintProps) {
    const [formData, setFormData] = React.useState<UpdateComplaintDto>({
        title: "",
        description: "",
        status: "open",
        priority: "low",
    });

    React.useEffect(() => {
        if (complaint) {
            setFormData({
                title: complaint.title,
                description: complaint.description,
                status: complaint.status,
                priority: complaint.priority,
            });
        }
    }, [complaint]);

    const updateComplaintMutation = useUpdateComplaint();

    const handleChange = (name: keyof UpdateComplaintDto, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        if (!complaint) return;

        const updatedComplaint: UpdateComplaintDto = {
            ...formData,
            updatedAt: new Date().toISOString(),
        };

        updateComplaintMutation.mutate(
            { id: complaint.id, ...updatedComplaint },
        );
        onClose();
    };

    const contextLabel = complaint?.room
        ? `Room ${complaint.room?.name}`
        : complaint?.customer
            ? `${complaint.customer.firstname} ${complaint.customer.lastname}`
            : "General";

    return (
        <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Update Complaint - {contextLabel}
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                {complaint?.room && (
                                    <div className="text-sm text-gray-500">
                                        Room: {complaint.room?.name} ({complaint.room.room_type?.name} - Floor{" "}
                                        {complaint.room.floor?.name})
                                    </div>
                                )}

                                {complaint?.customer && (
                                    <div className="text-sm text-gray-500">
                                        Customer: {complaint.customer.firstname} {complaint.customer.lastname} (
                                        {complaint.customer.email})
                                    </div>
                                )}

                                <Input
                                    label="Title"
                                    placeholder="Enter complaint title"
                                    variant="bordered"
                                    value={formData.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                />

                                <Textarea
                                    label="Description"
                                    placeholder="Enter complaint description"
                                    variant="bordered"
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    minRows={3}
                                />

                                <Select
                                    label="Status"
                                    placeholder="Select status"
                                    value={formData.status}
                                    selectedKeys={[formData.status || "open"]}
                                    onChange={(e) => handleChange("status", e.target.value)}
                                >
                                    <SelectItem key="open" value="open">
                                        Open
                                    </SelectItem>
                                    <SelectItem key="in-progress" value="in-progress">
                                        In Progress
                                    </SelectItem>
                                    <SelectItem key="resolved" value="resolved">
                                        Resolved
                                    </SelectItem>
                                </Select>

                                <Select
                                    label="Priority"
                                    placeholder="Select priority"
                                    selectedKeys={[formData.priority || "low"]}
                                    onChange={(e) => handleChange("priority", e.target.value)}
                                >
                                    <SelectItem key="low" value="low">
                                        Low
                                    </SelectItem>
                                    <SelectItem key="medium" value="medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem key="high" value="high">
                                        High
                                    </SelectItem>
                                </Select>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit}>
                                Update
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}