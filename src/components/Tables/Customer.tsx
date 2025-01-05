import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  useDisclosure
} from "@nextui-org/react";
import { PlusIcon } from "./PlusIcon";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { SearchIcon } from "./SearchIcon";
import { columns, customers, genderOptions } from "./customerData";
import { capitalize } from "./utils";
import AddCustomer from "../Modals/AddCustomer/AddCustomer";
import UpdateCustomer from "../Modals/UpdateCustomer/UpdateCustomer";
import DeleteCustomer from "../../components/Modals/DeleteCustomer/DeleteCustomer";
import AddSuggestion from "../../components/Modals/AddSuggestion/AddSuggestion";

const genderColorMap: Record<string, ChipProps["color"]> = {
  Male: "primary",
  Female: "secondary",
  Other: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "gender", "email", "address", "contact",  "company", "actions"];

type Customer = typeof customers[0];

export default function CustomersTable() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [genderFilter, setGenderFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const { isOpen: isCustomerOpen, onOpen: onCustomerOpen, onClose: onCustomerClose } = useDisclosure();
  const { isOpen: isCustomerUpdateOpen, onOpen: onCustomerUpdateOpen, onClose: onCustomerUpdateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isSuggestionOpen, onOpen: onSuggestionOpen, onClose: onSuggestionClose } = useDisclosure();
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(customers.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredCustomers = [...customers];

    if (hasSearchFilter) {
      filteredCustomers = filteredCustomers.filter((customer) =>
        customer.firstName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (genderFilter !== "all" && Array.from(genderFilter).length !== genderOptions.length) {
      filteredCustomers = filteredCustomers.filter((customer) =>
        Array.from(genderFilter).includes(customer.gender)
      );
    }

    return filteredCustomers;
  }, [customers, filterValue, genderFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Customer, b: Customer) => {
      const first = a[sortDescriptor.column as keyof Customer] as number;
      const second = b[sortDescriptor.column as keyof Customer] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((customer: Customer, columnKey: React.Key) => {
    const cellValue = customer[columnKey as keyof Customer];

    switch (columnKey) {
      case "name":
        return (
          <User
            classNames={{
              description: "text-default-500",
            }}
            description={customer.email}
            name={`${customer.firstName} ${customer.firstName}`}
          >
            {customer.email}
          </User>
        );
      case "gender":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={genderColorMap[customer.gender]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "email":
        return cellValue;
      case "company":
        return customer.company;
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
                <DropdownItem>View Bookings</DropdownItem>
                <DropdownItem onPress={() => {
                  setSelectedCustomer(customer);
                  onCustomerUpdateOpen();
                }}>Edit Details</DropdownItem>
                <DropdownItem onPress={() => {
                  setSelectedCustomer(customer);
                  onSuggestionOpen();
                }}>Add Complaints</DropdownItem>
                 <DropdownItem onPress={() => {
                  setSelectedCustomer(customer);
                  onDeleteOpen();
                }}>Delete Customer</DropdownItem>
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
            placeholder="Search by name..."
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
                  Gender
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filter by Gender"
                closeOnSelect={false}
                selectedKeys={genderFilter}
                selectionMode="multiple"
                onSelectionChange={setGenderFilter}
              >
                {genderOptions.map((gender) => (
                  <DropdownItem key={gender.name} className="capitalize">
                    {capitalize(gender.name)}
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
              onPress={() => {
                onCustomerOpen();
              }}
            >
              Add Customer
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {customers.length} customers</span>
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
    genderFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    customers.length,
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
      aria-label="Example table with custom cells, pagination and sorting"
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
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No users found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
     <AddCustomer isOpen={isCustomerOpen}
     onClose={onCustomerClose} />
    <UpdateCustomer isOpen={isCustomerUpdateOpen}
     onClose={onCustomerUpdateClose} customer={selectedCustomer}/>
    <DeleteCustomer
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        customer={selectedCustomer}
      />

<AddSuggestion isOpen={isSuggestionOpen}
        onClose={onSuggestionClose}
        customer={selectedCustomer ?? undefined} />
     </div>
  );
}