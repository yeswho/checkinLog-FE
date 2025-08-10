import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { Button, DatePicker, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import React from "react";
import { useCreateExpense } from "../../../hooks/useExpense";
import { EXPENSE_CATEGORY } from "../../../types/employee";
import { toDate } from "../../../utils/common";

export default function AddExpense({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [formData, setFormData] = React.useState({
        name: '',
        amount: 0,
        expense_date: null as CalendarDate | null,
        category: EXPENSE_CATEGORY.MISCELLANEOUS,
        remarks: '',
    });

    const createExpense = useCreateExpense();

    const handleChange = (name: string, value: string | number | CalendarDate) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        try {
            if (!formData.expense_date) {
                throw new Error("Expense date is required");
            }

            await createExpense.mutateAsync({
                ...formData,
                expense_date: toDate(formData.expense_date)
            });

            onClose();
            setFormData({
                name: '',
                amount: 0,
                expense_date: null,
                category: EXPENSE_CATEGORY.MISCELLANEOUS, 
                remarks: '',
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Add New Expense</ModalHeader>
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
                                    value={formData.expense_date}
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
                                Add Expense
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}