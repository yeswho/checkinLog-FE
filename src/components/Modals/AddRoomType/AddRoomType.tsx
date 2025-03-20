import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
} from "@nextui-org/react";
import { useCreateRoomType } from "hooks/useRoomType";
import React from "react";

export default function AddRoomType({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = React.useState({
    name: "",
    bed: "",
    ac: false,
    bathroom: false,
  });

  const createRoomType = useCreateRoomType();

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {

    const formattedData = {
      ...formData,
      bed: parseInt(formData.bed, 10),
    };

    try {
      await createRoomType.mutateAsync(formattedData);
      onClose();
      setFormData({
        name: "",
        bed: "",
        ac: false,
        bathroom: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add New Room Type
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  isRequired
                  label="Name"
                  placeholder="Enter type name"
                  variant="bordered"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                <Input
                  isRequired
                  label="Number of Beds"
                  type="number"
                  placeholder="Enter number of beds"
                  variant="bordered"
                  value={formData.bed}
                  onChange={(e) => handleChange("bed", e.target.value)}
                />
                <div className="flex items-center gap-4">
                  <label>AC Avilability:</label>
                  <Switch
                    value={formData.ac.toString()}
                    checked={formData.ac}
                    onChange={(e) => handleChange("ac", e.target.checked)}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label>Bathroom Avilability:</label>
                  <Switch
                    checked={formData.bathroom}
                    onChange={(e) => handleChange("bathroom", e.target.checked)}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Add Room Type
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
