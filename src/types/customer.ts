export interface Customer {
    id: number;
    firstname: string;
    lastname: string;
    address: string;
    company: string;
    email:string;
    contact: string;
    dateofbirth: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCustomerDto {
    firstname: string;
    lastname: string;
    address: string;
    company: string;
    contact: string;
    dateofbirth: Date;
    gender: string;
}