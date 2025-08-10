import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";
import { useDeleteRoomType } from "../../../hooks/useRoomType";
import { RoomType } from "../../../types/roomType";

interface DeleteRoomTypeProps {
    isOpen: boolean;
    onClose: () => void;
    roomType: RoomType | null;
}

export default function DeleteRoomType({ isOpen, onClose, roomType }: DeleteRoomTypeProps) {
    const deleteRoomType = useDeleteRoomType();

    const handleSubmit = () => {
        if (!roomType) return;

        deleteRoomType.mutateAsync(roomType.id);
        onClose();
    };

    return (
        <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Delete Room Type</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <p className="text-lg">
                                    Are you sure you want to delete the room type{" "}
                                    <span className="font-bold">{roomType?.name}</span>?
                                </p>
                                <p className="text-red-600">
                                    This action cannot be undone. Once deleted, the room type will be
                                    permanently removed and any rooms associated with this type will need to be updated.
                                </p>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="danger" onPress={handleSubmit}>
                                Delete Room Type
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}