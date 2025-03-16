import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, User } from "@nextui-org/react";
import { toast } from "sonner";
import { useDeleteComplaint } from "../../../hooks/useComplaint";

type Room = {
  id: number;
  name: string;
  floor: { id: number; name: string };
  room_type: { id: number; name: string };
  status: string;
  rate: string;
  createdAt: string;
  updatedAt: string;
};

type Customer = {
  id: number;
  firstname: string;
  lastname: string;
  address: string;
  dateofbirth: string;
  contact: string;
  email: string;
  gender: string;
  company: string;
  createdAt: string;
  updatedAt: string;
};

interface DeleteComplaintProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    room?: Room;
    customer?: Customer;
  } | null;
}

export default function DeleteComplaint({ isOpen, onClose, complaint }: DeleteComplaintProps) {
  const deleteComplaintMutation = useDeleteComplaint();

  const handleSubmit = () => {
    if (!complaint) return;

    deleteComplaintMutation.mutate(complaint.id);
    onClose();
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Delete Complaint</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <p className="text-danger">Are you sure you want to delete this complaint?</p>

                {complaint?.customer && (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Customer Information</p>
                    <User
                      name={`${complaint.customer.firstname} ${complaint.customer.lastname}`}
                      description={complaint.customer.email}
                    >
                      {complaint.customer.contact}
                    </User>
                  </div>
                )}

                {complaint?.room && (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Room Information</p>
                    <div className="flex flex-col">
                      <p className="text-sm">{complaint.room?.name}</p>
                      <p className="text-xs text-default-500">
                        {`${complaint.room.room_type?.name} - Floor ${complaint.room.floor?.name}`}
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-sm text-danger">
                  This action cannot be undone. This will permanently delete the complaint.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="danger" onPress={handleSubmit}>
                Delete Complaint
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}