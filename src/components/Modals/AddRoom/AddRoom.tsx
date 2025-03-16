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
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { useCreateRoom } from "../../../hooks/useRooms";
import { PlusIcon } from "../../Tables/PlusIcon";
import AddFloor from "../AddFloor/AddFloor";
import AddRoomType from "../AddRoomType/AddRoomType";
import { useFloors } from "hooks/useFloor";
import { useRoomTypes } from "hooks/useRoomType";
import { Label } from "recharts";
import { Spinner } from "@heroui/react";


// const floorOptions = [
//   { id: 1, label: "Ground Floor" },
//   { id: 2, label: "First Floor" },
//   { id: 3, label: "Second Floor" },
//   { id: 4, label: "Third Floor" },
//   { id: 5, label: "Fourth Floor" },
// ];

// const roomTypeOptions = [
//   { id: 1, label: "Single Bed AC" },
//   { id: 2, label: "Single Bed Non-AC" },
//   { id: 3, label: "Double Bed AC" },
//   { id: 4, label: "Double Bed Non-AC" },
//   { id: 5, label: "Triple Bed AC" },
//   { id: 6, label: "King Size AC" },
//   { id: 7, label: "Family Suite AC" },
//   { id: 8, label: "Luxury Suite" },
// ];

const roomStatusOptions = [
  { value: "Available", label: "Available" },
  { value: "Occupied", label: "Occupied" },
  { value: "Under maintainance", label: "Under Maintenance" },
  { value: "Unavailable", label: "Unavailable" },
];

export default function AddRoom({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = React.useState({
    name: "",
    floor_id: "",
    roomType_id: "",
    rate: "",
    status: "Available"
  });
  const { isOpen: isFloorOpen, onOpen: onFloorOpen, onClose: onFloorClose } = useDisclosure();
  const { isOpen: isRoomTypeOpen, onOpen: onRoomTypeOpen, onClose: onRoomTypeClose } = useDisclosure();
  const createRoom = useCreateRoom();
  const { data: floors, isLoading: floorIsLoading, error: floorFetchError } = useFloors();
  const { data: roomTypes, isLoading: roomTypeIsLoading, error: roomTypeFetchError } = useRoomTypes();

  const floorOptions = floors
    ? floors.map(floor => ({ id: floor.id, label: floor.name }))
    : [];

  if (floorIsLoading) {
    return  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
    <Spinner
      classNames={{
        base: "scale-150",
        label: "text-foreground mt-4",
      }}
      color="primary"
    />
  </div>;;
  }

  if (floorFetchError) {
    return <div>Error loading floors: {floorFetchError.message}</div>;
  }

  const roomTypeOptions = roomTypes ? roomTypes.map(roomType => ({ id: roomType.id, Label: roomType.name })) : [];

  if (roomTypeIsLoading) {
    return  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
        <Spinner
          classNames={{
            base: "scale-150",
            label: "text-foreground mt-4",
          }}
          color="primary"
        />
      </div>;
  }

  if (roomTypeFetchError) {
    return <div>Error loading room types: {roomTypeFetchError.message}</div>
  }

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      await createRoom.mutateAsync(formData);
      onClose();
      setFormData({
        name: "",
        floor_id: "",
        roomType_id: "",
        rate: "",
        status: "Available"
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Modal
        backdrop={"blur"}
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add New Room</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    isRequired
                    autoFocus
                    label="Room Name"
                    placeholder="Enter room name"
                    variant="bordered"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />

                  <div className="flex gap-2 items-end">
                    <Select
                      isRequired
                      label="Floor"
                      placeholder="Select floor"
                      variant="bordered"
                      selectedKeys={formData.floor_id ? [formData.floor_id] : []}
                      onChange={(e) => handleChange("floor_id", e.target.value)}
                      className="flex-1"
                    >
                      {floorOptions.map((floor) => (
                        <SelectItem key={floor.id} value={floor.id}>
                          {floor.label}
                        </SelectItem>
                      ))}
                    </Select>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onPress={() => {
                        onFloorOpen();
                      }}
                      className="mb-2"
                    >
                      <PlusIcon size={18} width={undefined} height={undefined} />
                    </Button>
                  </div>
                  <div className="flex gap-2 items-end">
                    <Select
                      isRequired
                      label="Room Type"
                      placeholder="Select room type"
                      variant="bordered"
                      selectedKeys={formData.roomType_id ? [formData.roomType_id] : []}
                      onChange={(e) => handleChange("roomType_id", e.target.value)}
                    >
                      {roomTypeOptions.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.Label}
                        </SelectItem>
                      ))}
                    </Select>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onPress={() => {
                        onRoomTypeOpen();
                      }}
                      className="mb-2"
                    >
                      <PlusIcon size={18} width={undefined} height={undefined} />
                    </Button>
                  </div>
                  <Input
                    isRequired
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
                    isRequired
                    label="Status"
                    placeholder="Select status"
                    variant="bordered"
                    selectedKeys={[formData.status]}
                    onChange={(e) => handleChange("status", e.target.value)}
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
                  Add Room
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <AddFloor isOpen={isFloorOpen}
        onClose={onFloorClose} />
      <AddRoomType isOpen={isRoomTypeOpen}
        onClose={onRoomTypeClose} />
    </div>
  );
}