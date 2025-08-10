import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure
} from '@nextui-org/react';
import React from 'react';
import { useAdditionalCharges } from '../../../hooks/useAdditionalCharge';
import { AdditionalCharge } from '../../../types/booking';
import AddAdditionalCharge from '../AddAdditionalCharge/AddAdditionalCharge';
import DeleteAdditionalCharge from '../DeleteAdditionalCharge/DeleteAdditionalCharge';
import UpdateAdditionalCharge from '../UpdateAdditionalCharge/UpdateAdditionalCharge';

import { Customer } from "../../../types/customer";
import { PAYMENT_MODE, BOOKING_STATUS } from "types/enums";
import { Room } from "types/rooms";

type Booking = {
  id: number;
  customer: Customer;
  rooms: Room[];
  check_in: string;
  check_out: string;
  payment_mode: PAYMENT_MODE;
  totalPrice: number;
  status: BOOKING_STATUS;
  pax: number;
  createdAt: string;
  updatedAt: string;
};

export default function AdditionalChargeModal({ booking, isOpen, onClose }: { booking: Booking | null; isOpen: boolean; onClose: () => void }) {
  const bookingId = booking ? booking.id : 0;
  const { data: additionalCharges, isLoading, isError } = useAdditionalCharges(bookingId);
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [selectedCharge, setSelectedCharge] = React.useState<AdditionalCharge | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !additionalCharges) return <div>Error fetching additional charges.</div>;

  // Safely handle additionalCharges
  const charges = additionalCharges?.additionalCharges ?? [];

  // Calculate total amount
  const totalAmount = charges.reduce((sum, charge) => sum + (charge.amount || 0), 0);

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 pb-2">
              <div>Additional Charges</div>
              {booking && (
                <div className="text-sm text-gray-500">
                  Booking #{booking.id} • {booking.customer.firstname}
                </div>
              )}
            </ModalHeader>
            <ModalBody className="py-4">
              <Table
                aria-label="Additional Charges Table"
                className="mb-2"
              >
                <TableHeader>
                  <TableColumn>Description</TableColumn>
                  <TableColumn>Amount</TableColumn>
                  <TableColumn align="end">Actions</TableColumn>
                </TableHeader>
                <TableBody>
                  {charges.length > 0 ? (
                    charges.map((charge) => (
                      <TableRow key={charge.id} className="transition-colors hover:bg-default-100">
                        <TableCell>{charge.description || 'N/A'}</TableCell>
                        <TableCell>रु. {charge.amount?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="flat"
                              className="transition-transform hover:bg-gray-100 active:scale-95"
                              onPress={() => {
                                setSelectedCharge(charge);
                                onUpdateOpen();
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              color="danger"
                              variant="flat"
                              className="transition-transform hover:bg-red-100 active:scale-95"
                              onPress={() => {
                                setSelectedCharge(charge);
                                onDeleteOpen();
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className="text-center py-6">No additional charges found.</TableCell>
                      <TableCell children={undefined}></TableCell>
                      <TableCell children={undefined}></TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {charges.length > 0 && (
                <div className="flex justify-end mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Total:</span>
                    <span className="font-semibold text-lg">रु. {totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="gap-2 pt-2">
              <Button
                color="danger"
                variant="flat"
                className="transition-transform hover:bg-red-100 active:scale-95"
                onPress={onClose}
              >
                Close
              </Button>

              <Button
                color="primary"
                className="transition-transform hover:opacity-90 active:scale-95"
                onPress={onAddOpen}
              >
                Add Charge
              </Button>

            </ModalFooter>
          </>
        )}
      </ModalContent>

      {/* Add Charge Modal */}
      <AddAdditionalCharge bookingId={bookingId} isOpen={isAddOpen} onClose={onAddClose} />

      {/* Update Charge Modal */}
      {selectedCharge && (
        <UpdateAdditionalCharge
          bookingId={bookingId}
          charge={selectedCharge}
          isOpen={isUpdateOpen}
          onClose={onUpdateClose}
        />
      )}

      {/* Delete Charge Modal */}
      {selectedCharge && (
        <DeleteAdditionalCharge
          bookingId={bookingId}
          chargeId={selectedCharge.id}
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
        />
      )}
    </Modal>
  );
}