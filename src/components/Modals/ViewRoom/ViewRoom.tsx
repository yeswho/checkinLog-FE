import {
    Modal,
    ModalContent
} from "@nextui-org/react";
import RoomCard from "../../Cards/RoomCard/RoomCard";

type Room = {
    id: number;
    name: string;
    floor: { id: number, name: string };
    room_type: { id: number, name: string };
    rate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
};

interface ViewRoomProps {
    isOpen: boolean;
    onClose: () => void;
    room: any;
}

export default function ViewRoom({ isOpen, onClose, room }: ViewRoomProps) {
    return (
        <Modal
            backdrop="blur"
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            scrollBehavior="inside"
        >
            <ModalContent>
                {(onClose) => (
                    <div className="p-0 w-full">
                        <RoomCard room={room} />
                    </div>
                )}
            </ModalContent>
        </Modal>
    );
}