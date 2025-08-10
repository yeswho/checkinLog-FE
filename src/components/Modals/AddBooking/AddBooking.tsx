import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  DatePicker,
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
import { useCreateBooking } from "hooks/useBooking";
import { useCustomersSearch } from "hooks/useCustomer";
import { useRooms } from "hooks/useRooms";
import React, { Key, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { BOOKING_STATUS, PAYMENT_MODE } from "../../../types/enums";
import { PlusIcon } from "../../Tables/PlusIcon";
import AddCustomer from "../AddCustomer/AddCustomer";

const paymentModeOptions = [
  { value: "Cash", label: "Cash" },
  { value: "Card", label: "Card" },
  { value: "Online", label: "Online" },
  { value: "UPI", label: "UPI" },
  { value: "Cheque", label: "Cheque" },
  { value: "Other", label: "Other" },
];

const BookingStatusOptions = [
  { value: "Cancelled", label: "Cancelled" },
  { value: "Completed", label: "Completed" },
  { value: "No show", label: "No show" },
  { value: "Checked out", label: "Checked out" },
  { value: "Checked in", label: "Checked in" },
  { value: "Booked", label: "Booked" },
];

export default function AddBooking({ isOpen, onClose, room }: { isOpen: boolean; onClose: () => void; room: any }) {
  const [formData, setFormData] = useState({
    customer: "",
    room_ids: [] as string[],
    checkIn: null as CalendarDate | null,
    checkOut: null as CalendarDate | null,
    numberOfGuests: "",
    paymentMode: "Cash" as PAYMENT_MODE,
    status: "Booked" as BOOKING_STATUS,
  });

  const createBooking = useCreateBooking();

  const [selectedRooms, setSelectedRooms] = useState<Array<{ id: number; label: string }>>([]);
  const { isOpen: isCustomerOpen, onOpen: onCustomerOpen, onClose: onCustomerClose } = useDisclosure();
  const [selectedCustomerKey, setSelectedCustomerKey] = useState<Key | null>(null);


  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  // Fetch customers based on the debounced search query
  const { data: customers = [], isLoading: isCustomersLoading } = useCustomersSearch(debouncedQuery);

  // Format customers for Autocomplete
  const formattedCustomers = customers.map(customer => ({
    key: customer.id.toString(),
    label: `${customer.firstname} ${customer.lastname} (${customer.email})`,
    value: customer.id.toString()
  }));

  // Fetch rooms
  const { data: rooms = [], isLoading: isRoomsLoading } = useRooms();

  useEffect(() => {
    if (room?.id && isOpen) {
      setSelectedRooms([{
        id: room.id,
        label: room?.name || `Room ${room?.id}`
      }]);
      setFormData(prev => ({
        ...prev,
        room_ids: [room.id.toString()]
      }));
    }
  }, [room, isOpen]);

  const handleCustomerSelect = (key: Key | null) => {

    if (key) {
      setSelectedCustomerKey(key);
      setFormData(prev => ({
        ...prev,
        customer: key.toString()
      }));
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoomSelect = (roomId: string) => {
    const room = rooms.find(r => r.id.toString() === roomId);
    if (room && !selectedRooms.find(r => r.id.toString() === roomId)) {
      setSelectedRooms([...selectedRooms, {
        id: room.id,
        label: room?.name || `Room ${room.id}`
      }]);
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
    const payload = {
      customer_id: parseInt(formData.customer),
      room_id: formData.room_ids.map(id => parseInt(id)),
      check_in: formData.checkIn ? new Date(formData.checkIn.year, formData.checkIn.month - 1, formData.checkIn.day, 0, 0, 0) : new Date(),
      check_out: formData.checkOut ? new Date(formData.checkOut.year, formData.checkOut.month - 1, formData.checkOut.day, 0, 0, 0) : new Date(),
      pax: parseInt(formData.numberOfGuests),
      payment_mode: formData.paymentMode,
      status: formData.status,
    };

    console.log("New booking payload:", payload);

    createBooking.mutate(payload);
    onClose();
  };

  return (
    <div>
      <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add New Booking</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2 items-end">
                    <Autocomplete
                      isRequired
                      label="Customer"
                      placeholder="Search customer name or email"
                      className="flex-1"
                      defaultItems={formattedCustomers}
                      selectedKey={formData.customer} // Use the form state directly
                      onSelectionChange={handleCustomerSelect}
                      onInputChange={setSearchQuery}
                      inputValue={formattedCustomers.find(c => c.key === formData.customer)?.label || ""} // Control the input value
                      allowsCustomValue={false} // Prevent custom values
                      isLoading={isCustomersLoading}
                    >
                      {(item) => (
                        <AutocompleteItem key={item.key} value={item.value}>
                          {item.label}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onPress={onCustomerOpen}
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
                      isLoading={isRoomsLoading}
                    >
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room?.name}
                        </SelectItem>
                      ))}
                    </Select>

                    <div className="flex flex-wrap items-center gap-2">
                      {selectedRooms.length !== 0 && <p className="text-sm font-medium">Selected rooms:</p>}
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

                  <Select
                    label="Booking Status"
                    placeholder="Select booking status"
                    variant="bordered"
                    selectedKeys={formData.status ? [formData.status] : []}
                    onChange={(e) => handleChange("status", e.target.value)}
                  >
                    {BookingStatusOptions.map((mode) => (
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
      <AddCustomer isOpen={isCustomerOpen} onClose={onCustomerClose} />
    </div>
  );
}