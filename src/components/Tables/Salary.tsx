import React, { useState, useMemo, useCallback } from 'react';
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
  Spinner,
} from '@nextui-org/react';
import { useSalaries } from '../../hooks/useSalary';
import { ChevronDownIcon } from './ChevronDownIcon';
import { columns } from './salaryData';
import { PlusIcon } from './PlusIcon';
import { SearchIcon } from './SearchIcon';
import { CalendarIcon } from './CalendarIcon';
import { FilterIcon } from './FilterIcon.js';
import { capitalize } from './utils';
import { VerticalDotsIcon } from './VerticalDotsIcon';
import AddSalary from '../../components/Modals/AddSalary/AddSalary';
import UpdateSalary from '../../components/Modals/UpdateSalary/UpdateSalary';
import DeleteSalary from '../../components/Modals/DeleteSalary/DeleteSalary';
import { formatDate } from '../../utils/common';

// import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
// import 'nepali-datepicker-reactjs/dist/index.css';
// import { convertBsToAd } from './dateConvert';

// const datePickerCustomStyles = `
//   .nepali-date-picker {
//     font-family: inherit;
//     border-radius: 0.5rem !important;
//     border-width: 1px !important;
//     height: 2.25rem !important;
//     min-width: 140px !important;
//     padding: 0.375rem 0.75rem !important;
//     transition: all 0.2s ease !important;
//   }
  
//   .nepali-date-picker:focus-within {
//     outline: 2px solid var(--nextui-colors-primary) !important;
//     outline-offset: 2px !important;
//   }
  
//   .date-picker-header, .date-picker-body {
//     background-color: var(--nextui-colors-background) !important;
//     border-color: var(--nextui-colors-border) !important;
//   }
  
//   .selected-day {
//     background-color: var(--nextui-colors-primary) !important;
//     color: white !important;
//   }
  
//   .day:hover {
//     background-color: var(--nextui-colors-primaryLight) !important;
//     color: var(--nextui-colors-primaryLightContrast) !important;
//   }
// `;

const INITIAL_VISIBLE_COLUMNS = [
  'id',
  'employee',
  'basic_salary',
  'bonus',
  'advance',
  'overtime',
  'total_salary',
  'salary_date',
  'actions'
];

