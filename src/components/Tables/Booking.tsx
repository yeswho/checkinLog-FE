import {
    Button,
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
    User
} from "@nextui-org/react";
import React from "react";
import AddBooking from "../Modals/AddBooking/AddBooking";
import UpdateBooking from "../Modals/UpdateBooking/UpdateBooking";
import DeleteBooking from "../Modals/DeleteBooking/DeleteBooking";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { PlusIcon } from "./PlusIcon";
import { SearchIcon } from "./SearchIcon";
import { capitalize } from "./utils";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import { columns, bookings as initialBookings } from './bookingData';

const INITIAL_VISIBLE_COLUMNS = ["customer", "room", "checkIn", "checkOut", "duration", "totalPrice", "status", "actions"];

export default function BookingsTable() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [page, setPage] = React.useState(1);
  const [bookings, setBookings] = React.useState(initialBookings);
  const [selectedBooking, setSelectedBooking] = React.useState(null);

  const { isOpen: isBookingOpen, onOpen: onBookingOpen, onClose: onBookingClose } = useDisclosure();
  const { isOpen: isBookingUpdateOpen, onOpen: onBookingUpdateOpen, onClose: onBookingUpdateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "bookingId",
    direction: "ascending",
  });

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredBookings = [...bookings];

    if (hasSearchFilter) {
      filteredBookings = filteredBookings.filter((booking) =>
        booking.customer.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        booking.room.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Add sorting logic
    return filteredBookings.sort((a, b) => {
      let first = a[sortDescriptor.column as keyof typeof a];
      let second = b[sortDescriptor.column as keyof typeof b];
      
      // Handle nested objects (customer, room)
      if (sortDescriptor.column === "customer") {
        first = a.customer.name;
        second = b.customer.name;
      } else if (sortDescriptor.column === "room") {
        first = a.room.name;
        second = b.room.name;
      }
      
      // Handle dates
      if (sortDescriptor.column === "checkIn" || sortDescriptor.column === "checkOut" || 
          sortDescriptor.column === "createdAt" || sortDescriptor.column === "updatedAt") {
        first = new Date(first as string).getTime();
        second = new Date(second as string).getTime();
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [bookings, filterValue, sortDescriptor]);


  
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const renderCell = React.useCallback((booking: any, columnKey: React.Key) => {
    switch (columnKey) {
      case "customer":
        return (
          <User
            classNames={{
              description: "text-default-500",
            }}
            description={booking.customer.email}
            name={booking.customer.name}
          >
            {booking.customer.contactNumber}
          </User>
        );
      case "room":
        return (
          <div>
            <p className="text-bold">{booking.room.name}</p>
            <p className="text-tiny text-default-500">{`${booking.room.floor} - ${booking.room.roomType}`}</p>
          </div>
        );
      case "checkIn":
        return new Date(booking.checkIn).toLocaleDateString();
      case "checkOut":
        return new Date(booking.checkOut).toLocaleDateString();
      case "duration":
        return `${booking.duration} nights`;
      case "totalPrice":
        return `रु.${booking.totalPrice.toFixed(2)}`;
      case "status":
        return (
          <div className={`text-${booking.status === 'cancelled' ? 'danger' : 
                            booking.status === 'confirmed' ? 'primary' :
                            booking.status === 'checked-in' ? 'success' : 
                            'warning'} text-transform: uppercase`}>
            {booking.status}
          </div>
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
              <DropdownMenu>
                <DropdownItem 
                  onPress={() => {
                    setSelectedBooking(booking);
                    onBookingUpdateOpen();
                  }}>
                  Edit Booking
                </DropdownItem>
                <DropdownItem 
                  onPress={() => {
                    setSelectedBooking(booking);
                    onDeleteOpen();
                  }}>
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
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by customer or room..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
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
          <span className="text-default-400 text-small">Total {bookings.length} bookings</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, visibleColumns, onSearchChange, onRowsPerPageChange, bookings.length]);

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
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${items.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

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
        <TableBody emptyContent={"No bookings found"} items={items}>
          {(item) => (
            <TableRow key={item.bookingId}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AddBooking 
              isOpen={isBookingOpen}
              onClose={onBookingClose} room={undefined}      />

      <UpdateBooking
        isOpen={isBookingUpdateOpen}
        onClose={onBookingUpdateClose} booking={selectedBooking}     />

      <DeleteBooking
        isOpen={isDeleteOpen}
        onClose={onDeleteClose} booking={selectedBooking}     />

    </div>
  );
}