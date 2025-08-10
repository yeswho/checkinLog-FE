import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React from 'react';
import { useDeleteAdditionalCharge } from '../../../hooks/useAdditionalCharge';

export default function DeleteAdditionalCharge({
  bookingId,
  chargeId,
  isOpen,
  onClose,
}: {
  bookingId: number;
  chargeId: number;
  isOpen: boolean;
  onClose: () => void;
}) {
  const deleteAdditionalCharge = useDeleteAdditionalCharge(bookingId);

  const handleDelete = async () => {
    try {
      await deleteAdditionalCharge.mutateAsync(chargeId);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Delete Additional Charge</ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this additional charge?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleDelete}>
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}