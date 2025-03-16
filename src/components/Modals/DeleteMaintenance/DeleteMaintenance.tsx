import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useDeleteMaintenance } from "hooks/useMaintenance"; 
import { toast } from "sonner";

type Maintenance = {
  id: number;
  room_id: number;
  reason: string;
  startDate: string;
  expectedEndDate: string;
  createdAt: string;
  updatedAt: string;
  room: {
    id: number;
    name: string;
    floor: { id: number; name: string };
    room_type: { id: number; name: string };
    rate: string;
    status: string;
  };
};

interface MakeAvailableProps {
  isOpen: boolean;
  onClose: () => void;
  maintenance: Maintenance | null;
}

export default function MakeAvailable({ isOpen, onClose, maintenance }: MakeAvailableProps) {
  const deleteMaintenance = useDeleteMaintenance();

  const handleSubmit = () => {
    if (!maintenance) return;

    deleteMaintenance.mutateAsync(maintenance.id, {
      onSuccess: () => {
        toast.success("Room is now available!");
        onClose();
      },
      onError: (error) => {
        toast.error("Failed to make room available");
      },
    });
  };

  return (
    <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Make Room Available</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <p className="text-lg">
                  Are you sure you want to make the room{" "}
                  <span className="font-bold">{maintenance?.room.name}</span> available?
                </p>
                {maintenance && (
                  <div className="bg-default-100 p-4 rounded-md">
                    <p>
                      <strong>Reason for Maintenance:</strong> {maintenance.reason}
                    </p>
                    <p>
                      <strong>Start Date:</strong>{" "}
                      {new Date(maintenance.startDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Expected End Date:</strong>{" "}
                      {new Date(maintenance.expectedEndDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <p className="text-green-600">
                  This action cannot be undone. Once the room is made available, the
                  maintenance record will be permanently deleted.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="success"
                onPress={handleSubmit}
                className="text-green-200"
                style={{ backgroundColor: "#006400" }}
              >
                Make Available
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}