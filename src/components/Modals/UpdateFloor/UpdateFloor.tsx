import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";
import React from "react";
import { toast } from "sonner";

type Floor = {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
};

interface UpdateFloorProps {
    isOpen: boolean;
    onClose: () => void;
    floor: Floor | null;
}

export default function UpdateRoom({ isOpen, onClose, floor }: UpdateFloorProps) {
    const [formData, setFormData] = React.useState({
        name: "",
    });

    React.useEffect(() => {
        if (floor) {
            setFormData({
                name: floor.name,
            });
        }
    }, [floor]);

    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (!floor) return;

        const updatedFloor = {
            id: floor.id,
            name: formData.name,
            updatedAt: new Date().toISOString()
        };

        console.log("Updated Floor Data:", updatedFloor);
        toast.success("Floor updated!");
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
                        <ModalHeader className="flex flex-col gap-1">Update Room</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <Input
                                    autoFocus
                                    label="Floor Name"
                                    placeholder="Enter floor name"
                                    variant="bordered"
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit}>
                                Update Floor
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}