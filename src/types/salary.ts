// src/types/salary.ts

export interface Salary {
    id: number;
    employee_id: number;
    basic_salary: number;
    bonus?: number;
    advance?: number;
    overtime?: number;
    total_salary: number;
    salary_date: string;
    createdAt?: string;
    updatedAt?: string;
    employee: {
        name: string;
    };
}

export interface CreateSalaryDto {
    employee_id: number;
    basic_salary: number;
    bonus?: number;
    advance?: number;
    overtime?: number;
    total_salary: number;
    salary_date: Date;
}

export interface UpdateSalaryDto {
    employee_id?: number;
    basic_salary?: number;
    bonus?: number;
    advance?: number;
    overtime?: number;
    total_salary?: number;
    salary_date?: Date;
}