import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Pagination,
  Spinner
} from "@nextui-org/react";
import React from "react";
import { useBookingsByCustomerId } from "../../../hooks/useBooking";
import { Customer } from "../../../types/customer";
import { BOOKING_STATUS, PAYMENT_MODE } from "../../../types/enums";

type Room = {
  id: number;
  name: string;
  floor: {
    name: string;
  };
  roomType: {
    name: string;
  };
  rate: number;
};

type BookingGetCustomer = {
  id: number;
  customer_id: number;
  rooms: Room[];
  check_in: string;
  check_out: string;
  duration: number;
  totalPrice: number;
  status: BOOKING_STATUS;
  pax: number;
  payment_mode: PAYMENT_MODE;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
};

type BookingsResponse = {
  bookings: BookingGetCustomer[];
};

interface CustomerBookingProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export default function CustomerBooking({ isOpen, onClose, customer }: CustomerBookingProps) {
  const { data: bookingsResponse, isLoading, isError, error } = useBookingsByCustomerId(customer?.id || 0);
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  // Extract the `bookings` array from the response
  const bookings = bookingsResponse?.bookings || [];

  const paginatedBookings = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return bookings.slice(start, end);
  }, [bookings, page]);

  const pages = Math.ceil(bookings.length / rowsPerPage);

  // Handle loading state
  if (isLoading) {
    return (
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <User
              name={`${customer?.firstname} ${customer?.lastname}`}
              description={customer?.email}
            >
              {customer?.contact}
            </User>
            <p className="text-sm text-default-500">All Bookings</p>
          </ModalHeader>
          <ModalBody>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
              <Spinner
                classNames={{
                  base: "scale-150",
                  label: "text-foreground mt-4",
                }}
                color="primary"
              />
            </div>;
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <User
              name={`${customer?.firstname} ${customer?.lastname}`}
              description={customer?.email}
            >
              {customer?.contact}
            </User>
            <p className="text-sm text-default-500">All Bookings</p>
          </ModalHeader>
          <ModalBody>
            <div className="flex justify-center items-center h-40">
              <p className="text-danger">Error fetching bookings: {error?.message}</p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <User
                name={`${customer?.firstname} ${customer?.lastname}`}
                description={customer?.email}
              >
                {customer?.contact}
              </User>
              <p className="text-sm text-default-500">All Bookings</p>
            </ModalHeader>
            <ModalBody>
              <Table
                aria-label="Customer Bookings"
                bottomContent={
                  <div className="flex w-full justify-center">
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color="primary"
                      page={page}
                      total={pages}
                      onChange={(page) => setPage(page)}
                    />
                  </div>
                }
              >
                <TableHeader>
                  <TableColumn>Booking ID</TableColumn>
                  <TableColumn>Rooms</TableColumn>
                  <TableColumn>Check-in</TableColumn>
                  <TableColumn>Check-out</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn>Payment Mode</TableColumn>
                  <TableColumn>Total Room Price</TableColumn>
                  <TableColumn>Pax</TableColumn>
                  <TableColumn>Created At</TableColumn>
                </TableHeader>
                <TableBody>
                  {paginatedBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {booking.rooms.map((room) => (
                            <div key={room.id} className="flex flex-col">
                              <p className="text-sm">{room.name}</p>
                              <p className="text-xs text-default-500">
                                {`${room.floor.name} - ${room.roomType.name} - रु.${room.rate}/night`}
                              </p>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(booking.check_in).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(booking.check_out).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          color={
                            booking.status === BOOKING_STATUS.BOOKED
                              ? "primary"
                              : booking.status === BOOKING_STATUS.CHECKED_OUT
                                ? "warning"
                                : booking.status === BOOKING_STATUS.CHECKED_IN
                                  ? "success"
                                  : booking.status === BOOKING_STATUS.COMPLETED
                                    ? "warning"
                                    : "danger"
                          }
                          variant="flat"
                        >
                          {booking.status}
                        </Chip>
                      </TableCell>
                      <TableCell>{booking.payment_mode}</TableCell>
                      <TableCell>रु.{booking.totalPrice}</TableCell>
                      <TableCell>{booking.pax}</TableCell>
                      <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}