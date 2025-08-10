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
} from "@nextui-org/react";
import React from "react";
import { useUpdateEmployee } from "../../../hooks/useEmployee";
import { DESIGNATIONS, Employee } from "../../../types/employee";

interface UpdateEmployeeProps {
    isOpen: boolean;
    onClose: () => void;
    employee: Employee | null;
}

export default function UpdateEmployee({ isOpen, onClose, employee }: UpdateEmployeeProps) {
    const [formData, setFormData] = React.useState({
        name: "",
        designation: "",
        basic_salary: "",
    });

    const updateEmployee = useUpdateEmployee();

    React.useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name,
                designation: employee.designation,
                basic_salary: employee.basic_salary.toString(),
            });
        }
    }, [employee]);

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!employee) return;

        try {
            await updateEmployee.mutateAsync({
                id: employee.id,
                ...formData,
                designation: formData.designation as DESIGNATIONS,
                basic_salary: parseFloat(formData.basic_salary),
            });
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Update Employee</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <Input
                                    isRequired
                                    label="Name"
                                    placeholder="Enter employee name"
                                    variant="bordered"
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                />
                                <Select
                                    isRequired
                                    label="Designation"
                                    placeholder="Select designation"
                                    variant="bordered"
                                    selectedKeys={formData.designation ? [formData.designation] : []}
                                    onChange={(e) => handleChange("designation", e.target.value)}
                                >
                                    {Object.values(DESIGNATIONS).map((designation) => (
                                        <SelectItem key={designation} value={designation}>
                                            {designation}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Input
                                    isRequired
                                    label="Basic Salary"
                                    placeholder="Enter basic salary"
                                    variant="bordered"
                                    type="number"
                                    value={formData.basic_salary}
                                    onChange={(e) => handleChange("basic_salary", e.target.value)}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit}>
                                Update Employee
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}