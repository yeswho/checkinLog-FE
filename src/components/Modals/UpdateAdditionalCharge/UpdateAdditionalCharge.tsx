import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React from 'react';
import { useUpdateAdditionalCharge } from '../../../hooks/useAdditionalCharge';
import { AdditionalCharge } from '../../../types/booking';

export default function UpdateAdditionalCharge({
  bookingId,
  charge,
  isOpen,
  onClose,
}: {
  bookingId: number;
  charge: AdditionalCharge;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = React.useState({
    description: charge.description,
    amount: charge.amount,
    isFood: charge.isFood,
  });
  const updateAdditionalCharge = useUpdateAdditionalCharge(bookingId);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateAdditionalCharge.mutateAsync({ id: charge.id, ...formData });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Update Additional Charge</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  isRequired
                  label="Description"
                  placeholder="Enter description"
                  variant="bordered"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
                <Input
                  isRequired
                  label="Amount"
                  placeholder="Enter amount"
                  type="number"
                  variant="bordered"
                  value={formData.amount.toString()}
                  onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFood"
                    checked={formData.isFood}
                    onChange={(e) => handleChange('isFood', e.target.checked)}
                  />
                  <label htmlFor="isFood">Add to food bill</label>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Update Charge
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}