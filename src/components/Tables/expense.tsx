import React, { useState } from 'react';
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
    Chip,
    Badge,
} from '@nextui-org/react';
import { useExpenses, useExpensesByCategory, useExpensesByCategoryAndDateRange, useExpensesByDateRange } from '../../hooks/useExpense';
import { ChevronDownIcon } from './ChevronDownIcon';
import { columns } from './expenseData';
import { PlusIcon } from './PlusIcon';
import { SearchIcon } from './SearchIcon';
import { CalendarIcon } from './CalendarIcon';
import { FilterIcon } from './FilterIcon.js';
import { capitalize } from './utils';
import { VerticalDotsIcon } from './VerticalDotsIcon';
import { Spinner } from '@heroui/react';
import AddExpense from '../../components/Modals/AddExpense/AddExpense';
import UpdateExpense from '../../components/Modals/UpdateExpense/UpdateExpense';
import DeleteExpense from '../../components/Modals/DeleteExpense/DeleteExpense';
import { formatDate } from '../../utils/common';
import { EXPENSE_CATEGORY } from '../../types/employee';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import 'nepali-datepicker-reactjs/dist/index.css';
import { convertBsToAd } from './dateConvert';

const datePickerCustomStyles = `
  .nepali-date-picker {
    font-family: inherit;
    border-radius: 0.5rem !important;
    border-width: 1px !important;
    height: 2.25rem !important;
    min-width: 140px !important;
    padding: 0.375rem 0.75rem !important;
    transition: all 0.2s ease !important;
  }
  
  .nepali-date-picker:focus-within {
    outline: 2px solid var(--nextui-colors-primary) !important;
    outline-offset: 2px !important;
  }
  
  .date-picker-header, .date-picker-body {
    background-color: var(--nextui-colors-background) !important;
    border-color: var(--nextui-colors-border) !important;
  }
  
  .selected-day {
    background-color: var(--nextui-colors-primary) !important;
    color: white !important;
  }
  
  .day:hover {
    background-color: var(--nextui-colors-primaryLight) !important;
    color: var(--nextui-colors-primaryLightContrast) !important;
  }
`;

const INITIAL_VISIBLE_COLUMNS = [
    'id',
    'name',
    'amount',
    'category',
    'expense_date',
    'remarks',
    'actions'
];

const categoryColorMap: Record<EXPENSE_CATEGORY, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = {
    [EXPENSE_CATEGORY.UTILITIES]: 'primary',
    [EXPENSE_CATEGORY.MARKETING]: 'secondary',
    [EXPENSE_CATEGORY.MAINTENANCE]: 'warning',
    [EXPENSE_CATEGORY.SALARY]: 'success',
    [EXPENSE_CATEGORY.SUPPLIER]: 'primary',
    [EXPENSE_CATEGORY.HOUSEKEEPING]: 'secondary',
    [EXPENSE_CATEGORY.FOOD_AND_BEVERAGE]: 'success',
    [EXPENSE_CATEGORY.LICENSING_AND_FEES]: 'warning',
    [EXPENSE_CATEGORY.TRANSPORTATION]: 'primary',
    [EXPENSE_CATEGORY.SECURITY]: 'danger',
    [EXPENSE_CATEGORY.TRAINING_AND_DEVELOPMENT]: 'secondary',
    [EXPENSE_CATEGORY.FURNITURE_AND_EQUIPMENT]: 'warning',
    [EXPENSE_CATEGORY.INSURANCE]: 'success',
    [EXPENSE_CATEGORY.MISCELLANEOUS]: 'default'
};

