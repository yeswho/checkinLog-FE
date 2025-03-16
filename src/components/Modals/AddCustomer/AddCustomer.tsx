import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useCreateCustomer } from "hooks/useCustomer";
import React from "react";
import { toDate } from "../../../utils/common";

export default function AddCustomer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {

  const createCustomer = useCreateCustomer();

  const [formData, setFormData] = React.useState({
    firstname: "",
    lastname: "",
    address: "",
    dateofbirth: null as CalendarDate | null,
    contact: "",
    email: "",
    gender: "",
    company: ""
  });

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async () => {
    try {
      if (!formData.dateofbirth) {
        throw new Error("Date of birth is required");
      }

      await createCustomer.mutateAsync({
        ...formData,
        dateofbirth: toDate(formData.dateofbirth),
      });

      onClose();

      setFormData({
        firstname: "",
        lastname: "",
        address: "",
        dateofbirth: null as CalendarDate | null,
        contact: "",
        email: "",
        gender: "",
        company: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      backdrop={"blur"}
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Add New Customer</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <Input
                    isRequired
                    label="First Name"
                    placeholder="Enter first name"
                    variant="bordered"
                    value={formData.firstname}
                    onChange={(e) => handleChange("firstname", e.target.value)}
                  />
                  <Input
                    isRequired
                    label="Last Name"
                    placeholder="Enter last name"
                    variant="bordered"
                    value={formData.lastname}
                    onChange={(e) => handleChange("lastname", e.target.value)}
                  />
                </div>

                <Input
                  isRequired
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  variant="bordered"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />

                <Input
                  isRequired
                  label="Contact"
                  type="number"
                  placeholder="Enter contact number"
                  variant="bordered"
                  value={formData.contact}
                  onChange={(e) => handleChange("contact", e.target.value)}
                />


                <Input
                  label="Address"
                  placeholder="Enter address"
                  variant="bordered"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />

                <div className="flex gap-4">
                  <DatePicker
                    showMonthAndYearPickers
                    isRequired
                    label="Date of Birth"
                    className="w-full rounded-lg"
                    value={formData.dateofbirth}
                    color="default"
                    minValue={today(getLocalTimeZone()).subtract({ years: 120 })}
                    maxValue={today(getLocalTimeZone())}
                    onChange={(date) => handleChange("dateofbirth", date)}
                  />

                  <Select
                    isRequired
                    label="Gender"
                    placeholder="Select gender"
                    variant="bordered"
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  >
                    <SelectItem key="Male" value="Male">Male</SelectItem>
                    <SelectItem key="Female" value="Female">Female</SelectItem>
                    <SelectItem key="Other" value="Other">Other</SelectItem>
                  </Select>
                </div>

                <Input
                  label="Company"
                  placeholder="Enter company name"
                  variant="bordered"
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Add Customer
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}