import React from "react";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  User,
} from "@nextui-org/react";
import { useBookingsSearch } from "../../hooks/useBooking";
import { formatDate } from "../../utils/common";
import AddBooking from "../Modals/AddBooking/AddBooking";
import DeleteBooking from "../Modals/DeleteBooking/DeleteBooking";
import UpdateBooking from "../Modals/UpdateBooking/UpdateBooking";
import GenerateBill from "../Modals/GenerateBill/GenerateBill";
import AssignRoomModal from "../Modals/AssignRoom/AssignRoom";
import { columns } from "./bookingData";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { PlusIcon } from "./PlusIcon";
import { SearchIcon } from "./SearchIcon";
import { capitalize } from "./utils";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import { Spinner } from "@heroui/react";
import AdditionalChargeModal from "../Modals/AdditionalChargeModel/AdditionalChargeModel";
import { useQueryClient } from '@tanstack/react-query'; // Import useQueryClient

const INITIAL_VISIBLE_COLUMNS = [
  "customer",
  "room",
  "checkIn",
  "checkOut",
  "duration",
  "totalPrice",
  "additionalCharges",
  "status",
  "actions",
];

enum BOOKING_STATUS {
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
  NO_SHOW = 'No show',
  CHECKED_OUT = 'Checked out',
  CHECKED_IN = 'Checked in',
  BOOKED = 'Booked',
  PENDING = 'Pending',
}

