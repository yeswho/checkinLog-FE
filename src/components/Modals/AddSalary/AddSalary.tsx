import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { Button, DatePicker, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import React from "react";
import { useEmployees } from "../../../hooks/useEmployee";
import { useCreateSalary } from "../../../hooks/useSalary";
import { Employee } from "../../../types/employee";
import { toDate } from "../../../utils/common";

export default function AddSalary({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [formData, setFormData] = React.useState({
        employee_id: 0,
        basic_salary: 0,
        bonus: 0,
        advance: 0,
        overtime: 0,
        total_salary: 0,
        salary_date: null as CalendarDate | null,
    });

    const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);

    const createSalary = useCreateSalary();
    const { data: employees, isLoading: isEmployeesLoading } = useEmployees();

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

    const handleEmployeeChange = (employeeId: string) => {
        const employee = employees?.find((emp) => emp.id === parseInt(employeeId));
        if (employee) {
            setSelectedEmployee(employee);
            setFormData((prev) => ({
                ...prev,
                employee_id: employee.id,
                basic_salary: employee.basic_salary,
                total_salary: employee.basic_salary,
            }));
        }
    };

    const handleSubmit = async () => {
        try {

            if (!formData.salary_date) {
                throw new Error("Salary date is required");
              }

            await createSalary.mutateAsync({
                ...formData,
                salary_date: toDate(formData.salary_date)}
            );

            onClose();
            setFormData({
                employee_id: 0,
                basic_salary: 0,
                bonus: 0,
                advance: 0,
                overtime: 0,
                total_salary: 0,
                salary_date: null as CalendarDate | null,
            });
            setSelectedEmployee(null);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Add New Salary</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <Select
                                    isRequired
                                    label="Employee"
                                    placeholder="Select an employee"
                                    variant="bordered"
                                    isLoading={isEmployeesLoading}
                                    selectedKeys={selectedEmployee ? [selectedEmployee.id.toString()] : []}
                                    onChange={(e) => handleEmployeeChange(e.target.value)}
                                >
                                    {employees?.map((employee) => (
                                        <SelectItem key={employee.id} value={employee.id}>
                                            {`${employee.name} - ${employee.designation}`}
                                        </SelectItem>
                                    )) || []}
                                </Select>
                                <Input
                                    isRequired
                                    label="Basic Salary"
                                    placeholder="Enter basic salary"
                                    variant="bordered"
                                    type="number"
                                    value={formData.basic_salary.toString()}
                                    onChange={(e) => handleChange("basic_salary", parseFloat(e.target.value))}
                                    isReadOnly // Auto-filled based on selected employee
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
                                    placeholder="Total salary"
                                    variant="bordered"
                                    type="number"
                                    value={formData.total_salary.toString()}
                                    isReadOnly
                                />
                                <DatePicker
                                    showMonthAndYearPickers
                                    isRequired
                                    label="Salary Date"
                                    className="w-full rounded-lg"
                                    value={formData.salary_date}
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
                                Add Salary
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}