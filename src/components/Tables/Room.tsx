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
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import AddRoom from "../../components/Modals/AddRoom/AddRoom";
import UpdateRoom from "../../components/Modals/UpdateRoom/UpdateRoom";
import DeleteRoom from "../../components/Modals/DeleteRoom/DeleteRoom";
import ViewRoom from "../../components/Modals/ViewRoom/ViewRoom";
import AddBooking from "../../components/Modals/AddBooking/AddBooking";
import AddSuggestion from "../../components/Modals/AddSuggestion/AddSuggestion";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { PlusIcon } from "./PlusIcon";
import { SearchIcon } from "./SearchIcon";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import { columns, statusOptions } from "./data";
import { capitalize } from "./utils";
import { useRoomsDetail } from "../../hooks/useRooms";
import { Spinner } from "@heroui/react";

const statusColorMap: Record<string, ChipProps["color"]> = {
  Available: "success",
  Occupied: "danger",
  "Under maintainance": "warning",
  Unavailable: "default",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "floor", "room_type", "rate", "status", "actions", "reserve"];

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
  const [page, setPage] = React.useState(1);
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null);

  const { isOpen: isRoomOpen, onOpen: onRoomOpen, onClose: onRoomClose } = useDisclosure();
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isBookingOpen, onOpen: onBookingOpen, onClose: onBookingClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isSuggestionOpen, onOpen: onSuggestionOpen, onClose: onSuggestionClose } = useDisclosure();
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });

  const { data: roomsData, isLoading, isError } = useRoomsDetail(
    page,
    rowsPerPage,
    filterValue,
    typeof statusFilter === "string" ? statusFilter : Array.from(statusFilter).join(","),
    sortDescriptor.column as string,
    sortDescriptor.direction === "ascending" ? "asc" : "desc"
  );

  const transformRooms = (rooms: Room[] = []) => {
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

  console.log("RoomData ", roomsData);

  const rooms = React.useMemo(() => {
    return roomsData?.rows ? transformRooms(roomsData.rows) : [];
  }, [roomsData]);

  console.log("Rooms ", rooms);

  const totalRooms = roomsData?.count || 0;
  const pages = Math.ceil(totalRooms / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredRooms = [...rooms];

    // Client-side filtering is no longer needed if implemented on the backend
    // if (hasSearchFilter) {
    //   filteredRooms = filteredRooms.filter((room) =>
    //     room?.name.toLowerCase().includes(filterValue.toLowerCase()),
    //   );
    // }
    // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
    //   filteredRooms = filteredRooms.filter((room) =>
    //     Array.from(statusFilter).includes(room.status),
    //   );
    // }

    return filteredRooms;
  }, [rooms]); // Dependencies changed to only 'rooms' as filtering is now server-side

  const items = React.useMemo(() => {
    // Client-side pagination is no longer needed if implemented on the backend
    // const start = (page - 1) * rowsPerPage;
    // const end = start + rowsPerPage;
    // return filteredItems.slice(start, end);
    return filteredItems;
  }, [filteredItems]); // Dependencies changed to only 'filteredItems'

  const sortedItems = React.useMemo(() => {
    // Client-side sorting is no longer needed if implemented on the backend
    // return [...items].sort((a, b) => {
    //   let first: any;
    //   let second: any;

    //   if (sortDescriptor.column === "occupiedDetails" || sortDescriptor.column === "maintenanceDetails") {
    //     return 0;
    //   }

    //   if (sortDescriptor.column === "floor") {
    //     first = a.floor?.name;
    //     second = b.floor?.name;
    //   } else if (sortDescriptor.column === "room_type") {
    //     first = a.room_type?.name;
    //     second = b.room_type?.name;
    //   } else {
    //     first = a[sortDescriptor.column as keyof Room];
    //     second = b[sortDescriptor.column as keyof Room];
    //   }

    //   if (typeof first === 'string' && typeof second === 'string') {
    //     return sortDescriptor.direction === "ascending"
    //       ? first.localeCompare(second)
    //       : second.localeCompare(first);
    //   }

    //   if (sortDescriptor.column === "rate") {
    //     const firstNum = parseFloat(first);
    //     const secondNum = parseFloat(second);
    //     const cmp = firstNum < secondNum ? -1 : firstNum > secondNum ? 1 : 0;
    //     return sortDescriptor.direction === "descending" ? -cmp : cmp;
    //   }

    //   if (sortDescriptor.column === "createdAt" || sortDescriptor.column === "updatedAt") {
    //     const firstDate = new Date(first).getTime();
    //     const secondDate = new Date(second).getTime();
    //     const cmp = firstDate < secondDate ? -1 : firstDate > secondDate ? 1 : 0;
    //     return sortDescriptor.direction === "descending" ? -cmp : cmp;
    //   }

    //   const cmp = first < second ? -1 : first > second ? 1 : 0;
    //   return sortDescriptor.direction === "descending" ? -cmp : cmp;
    // });
    return items;
  }, [items]); // Dependencies changed to only 'items'

  const renderCell = React.useCallback((room: Room, columnKey: React.Key) => {
    if (!room) return null;
    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{room?.name}</p>
            <p className="text-bold text-tiny text-default-500">Floor {room.floor?.name}</p>
          </div>
        );
      case "floor":
        return room.floor?.name;
      case "room_type":
        return room.room_type?.name;
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
        return `रु${room.rate}`;
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
                <DropdownItem onPress={() => { setSelectedRoom(room); onViewOpen(); }}>View Details</DropdownItem>
                <DropdownItem onPress={() => { setSelectedRoom(room); onSuggestionOpen(); }}>Add Complaint</DropdownItem>
                <DropdownItem onPress={() => { setSelectedRoom(room); onUpdateOpen(); }}>Edit Room</DropdownItem>
                <DropdownItem onPress={() => { setSelectedRoom(room); onDeleteOpen(); }}>Delete Room</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      case "reserve":
        return room.status === "Available" ? (
          <Button
            size="sm"
            className="rounded-full dark bg-default text-foreground hover:opacity-90"
            onPress={() => { setSelectedRoom(room); onBookingOpen(); }}
          >
            Reserve Now
          </Button>
        ) : null;
      default:
        return String(room[columnKey as keyof Room]);
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
                <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
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
                    {capitalize(status?.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
                    {capitalize(column?.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              className="bg-foreground text-background"
              endContent={<PlusIcon width={undefined} height={undefined} />}
              size="sm"
              onPress={onRoomOpen}
            >
              Add Room
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {totalRooms} rooms</span>
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
  }, [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, totalRooms]);

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
            : `${selectedKeys.size} of ${totalRooms} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, totalRooms, page, pages, hasSearchFilter]);

  if (isLoading) return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
    <Spinner
      classNames={{
        base: "scale-150",
        label: "text-foreground mt-4",
      }}
      color="primary"
    />
  </div>;
  if (isError) return <div>Error fetching rooms</div>;

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
              {column?.name}
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
      <AddRoom isOpen={isRoomOpen} onClose={onRoomClose} />
      <UpdateRoom isOpen={isUpdateOpen} onClose={onUpdateClose} room={selectedRoom} />
      <DeleteRoom isOpen={isDeleteOpen} onClose={onDeleteClose} room={selectedRoom} />
      {selectedRoom && isBookingOpen && (
        <AddBooking
          isOpen={isBookingOpen}
          onClose={onBookingClose}
          room={{
            id: selectedRoom.id,
            name: selectedRoom.name,
            rate: parseFloat(selectedRoom.rate) || 0,
          }}
          checkIn={new Date().toISOString().split('T')[0]} // Default to today
          checkOut={new Date().toISOString().split('T')[0]} // Default to today
          onSubmitSuccess={() => {
            // Invalidate queries to refresh room data after a successful booking
            // queryClient.invalidateQueries(['roomsDetail']); // Assuming useRoomsDetail is used
            onBookingClose();
          }}
        />
      )}
      <ViewRoom isOpen={isViewOpen} onClose={onViewClose} room={selectedRoom} />
      <AddSuggestion isOpen={isSuggestionOpen} onClose={onSuggestionClose} room={selectedRoom ?? undefined} />
    </div>
  );
}