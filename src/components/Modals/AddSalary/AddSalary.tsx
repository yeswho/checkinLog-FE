import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { Button, DatePicker, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import React, { useEffect } from "react";
import { useEmployees } from "../../../hooks/useEmployee";
import { useCreateSalary } from "../../../hooks/useSalary";
import { Employee } from "../../../types/employee";
import { toDate } from "../../../utils/common";

export default function AddSalary({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [advanceInfo, setAdvanceInfo] = React.useState({
        totalAdvance: 0,
        advances: []
    });

    const [formData, setFormData] = React.useState({
        employee_id: 0,
        basic_salary: 0,
        bonus: 0,
        overtime: 0,
        advance: 0,
        total_salary: 0,
        salary_date: null as CalendarDate | null,
    });

    const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);

    const createSalary = useCreateSalary();
    const { data: employees, isLoading: isEmployeesLoading } = useEmployees();

    useEffect(() => {
        if (formData.employee_id) {
            fetch(`/api/employees/${formData.employee_id}/advances`)
                .then(res => res.json())
                .then(data => {
                    setAdvanceInfo(data);
                    // Auto-fill the advance amount from the API
                    setFormData(prev => ({
                        ...prev,
                        advance: data.totalAdvance,
                        total_salary: calculateTotalSalary(prev.basic_salary, prev.bonus, prev.overtime, data.totalAdvance)
                    }));
                });
        }
    }, [formData.employee_id]);

    const calculateTotalSalary = (basic: number, bonus: number, overtime: number, advance: number) => {
        return (basic || 0) + (bonus || 0) + (overtime || 0) - (advance || 0);
    };

    const handleChange = (name: string, value: string | number | CalendarDate) => {
        const newFormData = {
            ...formData,
            [name]: value,
        };

        // Recalculate total_salary whenever relevant fields change
        if (name === "basic_salary" || name === "overtime" || name === "bonus" || name === "advance") {
            newFormData.total_salary = calculateTotalSalary(
                name === "basic_salary" ? Number(value) : newFormData.basic_salary,
                name === "bonus" ? Number(value) : newFormData.bonus,
                name === "overtime" ? Number(value) : newFormData.overtime,
                name === "advance" ? Number(value) : newFormData.advance
            );
        }

        setFormData(newFormData);
    };

    const handleEmployeeChange = (employeeId: string) => {
        const employee = employees?.find((emp) => emp.id === parseInt(employeeId));
        if (employee) {
            setSelectedEmployee(employee);
            setFormData(prev => ({
                ...prev,
                employee_id: employee.id,
                basic_salary: employee.basic_salary,
                bonus: 0,
                overtime: 0,
                advance: 0, // Will be updated by the useEffect
                total_salary: employee.basic_salary,
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            if (!formData.salary_date) {
                throw new Error("Salary date is required");
            }

            if (formData.employee_id === 0) {
                throw new Error("Employee is required");
            }

            await createSalary.mutateAsync({
                ...formData,
                salary_date: toDate(formData.salary_date)
            });

            onClose();
            resetForm();
        } catch (error) {
            console.error("Error creating salary:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            employee_id: 0,
            basic_salary: 0,
            bonus: 0,
            overtime: 0,
            advance: 0,
            total_salary: 0,
            salary_date: null,
        });
        setSelectedEmployee(null);
        setAdvanceInfo({
            totalAdvance: 0,
            advances: []
        });
    };

    return (
        <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="2xl">
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

                                {advanceInfo.totalAdvance > 0 && (
                                    <div className="p-4 bg-default-100 rounded-medium">
                                        <p className="font-medium">Employee Advances: रु {advanceInfo.totalAdvance.toFixed(2)}</p>
                                        <ul className="mt-2 text-sm text-default-600">
                                            {advanceInfo.advances.map((advance: any) => (
                                                <li key={advance.id}>
                                                    {new Date(advance.expense_date).toLocaleDateString()}: रु {advance.amount.toFixed(2)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <Input
                                    isRequired
                                    label="Basic Salary"
                                    placeholder="Enter basic salary"
                                    variant="bordered"
                                    type="number"
                                    value={formData.basic_salary.toString()}
                                    onChange={(e) => handleChange("basic_salary", parseFloat(e.target.value))}
                                    isReadOnly={!!selectedEmployee}
                                />

                                <Input
                                    label="Bonus"
                                    placeholder="Enter bonus"
                                    variant="bordered"
                                    type="number"
                                    value={formData.bonus.toString()}
                                    onChange={(e) => handleChange("bonus", parseFloat(e.target.value))}
                                    min="0"
                                />

                                <Input
                                    label="Overtime"
                                    placeholder="Enter overtime"
                                    variant="bordered"
                                    type="number"
                                    value={formData.overtime.toString()}
                                    onChange={(e) => handleChange("overtime", parseFloat(e.target.value))}
                                    min="0"
                                />

                                <Input
                                    label="Advance Deduction"
                                    placeholder="Advance to deduct"
                                    variant="bordered"
                                    type="number"
                                    value={formData.advance.toString()}
                                    onChange={(e) => handleChange("advance", parseFloat(e.target.value))}
                                    max={advanceInfo.totalAdvance}
                                    min="0"
                                    description={`Maximum available advance: रु ${advanceInfo.totalAdvance.toFixed(2)}`}
                                />

                                <Input
                                    isRequired
                                    label="Total Salary"
                                    placeholder="Total salary"
                                    variant="bordered"
                                    type="number"
                                    value={formData.total_salary.toFixed(2)}
                                    isReadOnly
                                    classNames={{
                                        input: "font-medium"
                                    }}
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
                            <Button 
                                color="primary" 
                                onPress={handleSubmit}
                            >
                                Add Salary
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}