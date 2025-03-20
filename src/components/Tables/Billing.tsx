import { Spinner } from "@heroui/react";
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
    TableRow
} from "@nextui-org/react";
import { useAllPrintableBills } from "hooks/useBilling";
import React, { useRef } from "react";
import { PrintableBill } from "types/billing";
import { useReactToPrint } from "react-to-print";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { SearchIcon } from "./SearchIcon";
import { capitalize } from "./utils";
import { useGenerateBillPDF } from "../../hooks/useBilling";
import EmailModal from "../Modals/EmailModal/EmailModal";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import PrintableBillComponent from "../Print/PrintableBill";
import { formatDate } from "../../utils/common";

const INITIAL_VISIBLE_COLUMNS = ["customer", "booking", "rooms", "charges", "billing", "actions"];

const columns = [
    { name: "Customer", uid: "customer", sortable: true },
    { name: "Booking", uid: "booking", sortable: true },
    { name: "Rooms", uid: "rooms", sortable: true },
    { name: "Charges", uid: "charges", sortable: true },
    { name: "Billing", uid: "billing", sortable: true },
    { name: "Actions", uid: "actions" },
];

export default function BillingsTable() {
    const { data: printableBills, isLoading, isError } = useAllPrintableBills();
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const [isEmailModalOpen, setIsEmailModalOpen] = React.useState(false);
    const [page, setPage] = React.useState(1);

    const [selectedBill, setSelectedBill] = React.useState<PrintableBill | null>(null);
    const printRef = useRef<HTMLDivElement>(null);

    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "customer",
        direction: "ascending",
    });

    const { mutate: generatePDF, isPending } = useGenerateBillPDF();

    const handleGeneratePDF = (bill: PrintableBill) => {
        if (!printRef.current) {
            console.error("printRef is not set");
            return;
        }

        setSelectedBill(bill);
        setIsEmailModalOpen(true);
    };

    const handleSendEmail = async (emailData: { to: string; subject: string; text: string }) => {
        if (!printRef.current || !selectedBill) return;

        const firstName = selectedBill.customer.name.split(" ")[0];
        generatePDF({
            element: printRef.current,
            fileName: `bill_${firstName}.pdf`,
            bill: selectedBill,
            emailData,
        });
    };



    const hasSearchFilter = Boolean(filterValue);

    const handlePrint = useReactToPrint({
        content: () => printRef.current
    });

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredBillings = printableBills || [];

        if (hasSearchFilter) {
            filteredBillings = filteredBillings.filter((bill) =>
                bill.customer.name.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredBillings.sort((a, b) => {
            const first = a[sortDescriptor.column as keyof typeof a];
            const second = b[sortDescriptor.column as keyof typeof b];

            const cmp = (first ?? '') < (second ?? '') ? -1 : (first ?? '') > (second ?? '') ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [printableBills, filterValue, sortDescriptor]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const renderCell = React.useCallback((bill: PrintableBill, columnKey: React.Key) => {
        const cellValue = bill[columnKey as keyof PrintableBill];
        switch (columnKey) {
            case "customer":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{bill.customer.name}</p>
                        <p className="text-bold text-small">{bill.customer.email}</p>
                        <p className="text-bold text-small">{bill.customer.contact}</p>
                    </div>
                );
            case "booking":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small">Check-In: {formatDate(bill.booking.checkIn)}</p>
                        <p className="text-bold text-small">Check-Out: {formatDate(bill.booking.checkOut)}</p>
                        <p className="text-bold text-small">Duration: {bill.booking.duration}</p>
                    </div>
                );
            case "rooms":
                return (
                    <div className="flex flex-col">
                        {bill.rooms.map((room, index) => (
                            <div key={index} className="flex flex-col">
                                <p className="text-bold text-small">Room: {room.name}</p>
                                <p className="text-bold text-small">Floor: {room.floor}</p>
                                <p className="text-bold text-small">Type: {room.roomType}</p>
                                <p className="text-bold text-small">Rate: रु. {room.rate}</p>
                                <p className="text-bold text-small">Total: रु. {room.total}</p>
                            </div>
                        ))}
                    </div>
                );
            case "charges":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small">Room Charges: रु. {bill.charges.totalRoomCharges}</p>
                        <p className="text-bold text-small">Tax: रु. {bill.charges.tax}</p>
                        <p className="text-bold text-small">VAT: रु. {bill.charges.vat}</p>
                        <p className="text-bold text-small">Service Charge: रु. {bill.charges.serviceCharge}</p>
                        <p className="text-bold text-small">Subtotal: रु. {bill.charges.subtotal}</p>
                    </div>
                );
            case "billing":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small">Discount: रु. {bill.billing.discount}</p>
                        <p className="text-bold text-small">Extra Charge: रु. {bill.billing.extraCharge}</p>
                        <p className="text-bold text-small">Final Amount: रु. {bill.billing.finalAmount}</p>
                        <p className="text-bold text-small">Remarks: {bill.billing.remarks || "N/A"}</p>
                        <p className="text-bold text-small">Billing Date: {bill.billing.billingDate}</p>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown className="bg-background border-1 border-default-200">
                            <DropdownTrigger>
                                <Button isIconOnly radius="full" size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-400" width={24} height={24} />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem onClick={() => {
                                    setSelectedBill(bill);
                                    setTimeout(handlePrint, 100);
                                }}>
                                    Print Bill
                                </DropdownItem>
                                <DropdownItem
                                    onClick={() => {
                                        setSelectedBill(bill);
                                        setTimeout(() => handleGeneratePDF(bill), 100)

                                    }}
                                >
                                   Send Bill As Email
                                </DropdownItem>
                                <DropdownItem className="text-danger" color="danger">
                                    Delete Bill
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return <>{cellValue}</>;
        }
    }, [handlePrint]);

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
                        placeholder="Search by customer name..."
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
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {printableBills?.length || 0} bills</span>
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
    }, [filterValue, visibleColumns, onSearchChange, onRowsPerPageChange, printableBills?.length]);

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

    if (isLoading) return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <Spinner
                classNames={{
                    base: "scale-150",
                    label: "text-foreground mt-4",
                }}
                color="primary"
            />
        </div>
    );

    if (isError) return <div>Error fetching billings. Please try again later.</div>;

    return (
        <div>
            <Table
                isCompact
                removeWrapper
                aria-label="Billings table with custom cells, pagination and sorting"
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
                            style={column.uid === "actions" ? { paddingRight: '5%' } : {}}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"No bills found"} items={items}>
                    {(item) => (
                        <TableRow key={item.customer.name}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div style={{ display: "none" }}>
                {selectedBill && (
                    <div ref={printRef}>
                        <PrintableBillComponent bill={selectedBill} />
                    </div>
                )}
            </div>
            {selectedBill &&
                <EmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                onSubmit={handleSendEmail}
                initialTo={selectedBill.customer.email || ""}
                initialSubject="Your Bill Has Been Generated"
                initialText="Please find your bill attached." 
                bill={selectedBill}                />
            }
        </div>
    );
}