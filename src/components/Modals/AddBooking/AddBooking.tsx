import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Chip,
  DatePicker,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { toast } from "sonner";
import AddCustomer from "../AddCustomer/AddCustomer";
import { PlusIcon } from "../../Tables/PlusIcon";

// Sample data - replace with your actual data
const customerOptions = [
  { id: 1, label: "John Doe" },
  { id: 2, label: "Jane Smith" },
  { id: 3, label: "Bob Johnson" },
];

const roomOptions = [
  { id: 1, label: "101 - Single Bed AC" },
  { id: 2, label: "102 - Double Bed AC" },
  { id: 3, label: "201 - Luxury Suite" },
];

const paymentModeOptions = [
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Card" },
  { value: "UPI", label: "UPI" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
];

export default function AddBooking({ isOpen, onClose, room }: { isOpen: boolean; onClose: () => void; room: any }) {
  const [formData, setFormData] = React.useState({
    customer_id: "",
    room_ids: [] as string[],
    checkIn: null as CalendarDate | null,
    checkOut: null as CalendarDate | null,
    numberOfGuests: "",
    paymentMode: "CASH",
  });

  const [selectedRooms, setSelectedRooms] = React.useState<Array<typeof roomOptions[0]>>([]);
  const { isOpen: isCustomerOpen, onOpen: onCustomerOpen, onClose: onCustomerClose } = useDisclosure();

  useEffect(() => {
    if (room?.id && isOpen) {
      setSelectedRooms([{
        id: room.id,
        label: room.name || `Room ${room.id}`
      }]);
      setFormData(prev => ({
        ...prev,
        room_ids: [room.id.toString()]
      }));
    }
  }, [room, isOpen]);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoomSelect = (roomId: string) => {
    const room = roomOptions.find(r => r.id.toString() === roomId);
    if (room && !selectedRooms.find(r => r.id.toString() === roomId)) {
      setSelectedRooms([...selectedRooms, room]);
      setFormData(prev => ({
        ...prev,
        room_ids: [...prev.room_ids, roomId]
      }));
    }
  };

  const handleRemoveRoom = (roomId: number) => {
    setSelectedRooms(selectedRooms.filter(room => room.id !== roomId));
    setFormData(prev => ({
      ...prev,
      room_ids: prev.room_ids.filter(id => id !== roomId.toString())
    }));
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    toast.success("Booking added successfully!");
    onClose();
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
              <ModalHeader className="flex flex-col gap-1">Add New Booking</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2 items-end">
                    <Select
                      isRequired
                      autoFocus
                      label="Customer"
                      placeholder="Select customer"
                      variant="bordered"
                      selectedKeys={formData.customer_id ? [formData.customer_id] : []}
                      onChange={(e) => handleChange("customer_id", e.target.value)}
                    >
                      {customerOptions.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.label}
                        </SelectItem>
                      ))}
                    </Select>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onPress={() => {
                        onCustomerOpen();
                      }}
                      className="mb-2"
                    >
                      <PlusIcon size={18} width={undefined} height={undefined} />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Select
                      isRequired
                      label="Rooms"
                      placeholder="Select rooms"
                      variant="bordered"
                      onChange={(e) => handleRoomSelect(e.target.value)}
                    >
                      {roomOptions.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <div className="flex flex-wrap items-center gap-2">
                      {selectedRooms.length != 0 && <p className="text-sm font-medium">Selected rooms:</p>}
                      {selectedRooms.map((room) => (
                        <Chip
                          key={room.id}
                          onClose={() => handleRemoveRoom(room.id)}
                          variant="flat"
                          className="cursor-pointer text-xs"
                        >
                          {room.label}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <DatePicker
                    isRequired
                    label="Check-In Date"
                    className="w-full rounded-lg"
                    minValue={today(getLocalTimeZone())}
                    value={formData.checkIn}
                    color="default"
                    onChange={(date) => handleChange("checkIn", date)}
                  />

                  <DatePicker
                    isRequired
                    label="Check-Out Date"
                    className="w-full rounded-lg"
                    minValue={formData.checkIn?.add({ days: 1 }) || today(getLocalTimeZone())}
                    value={formData.checkOut}
                    onChange={(date) => handleChange("checkOut", date)}
                  />

                  <Input
                    isRequired
                    label="Pax"
                    placeholder="Enter number of guests"
                    variant="bordered"
                    value={formData.numberOfGuests}
                    onChange={(e) => handleChange("numberOfGuests", e.target.value)}
                  />

                  <Select
                    label="Payment Mode"
                    placeholder="Select payment mode"
                    variant="bordered"
                    selectedKeys={formData.paymentMode ? [formData.paymentMode] : []}
                    onChange={(e) => handleChange("paymentMode", e.target.value)}
                  >
                    {paymentModeOptions.map((mode) => (
                      <SelectItem key={mode.value} value={mode.value}>
                        {mode.label}
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
                  Add Booking
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <AddCustomer isOpen={isCustomerOpen}
        onClose={onCustomerClose} />
    </div>
  );
}