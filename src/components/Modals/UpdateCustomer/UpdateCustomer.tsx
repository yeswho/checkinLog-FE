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
} from "@nextui-org/react";
import { useUpdateCustomer } from "hooks/useCustomer";
import { toast } from "sonner";

type GENDER = "MALE" | "FEMALE" | "OTHER";

type Customer = {
    id: number;
    firstname: string;
    lastname: string;
    address: string;
    email: string;
    contact: string;
    gender: string;
    dateofbirth: string;
    company: string;
    createdAt: string;
    updatedAt: string;
};


interface UpdateCustomerProps {
    isOpen: boolean;
    onClose: () => void;
    customer: Customer | null;
}

export default function UpdateCustomer({ isOpen, onClose, customer }: UpdateCustomerProps) {

    const updateCustomer = useUpdateCustomer();
    const [formData, setFormData] = React.useState({
        firstName: "",
        lastName: "",
        address: "",
        dateOfBirth: "",
        contact: "",
        email: "",
        gender: "",
        company: ""
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
        if (customer) {
            setFormData({
                firstName: customer.firstname,
                lastName: customer.lastname,
                address: customer.address,
                dateOfBirth: customer.dateofbirth,
                contact: customer.contact,
                email: customer.email,
                gender: customer.gender,
                company: customer.company
            });
        }
    }, [customer]);

    const handleChange = (name: string, value: any) => {
        if (name === "dateOfBirth") {
            setFormData(prev => ({
                ...prev,
                dateOfBirth: value ? formatDateToString(value) : ""
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async () => {
        if (!customer) return;

        const updatedCustomer = {
            id: customer.id,
            firstname: formData.firstName,
            lastname: formData.lastName,
            address: formData.address,
            dateofbirth: formData.dateOfBirth,
            contact: formData.contact,
            email: formData.email,
            gender: formData.gender,
            company: formData.company,
            updatedAt: new Date().toISOString()
        };

        await updateCustomer.mutateAsync({ ...updatedCustomer, dateofbirth: new Date(updatedCustomer.dateofbirth) });
        onClose();
    };

    const genderOptions = [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" }
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
                        <ModalHeader className="flex flex-col gap-1">Update Customer</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <Input
                                        isRequired
                                        autoFocus
                                        label="First Name"
                                        placeholder="Enter first name"
                                        variant="bordered"
                                        value={formData.firstName}
                                        onChange={(e) => handleChange("firstName", e.target.value)}
                                    />

                                    <Input
                                        isRequired
                                        label="Last Name"
                                        placeholder="Enter last name"
                                        variant="bordered"
                                        value={formData.lastName}
                                        onChange={(e) => handleChange("lastName", e.target.value)}
                                    />
                                </div>
                                <Input
                                    label="Address"
                                    placeholder="Enter address"
                                    variant="bordered"
                                    value={formData.address}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                />

                                <Input
                                    isRequired
                                    label="Email"
                                    type="email"
                                    placeholder="Enter email"
                                    variant="bordered"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                />
                                <div className="flex gap-4">
                                    <Input
                                        isRequired
                                        label="Contact"
                                        placeholder="Enter contact number"
                                        variant="bordered"
                                        value={formData.contact}
                                        onChange={(e) => handleChange("contact", e.target.value)}
                                    />
                                    <Select
                                        isRequired
                                        label="Gender"
                                        placeholder="Select gender"
                                        variant="bordered"
                                        selectedKeys={new Set([formData.gender])}
                                        onSelectionChange={(keys) => handleChange("gender", Array.from(keys)[0])}
                                    >
                                        {genderOptions.map((gender) => (
                                            <SelectItem key={gender.value} value={gender.value}>
                                                {gender.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                <div className="flex gap-4">
                                    <Input
                                        label="Company"
                                        placeholder="Enter company name"
                                        variant="bordered"
                                        value={formData.company}
                                        onChange={(e) => handleChange("company", e.target.value)}
                                    />

                                    <DatePicker
                                        showMonthAndYearPickers
                                        isRequired
                                        label="Date of Birth"
                                        className="w-full rounded-lg"
                                        value={getDatePickerValue(formData.dateOfBirth)}
                                        color="default"
                                        minValue={today(getLocalTimeZone()).subtract({ years: 120 })}
                                        maxValue={today(getLocalTimeZone())}
                                        onChange={(date) => handleChange("dateOfBirth", date)}
                                    />
                                </div>

                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit}>
                                Update Customer
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}