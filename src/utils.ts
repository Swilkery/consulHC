import { Reservation, Room, CalendarDay } from './types';

export const DOCTOR_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

export const DAYS_OF_WEEK = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

export const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatTime(time: string): string {
  return time;
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  const endDate = new Date(lastDay);
  
  // Adjust to show full weeks
  startDate.setDate(startDate.getDate() - startDate.getDay());
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  
  const days: CalendarDay[] = [];
  const current = new Date(startDate);
  const today = new Date();
  
  while (current <= endDate) {
    days.push({
      date: new Date(current),
      isCurrentMonth: current.getMonth() === month,
      isToday: current.toDateString() === today.toDateString(),
      hasReservations: false
    });
    current.setDate(current.getDate() + 1);
  }
  
  return days;
}

export function getReservationsForDate(reservations: Reservation[], date: Date): Reservation[] {
  return reservations.filter(reservation => {
    if (reservation.isRecurring) {
      return reservation.recurringDays.includes(date.getDay());
    } else {
      return reservation.date.toDateString() === date.toDateString();
    }
  });
}

export function getReservationsForRoom(reservations: Reservation[], roomId: string, date: Date): Reservation[] {
  return getReservationsForDate(reservations, date).filter(
    reservation => reservation.roomId === roomId
  );
}

export function hasTimeConflict(
  startTime1: string, 
  endTime1: string, 
  startTime2: string, 
  endTime2: string
): boolean {
  const start1 = timeToMinutes(startTime1);
  const end1 = timeToMinutes(endTime1);
  const start2 = timeToMinutes(startTime2);
  const end2 = timeToMinutes(endTime2);
  
  return start1 < end2 && start2 < end1;
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function getDoctorColor(doctorName: string): string {
  const hash = doctorName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return DOCTOR_COLORS[Math.abs(hash) % DOCTOR_COLORS.length];
}