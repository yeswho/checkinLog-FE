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
    Textarea
} from "@nextui-org/react";
import React from "react";
import { useCreateComplaint } from "../../../hooks/useComplaint";
import { ComplaintPriority, ComplaintStatus, CreateComplaintDto } from "../../../types/complaint";

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

interface AddSuggestionProps {
    isOpen: boolean;
    onClose: () => void;
    room?: Room;
    customer?: Customer;
}

type FormData = {
    title: string;
    description: string;
    status: ComplaintStatus;
    priority: ComplaintPriority;
};

export default function AddSuggestion({ isOpen, onClose, room, customer }: AddSuggestionProps) {
    const [formData, setFormData] = React.useState<FormData>({
        title: "",
        description: "",
        status: "open",
        priority: "low"
    });

    const createComplaintMutation = useCreateComplaint();

    const handleChange = (name: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        const newComplaint: CreateComplaintDto = {
            ...formData,
            ...(room && { roomId: room.id }),
            ...(customer && { customerId: customer.id }),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        createComplaintMutation.mutate(newComplaint);
        onClose();
    };

    const contextLabel = room
        ? `Room ${room.name}`
        : customer
            ? `${customer.firstname} ${customer.lastname}`
            : "General";

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
                        <ModalHeader className="flex flex-col gap-1">
                            Add Complaint/Suggestion - {contextLabel}
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                {room && (
                                    <div className="text-sm text-gray-500">
                                        Room: {room.name} ({room.room_type.name} - Floor {room.floor.name})
                                    </div>
                                )}

                                {customer && (
                                    <div className="text-sm text-gray-500">
                                        Customer: {customer.firstname} {customer.lastname} ({customer.email})
                                    </div>
                                )}

                                <Input
                                    label="Title"
                                    placeholder="Enter complaint/suggestion title"
                                    variant="bordered"
                                    value={formData.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                />

                                <Textarea
                                    label="Description"
                                    placeholder="Enter complaint/suggestion description"
                                    variant="bordered"
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    minRows={3}
                                />

                                <Select
                                    label="Status"
                                    placeholder="Select status"
                                    selectedKeys={[formData.status]}
                                    onChange={(e) => handleChange("status", e.target.value)}
                                >
                                    <SelectItem key="open" value="open">Open</SelectItem>
                                    <SelectItem key="in-progress" value="in-progress">In Progress</SelectItem>
                                    <SelectItem key="resolved" value="resolved">Resolved</SelectItem>
                                </Select>

                                <Select
                                    label="Priority"
                                    placeholder="Select priority"
                                    selectedKeys={[formData.priority]}
                                    onChange={(e) => handleChange("priority", e.target.value)}
                                >
                                    <SelectItem key="low" value="low">Low</SelectItem>
                                    <SelectItem key="medium" value="medium">Medium</SelectItem>
                                    <SelectItem key="high" value="high">High</SelectItem>
                                </Select>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit}>
                                Submit
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}