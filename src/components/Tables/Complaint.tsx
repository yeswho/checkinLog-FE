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
} from "@nextui-org/react";
import React from "react";
import { useComplaints } from "../../hooks/useComplaint";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { PlusIcon } from "./PlusIcon";
import { SearchIcon } from "./SearchIcon";
import { capitalize } from "./utils";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import UpdateComplaint from "../../components/Modals/UpdateComplaint/UpdateComplaint";
import DeleteComplaint from "../../components/Modals/DeleteComplaint/DeleteComplaint";
import AddSuggestion from "../../components/Modals/AddSuggestion/AddSuggestion";
import { Spinner } from "@heroui/react";

const INITIAL_VISIBLE_COLUMNS = ["title", "description", "status", "priority", "room", "customer", "actions"];

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Title", uid: "title", sortable: true },
  { name: "Description", uid: "description", sortable: true },
  { name: "Status", uid: "status", sortable: true },
  { name: "Priority", uid: "priority", sortable: true },
  { name: "Room", uid: "room", sortable: true },
  { name: "Customer", uid: "customer", sortable: true },
  { name: "Actions", uid: "actions" },
];

export default function ComplaintsTable() {
  const { data: complaints, isLoading, isError } = useComplaints();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [page, setPage] = React.useState(1);
  const [selectedComplaint, setSelectedComplaint] = React.useState(null);

  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredComplaints = complaints || [];

    if (hasSearchFilter) {
      filteredComplaints = filteredComplaints.filter((complaint) =>
        complaint.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredComplaints.sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a];
      const second = b[sortDescriptor.column as keyof typeof b];

      const cmp = (first ?? '') < (second ?? '') ? -1 : (first ?? '') > (second ?? '') ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [complaints, filterValue, sortDescriptor]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const renderCell = React.useCallback((complaint: any, columnKey: React.Key) => {
    const cellValue = complaint[columnKey as keyof any];
    switch (columnKey) {
      case "title":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{complaint.title}</p>
          </div>
        );
      case "description":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{complaint.description}</p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={
              complaint.status === "open"
                ? "warning"
                : complaint.status === "in-progress"
                  ? "primary"
                  : "success"
            }
            size="sm"
            variant="flat"
          >
            {complaint.status}
          </Chip>
        );
      case "priority":
        return (
          <Chip
            className="capitalize"
            color={
              complaint.priority === "low"
                ? "success"
                : complaint.priority === "medium"
                  ? "warning"
                  : "danger"
            }
            size="sm"
            variant="flat"
          >
            {complaint.priority}
          </Chip>
        );
      case "room":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {complaint.room ? complaint.room.name : "-"}
            </p>
          </div>
        );
      case "customer":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {complaint.customer
                ? `${complaint.customer.firstname} ${complaint.customer.lastname}`
                : "-"}
            </p>
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
                <DropdownItem
                  onPress={() => {
                    setSelectedComplaint(complaint);
                    onUpdateOpen();
                  }}
                >
                  Edit Complaint
                </DropdownItem>
                <DropdownItem
                  onPress={() => {
                    setSelectedComplaint(complaint);
                    onDeleteOpen();
                  }}
                  className="text-danger"
                  color="danger"
                >
                  Delete Complaint
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
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
            placeholder="Search by complaint title..."
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
              onPress={onAddOpen}
            >
              Add Complaint
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {complaints?.length || 0} complaints</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="45">45</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, visibleColumns, onSearchChange, onRowsPerPageChange, complaints?.length]);

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

  // Handle loading and error states
  if (isLoading) return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
    <Spinner
      classNames={{
        base: "scale-150",
        label: "text-foreground mt-4",
      }}
      color="primary"
    />
  </div>;
  if (isError) return <div>Error fetching complaints. Please try again later.</div>;

  return (
    <div>
      <Table
        isCompact
        removeWrapper
        aria-label="Complaints table with custom cells, pagination and sorting"
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
        <TableBody emptyContent={"No complaints found"} items={items}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <AddSuggestion isOpen={isAddOpen} onClose={onAddClose} />
      <UpdateComplaint isOpen={isUpdateOpen} onClose={onUpdateClose} complaint={selectedComplaint} />
      <DeleteComplaint isOpen={isDeleteOpen} onClose={onDeleteClose} complaint={selectedComplaint} />
    </div>
  );
}