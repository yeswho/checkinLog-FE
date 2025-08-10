import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { Button, DatePicker, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import React from "react";
import { useUpdateExpense } from "../../../hooks/useExpense";
import { Expense } from "../../../types/expense";
import { EXPENSE_CATEGORY } from "../../../types/employee";
import { toDate } from "../../../utils/common";

interface UpdateExpenseProps {
    isOpen: boolean;
    onClose: () => void;
    expense: Expense | null;
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

export default function UpdateExpense({ isOpen, onClose, expense }: UpdateExpenseProps) {
    const [formData, setFormData] = React.useState({
        name: '',
        amount: 0,
        expense_date: '',
        category: EXPENSE_CATEGORY.MISCELLANEOUS,
        remarks: '',
    });

    const updateExpense = useUpdateExpense();

    React.useEffect(() => {
        if (expense) {
            setFormData({
                name: expense.name,
                amount: expense.amount,
                expense_date: expense.expense_date.toString(),
                category: expense.category,
                remarks: expense.remarks,
            });
        }
    }, [expense]);

    const handleChange = (name: string, value: string | number | CalendarDate) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        if (!expense) return;

        try {
            if (!formData.expense_date) {
                throw new Error("Expense date is required");
            }

            await updateExpense.mutateAsync({
                id: expense.id,
                ...formData,
                expense_date: new Date(formData.expense_date),
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
                        <ModalHeader className="flex flex-col gap-1">Update Expense</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <Input
                                    isRequired
                                    label="Name"
                                    placeholder="Enter expense name"
                                    variant="bordered"
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                />
                                <Input
                                    isRequired
                                    label="Amount"
                                    placeholder="Enter amount"
                                    variant="bordered"
                                    type="number"
                                    value={formData.amount.toString()}
                                    onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
                                />
                                <Select
                                    isRequired
                                    label="Category"
                                    placeholder="Select expense category"
                                    variant="bordered"
                                    selectedKeys={[formData.category]}
                                    onChange={(e) => handleChange("category", e.target.value as EXPENSE_CATEGORY)}
                                >
                                    {Object.values(EXPENSE_CATEGORY).map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category.replace(/_/g, ' ')}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Input
                                    label="Remarks"
                                    placeholder="Enter remarks (optional)"
                                    variant="bordered"
                                    value={formData.remarks}
                                    onChange={(e) => handleChange("remarks", e.target.value)}
                                />
                                <DatePicker
                                    showMonthAndYearPickers
                                    isRequired
                                    label="Expense Date"
                                    className="w-full rounded-lg"
                                    value={getDatePickerValue(formData.expense_date)}
                                    color="default"
                                    minValue={today(getLocalTimeZone()).subtract({ years: 120 })}
                                    maxValue={today(getLocalTimeZone())}
                                    onChange={(date) => handleChange("expense_date", date)}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit}>
                                Update Expense
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}