export default function SalaryTable() {
  const { data: salaries, isLoading, isError } = useSalaries();
  const [filterValue, setFilterValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [selectedSalary, setSelectedSalary] = useState(null);

  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

  // const adStartDate = bsStartDate ? convertBsToAd(bsStartDate).toString().split('T')[0] : '';
  // const adEndDate = bsEndDate ? convertBsToAd(bsEndDate).toString().split('T')[0] : '';

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  });

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredSalaries = salaries || [];

    if (hasSearchFilter) {
      filteredSalaries = filteredSalaries.filter((salary) =>
        salary.employee.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    if (isFilterApplied && startDate && endDate) {
      filteredSalaries = filteredSalaries.filter((salary) => {
        const salaryDate = new Date(salary.salary_date);
        const startFilterDate = new Date(startDate);
        const endFilterDate = new Date(endDate);
        return salaryDate >= startFilterDate && salaryDate <= endFilterDate;
      });
    }

    return filteredSalaries.sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a];
      const second = b[sortDescriptor.column as keyof typeof b];
      const cmp = (first ?? 0) < (second ?? 0) ? -1 : (first ?? 0) > (second ?? 0) ? 1 : 0;
      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [salaries, filterValue, sortDescriptor, isFilterApplied, startDate, endDate]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const renderCell = useCallback((salary: any, columnKey: React.Key) => {
    const cellValue = salary[columnKey as keyof any];

    switch (columnKey) {
      case 'employee':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{salary.employee.name}</p>
          </div>
        );
      case 'basic_salary':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">रु. {salary.basic_salary.toFixed(2)}</p>
          </div>
        );
      case 'bonus':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">
              {salary.bonus ? `रु. ${salary.bonus.toFixed(2)}` : '-'}
            </p>
          </div>
        );
      case 'advance':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">
              {salary.advance ? `रु. ${salary.advance.toFixed(2)}` : '-'}
            </p>
          </div>
        );
      case 'overtime':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">
              {salary.overtime ? `रु. ${salary.overtime.toFixed(2)}` : '-'}
            </p>
          </div>
        );
      case 'total_salary':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">रु. {salary.total_salary.toFixed(2)}</p>
          </div>
        );
      case 'salary_date':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{formatDate(salary.salary_date)}</p>
          </div>
        );
      case 'actions':
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-400" width={16} height={16} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  onPress={() => {
                    setSelectedSalary(salary);
                    onUpdateOpen();
                  }}>
                  Edit Salary
                </DropdownItem>
                <DropdownItem
                  onPress={() => {
                    setSelectedSalary(salary);
                    onDeleteOpen();
                  }}
                  className="text-danger"
                  color="danger">
                  Delete Salary
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempEndDate(e.target.value);
  };

  const applyDateFilter = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setIsFilterApplied(true);
    setPage(1);
    
    const newFilters = [];
    if (tempStartDate) newFilters.push(`Start: ${tempStartDate}`);
    if (tempEndDate) newFilters.push(`End: ${tempEndDate}`);
    setActiveFilters(newFilters);
  };

  const clearDateFilter = () => {
    setTempStartDate('');
    setTempEndDate('');
    setStartDate('');
    setEndDate('');
    setIsFilterApplied(false);
    setActiveFilters([]);
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: 'w-full sm:max-w-[44%]',
              inputWrapper: 'border-1',
            }}
            placeholder="Search by employee name..."
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
              endContent={<PlusIcon width={16} height={16} />}
              size="sm"
              onPress={onAddOpen}>
              Add Salary
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-1 flex-col sm:flex-row gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-small text-default-500">Start Date</label>
              <div className="relative">
                {/* <style>{datePickerCustomStyles}</style> */}
                <Input
                  type="date"
                  value={tempStartDate}
                  onChange={handleStartDateChange}
                  className="border-1 border-default-200 bg-default-100 rounded-medium"
                  size="sm"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-default-400">
                  <CalendarIcon size={16} />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-small text-default-500">End Date</label>
              <div className="relative">
                <Input
                  type="date"
                  value={tempEndDate}
                  onChange={handleEndDateChange}
                  className="border-1 border-default-200 bg-default-100 rounded-medium"
                  size="sm"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-default-400">
                  <CalendarIcon size={16} />
                </div>
              </div>
            </div>
            
            <div className="flex items-end gap-2">
              <Button 
                color="primary" 
                size="sm" 
                startContent={<FilterIcon size={16} />}
                onPress={applyDateFilter}
                isDisabled={!tempStartDate && !tempEndDate}
              >
                Apply Filter
              </Button>
              
              {isFilterApplied && (
                <Button 
                  variant="flat" 
                  size="sm" 
                  onPress={clearDateFilter}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
        
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
          <span className="text-default-400 text-small">Total {filteredItems.length} of {salaries?.length || 0} salaries</span>
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
    salaries?.length,
    tempStartDate,
    tempEndDate,
    isFilterApplied,
    activeFilters,
    filteredItems.length
  ]);

  const bottomContent = useMemo(() => {
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

  if (isError) {
    return <div>Error fetching salaries. Please try again later.</div>;
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="flex items-center">
          <Spinner 
            size="lg" 
            color="primary" 
            label="Loading salaries..."
            classNames={{
              base: "scale-150",
              label: "text-foreground mt-4",
            }}
          />
        </div>
      )}
      <Table
        isCompact
        removeWrapper
        aria-label="Salary table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: ['max-h-[382px]', isLoading ? 'opacity-50' : ''],
          th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
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
              align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={isLoading ? ' ' : 'No salaries found'} items={items}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <AddSalary isOpen={isAddOpen} onClose={onAddClose} />
      <UpdateSalary isOpen={isUpdateOpen} onClose={onUpdateClose} salary={selectedSalary} />
      <DeleteSalary isOpen={isDeleteOpen} onClose={onDeleteClose} salary={selectedSalary} />
    </div>
  );
}