export default function BookingsTable() {
  const [searchQuery, setSearchQuery] = React.useState(""); // Stores the input value
  const [activeQuery, setActiveQuery] = React.useState(""); // Stores the query sent to the backend
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [selectedBooking, setSelectedBooking] = React.useState(null);

  const { isOpen: isBookingOpen, onOpen: onBookingOpen, onClose: onBookingClose } = useDisclosure();
  const { isOpen: isBookingUpdateOpen, onOpen: onBookingUpdateOpen, onClose: onBookingUpdateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isGenerateBillOpen, onOpen: onGenerateBillOpen, onClose: onGenerateBillClose } = useDisclosure();
  const { isOpen: isAdditionalChargeOpen, onOpen: onAdditionalChargeOpen, onClose: onAdditionalChargeClose } = useDisclosure(); // Additional Charge Modal
  const { isOpen: isAssignRoomOpen, onOpen: onAssignRoomOpen, onClose: onAssignRoomClose } = useDisclosure();

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "bookingId",
    direction: "ascending",
  });

  const queryClient = useQueryClient(); // Instantiate queryClient

  // Use the useBookingsSearch hook to fetch bookings data
  const { data: { data: bookings = [], total } = {}, isLoading, isError } = useBookingsSearch(activeQuery, page, rowsPerPage);

  const hasSearchFilter = Boolean(activeQuery);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const renderCell = React.useCallback((booking: any, columnKey: React.Key) => {
    switch (columnKey) {
      case "customer":
        return (
          <User
            classNames={{
              description: "text-default-500",
            }}
            description={booking.customer.email}
            name={`${booking.customer.firstname} ${booking.customer.lastname}`}
          >
            {booking.customer.contact}
          </User>
        );
      case "room":
        return (
          <div>
            <p className="text-bold">
              {booking.rooms.map((room: any) => room.name).join(" + ")}
            </p>
            <p className="text-tiny text-default-500">
              {booking.rooms.map((room: any) => `${room.floor.name} - ${room.roomType.name}`).join(" + ")}
            </p>
          </div>
        );
      case "checkIn":
        return formatDate(booking.check_in);
      case "checkOut":
        return formatDate(booking.check_out);
      case "duration":
        return `${booking.duration} nights`;
      case "totalPrice":
        return `रु.${booking?.totalPrice}`;
      case "additionalCharges":
        return booking?.additionalCharges ? `रु. ${booking?.additionalCharges}` : '-'
      case "status":
        return (
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
        );
      case "createdAt":
        return new Date(booking.createdAt).toLocaleDateString();
      case "updatedAt":
        return new Date(booking.updatedAt).toLocaleDateString();
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-400" width={undefined} height={undefined} />
                </Button>
              </DropdownTrigger>
              {booking.status === BOOKING_STATUS.PENDING && (
                <DropdownMenu>
                  <DropdownItem
                    onPress={() => {
                      setSelectedBooking(booking);
                      onAssignRoomOpen();
                    }}
                  >
                    Assign Room
                  </DropdownItem>
                </DropdownMenu>
              )}
              <DropdownMenu>
                <DropdownItem
                  onPress={() => {
                    setSelectedBooking(booking);
                    onBookingUpdateOpen();
                  }}
                >
                  Edit Booking
                </DropdownItem>

                <DropdownItem
                  onPress={() => {
                    setSelectedBooking(booking);
                    onAdditionalChargeOpen();
                  }}
                >
                  Additional Charges
                </DropdownItem>
                <DropdownItem
                  onPress={() => {
                    setSelectedBooking(booking);
                    onGenerateBillOpen();
                  }}
                >
                  Generate Bill
                </DropdownItem>
                <DropdownItem
                  onPress={() => {
                    setSelectedBooking(booking);
                    onDeleteOpen();
                  }}
                >
                  Delete Booking
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return booking[columnKey as string];
    }
  }, []);

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    setSearchQuery(value || ""); // Update the search input value
  }, []);

  const handleSearch = () => {
    setActiveQuery(searchQuery); // Set the active query when the search button is clicked
    setPage(1); // Reset to the first page when searching
  };

  const topContent = React.useMemo(() => {
    // Add a handler for the Enter key
    const handleKeyPress = (e: { key: string; }) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end gap-2">
          <div className="flex w-full sm:max-w-[60%]">
            <Input
              isClearable
              classNames={{
                base: "w-full",
                inputWrapper: "border-1 rounded-r-none",
              }}
              placeholder="Search by customer..."
              size="sm"
              startContent={<SearchIcon className="text-default-300" />}
              value={searchQuery}
              variant="bordered"
              onClear={() => {
                setSearchQuery("");
                setActiveQuery("");
              }}
              onValueChange={onSearchChange}
              onKeyPress={handleKeyPress}
            />
            <Button
              size="sm"
              className="rounded-l-none bg-foreground text-background"
              onPress={handleSearch}
            >
              Search
            </Button>
          </div>

          <div className="flex gap-3 ml-auto">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              className="bg-foreground text-background"
              endContent={<PlusIcon width={undefined} height={undefined} />}
              size="sm"
              onPress={onBookingOpen}
            >
              Add Booking
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {total || 0} bookings</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
              value={rowsPerPage}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [searchQuery, visibleColumns, onSearchChange, onRowsPerPageChange, total, rowsPerPage, handleSearch]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={Math.ceil((total ?? 0) / rowsPerPage) || 1}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${bookings.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, bookings.length, page, total, rowsPerPage, hasSearchFilter]);

  if (isError) return <div>Error fetching bookings</div>;

  return (
    <div>
      <Table
        isCompact
        removeWrapper
        aria-label="Bookings table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: ["max-h-[382px]"],
          th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={isLoading ? (
            <Spinner
              classNames={{
                base: "scale-150",
                label: "text-foreground mt-4",
              }}
              color="primary"
            />
          ) : (
            "No bookings found"
          )}
          items={bookings}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AddBooking
        isOpen={isBookingOpen}
        onClose={onBookingClose}
        room={null} // No specific room pre-selected when adding a general booking
        checkIn={new Date().toISOString().split('T')[0]} // Default to today
        checkOut={new Date().toISOString().split('T')[0]} // Default to today
        onSubmitSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['bookingsSearch'] }); // Invalidate bookings cache
          onBookingClose();
        }}
      />

      <UpdateBooking isOpen={isBookingUpdateOpen} onClose={onBookingUpdateClose} booking={selectedBooking} />

      <DeleteBooking isOpen={isDeleteOpen} onClose={onDeleteClose} booking={selectedBooking} />

      <GenerateBill isOpen={isGenerateBillOpen} onClose={onGenerateBillClose} booking={selectedBooking} />

      {selectedBooking && (
        <AssignRoomModal
          booking={selectedBooking}
          isOpen={isAssignRoomOpen}
          onClose={onAssignRoomClose}
          onAssign={() => { }}
        />
      )}

      {/* Additional Charge Modal */}
      {selectedBooking && (
        <AdditionalChargeModal
          booking={selectedBooking}
          isOpen={isAdditionalChargeOpen}
          onClose={onAdditionalChargeClose}
        />
      )}
    </div>
  );
}