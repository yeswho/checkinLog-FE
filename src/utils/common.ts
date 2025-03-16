import { CalendarDate } from "@nextui-org/react";
import { format } from "date-fns";

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
