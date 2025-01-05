import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React from "react";


import { useCreateFloor } from "../../../hooks/useFloor";


export default function AddFloor({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
  const [formData, setFormData] = React.useState({
    name: "",
  });
  const createFloor = useCreateFloor();

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      await createFloor.mutateAsync(formData);
      onClose();
      setFormData({
        name: ""
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
            <ModalHeader className="flex flex-col gap-1">Add New Floor</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">

                <Input
                  isRequired
                  label="Floor Name"
                  placeholder="Enter floor name"
                  variant="bordered"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Add Floor
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}