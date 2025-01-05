import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "@nextui-org/react";
import { toast } from "sonner";

type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  contact: string;
  gender: string;
  dateOfBirth: string;
  company: string;
  createdAt: string;
  updatedAt: string;
};

interface DeleteCustomerProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export default function DeleteCustomer({ isOpen, onClose, customer }: DeleteCustomerProps) {
  const handleSubmit = () => {
    if (!customer) return;
    console.log("Deleted customer:", customer);
    toast.success("Customer deleted!");
    onClose();
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Delete Customer</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <p className="text-lg">
                  Are you sure you want to delete the customer{" "}
                  <span className="font-bold">
                    {customer?.firstName} {customer?.lastName}
                  </span>?
                </p>
                {customer && (
                  <div className="bg-default-100 p-4 rounded-md space-y-2">
                    <p>
                      <strong>Email:</strong> {customer.email}
                    </p>
                    <p>
                      <strong>Contact:</strong> {customer.contact}
                    </p>
                    <p>
                      <strong>Address:</strong> {customer.address}
                    </p>
                    <p>
                      <strong>Company:</strong> {customer.company}
                    </p>
                    <p>
                      <strong>Gender:</strong> {customer.gender}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong>{" "}
                      {new Date(customer.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <p className="text-red-600">
                  This action cannot be undone. Once deleted, the customer information will be
                  permanently removed from the system.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="danger" onPress={handleSubmit}>
                Delete Customer
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}