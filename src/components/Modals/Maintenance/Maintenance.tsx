import { CalendarDate } from "@internationalized/date";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useUpdateMaintenance } from "hooks/useMaintenance";
import React from "react";

type Maintenance = {
  id: number;
  room_id: number; // Updated to match backend
  reason: string;
  startDate: string;
  expectedEndDate: string; // Updated to match backend
  createdAt: string;
  updatedAt: string;
};

interface MaintenanceProps {
  isOpen: boolean;
  onClose: () => void;
  maintenance: Maintenance | null;
}

export default function Maintenance({ isOpen, onClose, maintenance }: MaintenanceProps) {

  const update = useUpdateMaintenance();

  const [formData, setFormData] = React.useState({
    room_id: "",
    reason: "",
    startDate: "",
    expectedEndDate: "",
  });

  const getDatePickerValue = (dateString: string) => {
    if (!dateString) return undefined;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return undefined;

      return new CalendarDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      );
    } catch {
      return undefined;
    }
  };

  const formatDateToString = (date: CalendarDate) => {
    if (!date) return "";
    return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
  };

  React.useEffect(() => {
    if (maintenance) {
      setFormData({
        room_id: maintenance.room_id.toString(),
        reason: maintenance.reason,
        startDate: maintenance.startDate,
        expectedEndDate: maintenance.expectedEndDate,
      });
    }
  }, [maintenance]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!maintenance) return;

    const updatedMaintenance = {
      room_id: Number(formData.room_id),
      reason: formData.reason,
      startDate: formData.startDate,
      expectedEndDate: formData.expectedEndDate,
      updatedAt: new Date().toISOString(),
    };

    update.mutate({ id: Number(updatedMaintenance.room_id), ...updatedMaintenance });
    onClose();
  };

  return (
    <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Update Maintenance Record</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  label="Room ID"
                  placeholder="Enter room ID"
                  variant="bordered"
                  value={formData.room_id}
                  onChange={(e) => handleChange("room_id", e.target.value)}
                  isDisabled
                />
                <Input
                  label="Reason"
                  placeholder="Enter maintenance reason"
                  variant="bordered"
                  value={formData.reason}
                  onChange={(e) => handleChange("reason", e.target.value)}
                />
                <DatePicker
                  label="Start Date"
                  value={getDatePickerValue(formData.startDate)}
                  onChange={(date) => handleChange("startDate", formatDateToString(date))}
                  classNames={{
                    base: "w-full",
                  }}
                />
                <DatePicker
                  label="Expected End Date"
                  value={getDatePickerValue(formData.expectedEndDate)}
                  onChange={(date) => handleChange("expectedEndDate", formatDateToString(date))}
                  classNames={{
                    base: "w-full",
                  }}
                  minValue={getDatePickerValue(formData.startDate)}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Update Maintenance
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}