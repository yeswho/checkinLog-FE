import {
  Button,
  Chip,
  ChipProps,
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
  useDisclosure
} from "@nextui-org/react";
import React from "react";

import AddBooking from "../../components/Modals/AddBooking/AddBooking";
import AddRoom from "../../components/Modals/AddRoom/AddRoom";
import AddSuggestion from "../../components/Modals/AddSuggestion/AddSuggestion";
import DeleteRoom from "../../components/Modals/DeleteRoom/DeleteRoom";
import UpdateRoom from "../../components/Modals/UpdateRoom/UpdateRoom";
import ViewRoom from "../../components/Modals/ViewRoom/ViewRoom";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { PlusIcon } from "./PlusIcon";
import { SearchIcon } from "./SearchIcon";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import { columns, statusOptions } from "./data";
import { capitalize } from "./utils";
import { useRoomsDetail } from "../../hooks/useRooms"

const statusColorMap: Record<string, ChipProps["color"]> = {
  Available: "success",
  Occupied: "danger",
  "Under maintenance": "warning",
  Unavailable: "default",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "floor", "room_type", "status", "actions", "reserve"];

type Room = {
  id: number;
  name: string;
  floor: { id: number; name: string };
  room_type: { id: number; name: string };
  status: string;
  rate: string;
  occupiedDetails?: {
    customer: {
      firstName: string;
      lastName: string;
      contact: string;
    };
    checkIn: string;
    checkOut: string;
  } | null;
  maintenanceDetails?: {
    reason: string;
    startDate: string;
    expectedEndDate: string;
  } | null;

  createdAt: string;
  updatedAt: string;
};

export default function RoomTable() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null);
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isBookingOpen, onOpen: onBookingOpen, onClose: onBookingClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isSuggestionOpen, onOpen: onSuggestionOpen, onClose: onSuggestionClose } = useDisclosure();
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });

  const { data: roomData, isLoading, isError } = useRoomsDetail();

  const transformRooms = (rooms: Room[]) => {
    return rooms.map((room) => ({
      ...room,
      occupiedDetails: room.occupiedDetails
        ? {
            ...room.occupiedDetails,
            customer: {
              firstName: room.occupiedDetails.customer.firstName ?? "",
              lastName: room.occupiedDetails.customer.lastName ?? "",
              contact: room.occupiedDetails.customer.contact ?? "",
            },
          }
        : null,
        maintenanceDetails: room.maintenanceDetails
        ? {
            ...room.maintenanceDetails,
          }
        : null,
    }));
  };


  const rooms = isLoading ? [] : isError ? [] : roomData ? transformRooms(roomData.data) : [];

  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(rooms.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredRooms = [...rooms];

    if (hasSearchFilter) {
      filteredRooms = filteredRooms.filter((room) =>
        room.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      console.log(statusFilter);

      filteredRooms = filteredRooms.filter((room) =>
        Array.from(statusFilter).includes(room.status),
      );
    }

    return filteredRooms;
  }, [rooms, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      let first: any;
      let second: any;

      if (sortDescriptor.column === "occupiedDetails" || sortDescriptor.column === "maintenanceDetails") {
        return 0;
      }

      // Special handling for nested object properties
      if (sortDescriptor.column === "floor") {
        first = a.floor.name;
        second = b.floor.name;
      } else if (sortDescriptor.column === "room_type") {
        first = a.room_type.name;
        second = b.room_type.name;
      } else {
        first = a[sortDescriptor.column as keyof Room];
        second = b[sortDescriptor.column as keyof Room];
      }

      // Handle different types of comparisons
      if (typeof first === 'string' && typeof second === 'string') {
        return sortDescriptor.direction === "ascending"
          ? first.localeCompare(second)
          : second.localeCompare(first);
      }

      // Handle numeric comparisons (including string numbers)
      if (sortDescriptor.column === "rate") {
        // Convert rate strings to numbers for comparison
        const firstNum = parseFloat(first);
        const secondNum = parseFloat(second);
        const cmp = firstNum < secondNum ? -1 : firstNum > secondNum ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }

      // Handle date comparisons
      if (sortDescriptor.column === "createdAt" || sortDescriptor.column === "updatedAt") {
        const firstDate = new Date(first).getTime();
        const secondDate = new Date(second).getTime();
        const cmp = firstDate < secondDate ? -1 : firstDate > secondDate ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }

      // Default comparison for other types
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((room: Room, columnKey: React.Key) => {


    switch (columnKey) {
      case "id":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{room.id}</p>
          </div>
        );
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{room.name}</p>
            <p className="text-bold text-tiny text-default-500">Floor {room.floor.name}</p>
          </div>
        );
      case "floor":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{room.floor.name}</p>
          </div>
        );
      case "room_type":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{room.room_type.name}</p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={statusColorMap[room.status]}
            size="sm"
            variant="dot"
          >
            {room.status}
          </Chip>
        );
      case "rate":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">रु{room.rate}</p>
          </div>
        );
      case "createdAt":
      case "updatedAt":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{String(room.createdAt)}</p>
          </div>
        );
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
                <DropdownItem onPress={() => {
                  setSelectedRoom(room);
                  onViewOpen();
                }}>View Details</DropdownItem>
                <DropdownItem onPress={() => {
                  setSelectedRoom(room);
                  onSuggestionOpen();
                }}>Add Complaint</DropdownItem>
                <DropdownItem onPress={() => {
                  setSelectedRoom(room);
                  onUpdateOpen();
                }}>Edit Room</DropdownItem>
                <DropdownItem onPress={() => {
                  setSelectedRoom(room);
                  onDeleteOpen();
                }}>Delete Room</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      case "reserve":
        return (
          <div className="flex flex-col items-center justify-center">
            {room.status === "Available" && (
              <Button
                size="sm"
                className="rounded-full dark bg-default text-foreground hover:opacity-90 "
                onPress={() => {
                  setSelectedRoom(room);
                  onBookingOpen();
                }}
              >
                Reserve Now
              </Button>
            )}
          </div>

        );

      default:
        return <div className="flex flex-col">
          <p className="text-bold text-small">{String("N/A")}</p>
        </div>;
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
            placeholder="Search by room name..."
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
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
              onPress={onOpen}
            >
              Add Room
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {rooms.length} rooms</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="20" selected>20</option>
              <option value="30">30</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    rooms.length,
    hasSearchFilter,
  ]);

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

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        "group-data-[middle=true]:before:rounded-none",
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  return (
    <div>
      <Table
        isCompact
        removeWrapper
        aria-label="Room Management Table"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper: "after:bg-foreground after:text-background text-background",
          },
        }}
        classNames={classNames}
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
              align={column.uid === "actions" || column.uid === "reserve" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No rooms found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <AddRoom isOpen={isOpen} onClose={onClose} />
      <UpdateRoom
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        room={selectedRoom}
      />
      <DeleteRoom
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        room={selectedRoom}
      />
      <AddBooking
        isOpen={isBookingOpen}
        onClose={onBookingClose}
        room={selectedRoom}
      />
      <ViewRoom
        isOpen={isViewOpen}
        onClose={onViewClose}
        room={selectedRoom}
      />
      <AddSuggestion isOpen={isSuggestionOpen}
        onClose={onSuggestionClose}
        room={selectedRoom ?? undefined} />
    </div>
  );
}