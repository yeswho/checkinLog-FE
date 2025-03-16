import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useUpdateRoom } from "hooks/useRooms";
import { useCreateMaintenance } from "hooks/useMaintenance"; // Add this hook
import React from "react";
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

interface UpdateRoomProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
}

const floorOptions = [
  { id: 1, label: "Ground Floor" },
  { id: 2, label: "First Floor" },
  { id: 3, label: "Second Floor" },
  { id: 4, label: "Third Floor" },
  { id: 5, label: "Fourth Floor" },
];

const roomTypeOptions = [
  { id: 1, label: "Double Bed AC" },
  { id: 2, label: "King Size AC" },
  { id: 3, label: "Single Bed Non-AC" },
  { id: 4, label: "Triple Bed AC" },
  { id: 5, label: "Single Bed AC" },
  { id: 6, label: "Family Suite AC" },
  { id: 7, label: "Luxury Suite" },
  { id: 8, label: "Double Bed Non-AC" },
];

const roomStatusOptions = [
  { value: "Available", label: "Available" },
  { value: "Occupied", label: "Occupied" },
  { value: "Under maintainance", label: "Under Maintenance" },
  { value: "Unavailable", label: "Unavailable" },
];

export default function UpdateRoom({ isOpen, onClose, room }: UpdateRoomProps) {
  const updateRoom = useUpdateRoom();
  const createMaintenance = useCreateMaintenance();
  const [formData, setFormData] = React.useState({
    name: "",
    floor_id: new Set<string>([]),
    roomType_id: new Set<string>([]),
    rate: "",
    status: "",
  });

  React.useEffect(() => {
    if (room) {
      setFormData({
        name: room.name,
        floor_id: new Set([room.floor.id.toString()]),
        roomType_id: new Set([room.room_type.id.toString()]),
        rate: room.rate,
        status: room.status,
      });
    }
  }, [room]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!room) return;
  
    const updatedRoom = {
      id: room.id,
      name: formData.name,
      floor_id: Array.from(formData.floor_id)[0],
      roomType_id: Array.from(formData.roomType_id)[0],
      rate: formData.rate,
      status: formData.status,
      updatedAt: new Date().toISOString(),
    };
  
    try {
      await updateRoom.mutateAsync(updatedRoom);
  
      if (formData.status === "Under maintainance") {
        const maintenanceData = {
          room_id: room.id, 
          reason: "Maintenance required",
          startDate: new Date().toISOString(),
          expectedEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await createMaintenance.mutateAsync(maintenanceData);
      }
      onClose();
    } catch (error) {
      toast.error("Failed to update room");
    }
  };

  return (
    <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Update Room</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  autoFocus
                  label="Room Name"
                  placeholder="Enter room name"
                  variant="bordered"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />

                <Select
                  label="Floor"
                  placeholder="Select floor"
                  variant="bordered"
                  selectedKeys={formData.floor_id}
                  onSelectionChange={(keys) => handleChange("floor_id", keys)}
                >
                  {floorOptions.map((floor) => (
                    <SelectItem key={floor.id} value={floor.id}>
                      {floor.label}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Room Type"
                  placeholder="Select room type"
                  variant="bordered"
                  selectedKeys={formData.roomType_id}
                  onSelectionChange={(keys) => handleChange("roomType_id", keys)}
                >
                  {roomTypeOptions.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label="Rate"
                  placeholder="Enter room rate"
                  type="number"
                  variant="bordered"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">रु</span>
                    </div>
                  }
                  value={formData.rate}
                  onChange={(e) => handleChange("rate", e.target.value)}
                />

                <Select
                  label="Status"
                  placeholder="Select status"
                  variant="bordered"
                  selectedKeys={new Set([formData.status])}
                  onSelectionChange={(keys) => handleChange("status", Array.from(keys)[0])}
                >
                  {roomStatusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Update Room
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}