export default function ExpenseTable() {
    const { data: expenses, isLoading, isError } = useExpenses();
    const [filterValue, setFilterValue] = React.useState('');
    const [selectedKeys, setSelectedKeys] = React.useState<any>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [page, setPage] = React.useState(1);
    const [selectedExpense, setSelectedExpense] = React.useState(null);

    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
    const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    const [bsStartDate, setBsStartDate] = useState('');
    const [bsEndDate, setBsEndDate] = useState('');
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<EXPENSE_CATEGORY | 'all'>('all');

    const [tempBsStartDate, setTempBsStartDate] = useState('');
    const [tempBsEndDate, setTempBsEndDate] = useState('');
    const [tempSelectedCategory, setTempSelectedCategory] = useState<EXPENSE_CATEGORY | 'all'>('all');

    const adStartDate = bsStartDate ? convertBsToAd(bsStartDate).toString().split('T')[0] : '';
    const adEndDate = bsEndDate ? convertBsToAd(bsEndDate).toString().split('T')[0] : '';

    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: 'id',
        direction: 'ascending',
    });

    const hasSearchFilter = Boolean(filterValue);

    const { data: expensesByCategory } =  useExpensesByCategory(selectedCategory)

    const { data: expensesByDateRange } = useExpensesByDateRange(
        adStartDate, adEndDate
    );

    const { data: expensesByCategoryAndDateRange } = useExpensesByCategoryAndDateRange(
        selectedCategory,
        adStartDate,
        adEndDate
    );
    const headerColumns = React.useMemo(() => {
        if (visibleColumns === 'all') return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    // Determine which data to use based on applied filters
    const getFilteredData = () => {
        if (isFilterApplied && adStartDate && adEndDate && selectedCategory !== 'all') {
            return expensesByCategoryAndDateRange || [];
        } else if (isFilterApplied && adStartDate && adEndDate) {
            return expensesByDateRange || [];
        } else if (selectedCategory !== 'all') {
            return expensesByCategory || [];
        }
        return expenses || [];
    };

    const filteredItems = React.useMemo(() => {
        let filteredExpenses = getFilteredData();

        if (hasSearchFilter) {
            filteredExpenses = filteredExpenses.filter((expense) =>
                expense.name.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }

        return filteredExpenses.sort((a, b) => {
            const first = a[sortDescriptor.column as keyof typeof a];
            const second = b[sortDescriptor.column as keyof typeof b];

            const cmp = (first ?? 0) < (second ?? 0) ? -1 : (first ?? 0) > (second ?? 0) ? 1 : 0;

            return sortDescriptor.direction === 'descending' ? -cmp : cmp;
        });
    }, [
        expenses,
        expensesByCategory,
        expensesByDateRange,
        expensesByCategoryAndDateRange,
        filterValue,
        sortDescriptor,
        isFilterApplied,
        adStartDate,
        adEndDate,
        selectedCategory
    ]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const renderCell = React.useCallback((expense: { category: EXPENSE_CATEGORY;[key: string]: any }, columnKey: React.Key) => {
        const cellValue = expense[columnKey as string];

        switch (columnKey) {
            case 'name':
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{expense.name}</p>
                    </div>
                );
            case 'amount':
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small">रु. {expense.amount.toFixed(2)}</p>
                    </div>
                );
            case 'category':
                return (
                    <Chip
                        color={categoryColorMap[expense.category]}
                        variant="flat"
                        className="capitalize"
                    >
                        {expense.category.toLowerCase()}
                    </Chip>
                );
            case 'expense_date':
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small">{formatDate(expense.expense_date)}</p>
                    </div>
                );
            case 'remarks':
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small">{expense.remarks || '-'}</p>
                    </div>
                );
            case 'createdAt':
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small">{expense.createdAt || '-'}</p>
                    </div>
                );
            case 'updatedAt':
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small">{expense.updatedAt || '-'}</p>
                    </div>
                );
            case 'actions':
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
                                        setSelectedExpense(expense as any);
                                        onUpdateOpen();
                                    }}>
                                    Edit Expense
                                </DropdownItem>
                                <DropdownItem
                                    onPress={() => {
                                        setSelectedExpense(expense as any);
                                        onDeleteOpen();
                                    }}
                                    className="text-danger"
                                    color="danger">
                                    Delete Expense
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
            setFilterValue('');
        }
    }, []);

    const handleStartDateChange = (value: string) => {
        setTempBsStartDate(value);
    };

    const handleEndDateChange = (value: string) => {
        setTempBsEndDate(value);
    };

    const handleCategoryChange = (value: EXPENSE_CATEGORY | 'all') => {
        setTempSelectedCategory(value);
    };

    const applyFilters = () => {
        setBsStartDate(tempBsStartDate);
        setBsEndDate(tempBsEndDate);
        setSelectedCategory(tempSelectedCategory);
        setIsFilterApplied(true);
        setPage(1);

        const newFilters = [];
        if (tempBsStartDate) newFilters.push(`Start: ${tempBsStartDate}`);
        if (tempBsEndDate) newFilters.push(`End: ${tempBsEndDate}`);
        if (tempSelectedCategory !== 'all') newFilters.push(`Category: ${tempSelectedCategory}`);
        setActiveFilters(newFilters);
    };

    const clearFilters = () => {
        setTempBsStartDate('');
        setTempBsEndDate('');
        setTempSelectedCategory('all');
        setBsStartDate('');
        setBsEndDate('');
        setSelectedCategory('all');
        setIsFilterApplied(false);
        setActiveFilters([]);
    };

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        classNames={{
                            base: 'w-full sm:max-w-[44%]',
                            inputWrapper: 'border-1',
                        }}
                        placeholder="Search by expense name..."
                        size="sm"
                        startContent={<SearchIcon className="text-default-300" />}
                        value={filterValue}
                        variant="bordered"
                        onClear={() => setFilterValue('')}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
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
                                onSelectionChange={setVisibleColumns}>
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
                            onPress={onAddOpen}>
                            Add Expense
                        </Button>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex flex-1 flex-col sm:flex-row gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-small text-default-500">Start Date</label>
                            <div className="relative">
                                <style>{datePickerCustomStyles}</style>
                                <NepaliDatePicker
                                    className="nepali-date-picker border-1 border-default-200 bg-default-100 rounded-medium"
                                    value={tempBsStartDate}
                                    onChange={handleStartDateChange}
                                    options={{ calenderLocale: 'ne' }}
                                />
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-default-400">
                                    <CalendarIcon size={16} />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-small text-default-500">End Date</label>
                            <div className="relative">
                                <NepaliDatePicker
                                    className="nepali-date-picker border-1 border-default-200 bg-default-100 rounded-medium"
                                    value={tempBsEndDate}
                                    onChange={handleEndDateChange}
                                    options={{ calenderLocale: 'ne' }}
                                />
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-default-400">
                                    <CalendarIcon size={16} />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-small text-default-500">Category</label>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        variant="bordered"
                                        className="capitalize border-1 border-default-200 h-[38px]"
                                    >
                                        {tempSelectedCategory === 'all' ? 'All Categories' : tempSelectedCategory.toLowerCase()}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Expense categories"
                                    items={[
                                        { key: 'all', label: 'All Categories' },
                                        ...Object.values(EXPENSE_CATEGORY).map((category) => ({
                                            key: category,
                                            label: category.toLowerCase(),
                                        })),
                                    ]}
                                >
                                    {(item) => (
                                        <DropdownItem
                                            key={item.key}
                                            className="capitalize"
                                            onClick={() => handleCategoryChange(item.key as EXPENSE_CATEGORY | 'all')}
                                        >
                                            {item.label}
                                        </DropdownItem>
                                    )}
                                </DropdownMenu>

                            </Dropdown>
                        </div>

                        <div className="flex items-end gap-2">
                            <Button
                                color="primary"
                                size="sm"
                                startContent={<FilterIcon size={16} />}
                                onPress={applyFilters}
                                isDisabled={!tempBsStartDate && !tempBsEndDate && tempSelectedCategory === 'all'}
                            >
                                Apply Filters
                            </Button>

                            {(isFilterApplied) && (
                                <Button
                                    variant="flat"
                                    size="sm"
                                    onPress={clearFilters}
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Active Filters */}
                {activeFilters.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        <span className="text-small text-default-500 self-center">Active filters:</span>
                        {activeFilters.map((filter, index) => (
                            <Chip key={index} variant="flat" color="primary" size="sm">
                                {filter}
                            </Chip>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {filteredItems.length} of {expenses?.length || 0} expenses</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small ml-2"
                            onChange={onRowsPerPageChange}>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        expenses?.length,
        tempBsStartDate,
        tempBsEndDate,
        tempSelectedCategory,
        isFilterApplied,
        activeFilters,
        filteredItems.length
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    showControls
                    classNames={{
                        cursor: 'bg-foreground text-background',
                    }}
                    color="default"
                    isDisabled={hasSearchFilter && filteredItems.length <= rowsPerPage}
                    page={page}
                    total={pages}
                    variant="light"
                    onChange={setPage}
                />
                <span className="text-small text-default-400">
                    {selectedKeys === 'all'
                        ? 'All items selected'
                        : `${selectedKeys.size} of ${items.length} selected`}
                </span>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter, filteredItems.length, rowsPerPage]);

    if (isLoading)
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                <Spinner
                    classNames={{
                        base: 'scale-150',
                        label: 'text-foreground mt-4',
                    }}
                    color="primary"
                />
            </div>
        );
    if (isError) return <div>Error fetching expenses. Please try again later.</div>;

    return (
        <div>
            <Table
                isCompact
                removeWrapper
                aria-label="Expense table with custom cells, pagination and sorting"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: ['max-h-[382px]'],
                    th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
                }}
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}>
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === 'actions' ? 'center' : 'start'}
                            allowsSorting={column.sortable}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={'No expenses found'} items={items}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <AddExpense isOpen={isAddOpen} onClose={onAddClose} />
            <UpdateExpense
                isOpen={isUpdateOpen}
                onClose={onUpdateClose}
                expense={selectedExpense}
            />
            <DeleteExpense
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                expense={selectedExpense}
            />
        </div>
    );
}