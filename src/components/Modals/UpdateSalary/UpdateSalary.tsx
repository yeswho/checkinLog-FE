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
} from "@nextui-org/react";
import React from "react";
import { useUpdateSalary } from "../../../hooks/useSalary";
import { Salary } from "../../../types/salary";

interface UpdateSalaryProps {
    isOpen: boolean;
    onClose: () => void;
    salary: Salary | null;
}

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

export default function UpdateSalary({ isOpen, onClose, salary }: UpdateSalaryProps) {
    const [formData, setFormData] = React.useState({
        employee_id: 0,
        basic_salary: 0,
        bonus: 0,
        advance: 0,
        overtime: 0,
        total_salary: 0,
        salary_date: "",
    });

    const updateSalary = useUpdateSalary();

    React.useEffect(() => {
        if (salary) {
            setFormData({
                employee_id: salary.employee_id,
                basic_salary: salary.basic_salary,
                bonus: salary.bonus || 0,
                advance: salary.advance || 0,
                overtime: salary.overtime || 0,
                total_salary: salary.total_salary,
                salary_date: salary.salary_date,
            });
        }
    }, [salary]);

    const handleChange = (name: string, value: string | number | CalendarDate) => {
        const newFormData = {
            ...formData,
            [name]: value,
        };

        // Recalculate total_salary whenever basic_salary, overtime, bonus, or advance changes
        if (name === "basic_salary" || name === "overtime" || name === "bonus" || name === "advance") {
            newFormData.total_salary =
                (newFormData.basic_salary || 0) +
                (newFormData.overtime || 0) +
                (newFormData.bonus || 0) -
                (newFormData.advance || 0);
        }

        setFormData(newFormData);
    };

    const handleSubmit = async () => {
        if (!salary) return;

        try {
            if (!formData.salary_date) {
                throw new Error("Salary date is required");
            }

            await updateSalary.mutateAsync({
                id: salary.id,
                ...formData,
                salary_date: new Date(formData.salary_date),
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
                        <ModalHeader className="flex flex-col gap-1">Update Salary</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <Input
                                    isRequired
                                    label="Employee ID"
                                    placeholder="Enter employee ID"
                                    variant="bordered"
                                    type="number"
                                    value={formData.employee_id?.toString() || ""}
                                    onChange={(e) => handleChange("employee_id", parseInt(e.target.value))}
                                />
                                <Input
                                    isRequired
                                    label="Basic Salary"
                                    placeholder="Enter basic salary"
                                    variant="bordered"
                                    type="number"
                                    value={formData.basic_salary?.toString()}
                                    onChange={(e) => handleChange("basic_salary", parseFloat(e.target.value))}
                                />
                                <Input
                                    label="Bonus"
                                    placeholder="Enter bonus"
                                    variant="bordered"
                                    type="number"
                                    value={formData.bonus?.toString() || ""}
                                    onChange={(e) => handleChange("bonus", parseFloat(e.target.value))}
                                />
                                <Input
                                    label="Advance"
                                    placeholder="Enter advance"
                                    variant="bordered"
                                    type="number"
                                    value={formData.advance?.toString() || ""}
                                    onChange={(e) => handleChange("advance", parseFloat(e.target.value))}
                                />
                                <Input
                                    label="Overtime"
                                    placeholder="Enter overtime"
                                    variant="bordered"
                                    type="number"
                                    value={formData.overtime?.toString() || ""}
                                    onChange={(e) => handleChange("overtime", parseFloat(e.target.value))}
                                />
                                <Input
                                    isRequired
                                    label="Total Salary"
                                    placeholder="Enter total salary"
                                    variant="bordered"
                                    type="number"
                                    value={formData.total_salary?.toString()}
                                    isReadOnly // Make it read-only since it's calculated automatically
                                />
                                <DatePicker
                                    showMonthAndYearPickers
                                    isRequired
                                    label="Salary Date"
                                    className="w-full rounded-lg"
                                    value={getDatePickerValue(formData.salary_date)}
                                    color="default"
                                    minValue={today(getLocalTimeZone()).subtract({ years: 120 })}
                                    maxValue={today(getLocalTimeZone())}
                                    onChange={(date) => handleChange("salary_date", date)}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit}>
                                Update Salary
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}