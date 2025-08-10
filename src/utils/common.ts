import { CalendarDate } from "@nextui-org/react";
import { format, parseISO, isValid} from "date-fns";

export function toDate(calendarDate: CalendarDate): Date {
    const year = calendarDate.year;
    const month = calendarDate.month - 1;
    const day = calendarDate.day;
    return new Date(year, month, day);
  }

 export const toCalendarDate = (date: Date) => ({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  });
  

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "dd/MM/yyyy");
};


export const formatDateString = (dateString: string): string => {
  if (!dateString) return '-';
  
  try {
    const date = parseISO(dateString);
    
    // Check if date is valid
    if (!isValid(date)) return '-';
    
    // Format: YYYY-MM-DD
    return format(date, 'yyyy-MM-dd');
    
  } catch (error) {
    return '-';
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};


export const parseToDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  try {
    const date = parseISO(dateString);
    if (isNaN(date.getTime())) return null;
    return date;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
};

export const formatDateToBackend = (dateString: string): string => {
  if (!isNaN(Date.parse(dateString))) {
      return dateString;
  }
  
  // Convert from DD/MM/YYYY to YYYY-MM-DD
  const [day, month, year] = dateString.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};