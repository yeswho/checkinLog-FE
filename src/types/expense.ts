import { EXPENSE_CATEGORY } from '../types/employee';

export interface Expense {
  id: number;
  name: string;
  amount: number;
  expense_date: string | Date;
  category: EXPENSE_CATEGORY;
  remarks: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateExpenseDto {
  name: string;
  amount: number;
  expense_date: Date;
  category: EXPENSE_CATEGORY;
  remarks: string;
}

export interface UpdateExpenseDto extends Partial<CreateExpenseDto> {}