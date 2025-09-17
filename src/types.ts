export interface Reservation {
  id: string;
  doctorName: string;
  roomId: string;
  date: Date;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurringDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  color?: string;
}

export interface Room {
  id: string;
  name: string;
  color: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasReservations: boolean;
}