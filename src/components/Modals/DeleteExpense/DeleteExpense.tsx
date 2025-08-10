import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useDeleteExpense } from "../../../hooks/useExpense";
import { Expense } from "../../../types/expense";

interface DeleteExpenseProps {
    isOpen: boolean;
    onClose: () => void;
    expense: Expense | null;
}

export default function DeleteExpense({ isOpen, onClose, expense }: DeleteExpenseProps) {
    const deleteExpense = useDeleteExpense();

    const handleSubmit = () => {
        if (!expense) return;

        deleteExpense.mutateAsync(expense.id);
        onClose();
    };

    return (
        <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Delete Expense</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <p className="text-lg">
                                    Are you sure you want to delete the expense record for{" "}
                                    <span className="font-bold">{expense?.name}</span>?
                                </p>
                                <p className="text-red-600">
                                    This action cannot be undone. Once deleted, the expense record will be
                                    permanently removed.
                                </p>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit}>
                                Delete Expense
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}