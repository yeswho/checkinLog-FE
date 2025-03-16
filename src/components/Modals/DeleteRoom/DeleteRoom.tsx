import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "@nextui-org/react";
import { useDeleteRoom } from "hooks/useRooms";
import { toast } from "sonner";

type Room = {
  id: number;
  name: string;
  floor: { id: number; name: string };
  room_type: { id: number; name: string };
  rate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

interface DeleteRoomProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
}

export default function DeleteRoom({ isOpen, onClose, room }: DeleteRoomProps) {
  const deleteRoom = useDeleteRoom();
  const handleSubmit = () => {
    if (!room) return;
    deleteRoom.mutateAsync(room.id);
    onClose();
  };

  return (
    <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Delete Room</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <p className="text-lg">
                  Are you sure you want to delete the room{" "}
                  <span className="font-bold">{room?.name}</span>?
                </p>
                {room && (
                  <div className="bg-default-100 p-4 rounded-md">
                    <p>
                      <strong>Floor:</strong> {room.floor.name}
                    </p>
                    <p>
                      <strong>Type:</strong> {room.room_type.name}
                    </p>
                    <p>
                      <strong>Rate:</strong> रु{room.rate}
                    </p>
                    <p>
                      <strong>Status:</strong> {room.status}
                    </p>
                  </div>
                )}
                <p className="text-red-600">
                  This action cannot be undone. Once deleted, the room will be
                  permanently removed from the system.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="danger" onPress={handleSubmit}>
                Delete Room
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
