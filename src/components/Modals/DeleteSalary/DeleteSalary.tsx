import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";
import { useDeleteSalary } from "../../../hooks/useSalary";
import { Salary } from "../../../types/salary";

interface DeleteSalaryProps {
    isOpen: boolean;
    onClose: () => void;
    salary: Salary | null;
}

export default function DeleteSalary({ isOpen, onClose, salary }: DeleteSalaryProps) {
    const deleteSalary = useDeleteSalary();

    const handleSubmit = () => {
        if (!salary) return;

        deleteSalary.mutateAsync(salary.id);
        onClose();
    };

    return (
        <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Delete Salary</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <p className="text-lg">
                                    Are you sure you want to delete the salary record for{" "}
                                    <span className="font-bold">{salary?.employee.name}</span>?
                                </p>
                                <p className="text-red-600">
                                    This action cannot be undone. Once deleted, the salary record will be
                                    permanently removed.
                                </p>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={handleSubmit}>
                                Delete Salary
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}