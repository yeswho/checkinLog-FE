// Employee Type
export enum DESIGNATIONS {
    OWNER = 'Owner',
    MANAGER = 'Manager',
    RECEPTIONIST = 'Receptionist',
    ACCOUNTANT = 'Accountant',
    COOK = 'Cook',
    SECURITY = 'Security',
    HELPER = 'Helper',
    HOUSEKEEPER = 'House Keeper',
    CLEANER = 'Cleaner',
    GARDENER = 'Gardener',
    DRIVER = 'Driver',
    TECHNICIAN = 'Technician',
    WAITER = 'Waiter',
    BARTENDER = 'Bartender',
    OTHER = 'Other'
}

export enum EXPENSE_CATEGORY {
    SALARY = 'Salary',
    SUPPLIER = 'Supplier',
    MAINTENANCE = 'Maintenance',
    UTILITIES = 'Utilities',
    HOUSEKEEPING = 'Housekeeping',
    FOOD_AND_BEVERAGE = 'Food and Beverage',
    MARKETING = 'Marketing',
    LICENSING_AND_FEES = 'Licensing and Fees',
    TRANSPORTATION = 'Transportation',
    SECURITY = 'Security',
    TRAINING_AND_DEVELOPMENT = 'Training and Development',
    FURNITURE_AND_EQUIPMENT = 'Furniture and Equipment',
    INSURANCE = 'Insurance',
    MISCELLANEOUS = 'Miscellaneous',
    EMPLOYEE_ADVANCE = 'Employee Advance'
}

export interface Employee {
    id: number;
    name: string;
    designation: DESIGNATIONS;
    basic_salary: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Create Employee DTO (Data Transfer Object)
  export interface CreateEmployeeDto {
    name: string;
    designation: DESIGNATIONS;
    basic_salary: number;
  }
  
  // Update Employee DTO (Data Transfer Object)
  export interface UpdateEmployeeDto {
    name?: string;
    designation?: DESIGNATIONS;
    basic_salary?: number;
  }