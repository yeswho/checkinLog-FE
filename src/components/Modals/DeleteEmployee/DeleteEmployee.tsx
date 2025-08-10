import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";
import { toast } from "sonner";
import { useDeleteEmployee } from "../../../hooks/useEmployee";
import { Employee } from "../../../types/employee";

interface DeleteEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export default function DeleteEmployee({ isOpen, onClose, employee }: DeleteEmployeeProps) {
  const deleteEmployee = useDeleteEmployee();

  const handleSubmit = () => {
    if (!employee) return;

    deleteEmployee.mutateAsync(employee.id, {
      onSuccess: () => {
        toast.success("Employee deleted successfully!");
        onClose();
      },
      onError: (error) => {
        toast.error("Failed to delete employee");
      },
    });
  };

  return (
    <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Delete Employee</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <p className="text-lg">
                  Are you sure you want to delete the employee{" "}
                  <span className="font-bold">{employee?.name}</span>?
                </p>
                <p className="text-red-600">
                  This action cannot be undone. Once deleted, the employee record will be
                  permanently removed.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Delete Employee
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}