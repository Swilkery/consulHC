import React from 'react';
import { Room, Reservation } from '../types';
import { getReservationsForRoom, formatTime } from '../utils';

interface RoomScheduleProps {
  room: Room;
  date: Date;
  reservations: Reservation[];
  onReservationClick: (reservation: Reservation) => void;
}

export function RoomSchedule({ room, date, reservations, onReservationClick }: RoomScheduleProps) {
  const roomReservations = getReservationsForRoom(reservations, room.id, date);

  const getTimeSlotHeight = (startTime: string, endTime: string): number => {
    const start = parseInt(startTime.split(':')[0]);
    const startMinutes = parseInt(startTime.split(':')[1]);
    const end = parseInt(endTime.split(':')[0]);
    const endMinutes = parseInt(endTime.split(':')[1]);
    
    const totalMinutes = (end - start) * 60 + (endMinutes - startMinutes);
    return Math.max(40, totalMinutes / 15 * 10); // Minimum 40px height
  };

  const getTimeSlotPosition = (startTime: string): number => {
    const hour = parseInt(startTime.split(':')[0]);
    const minutes = parseInt(startTime.split(':')[1]);
    
    // Start from 6 AM (6 * 60 = 360 minutes)
    const totalMinutes = hour * 60 + minutes;
    const startMinutes = 6 * 60; // 6 AM
    
    return Math.max(0, (totalMinutes - startMinutes) / 15 * 10); // 10px per 15 minutes
  };

  // Generate hour markers from 6 AM to 10 PM
  const hourMarkers = [];
  for (let hour = 6; hour <= 22; hour++) {
    hourMarkers.push(hour);
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 min-h-[600px]">
      <div 
        className="flex items-center mb-4 pb-3 border-b-2"
        style={{ borderColor: room.color }}
      >
        <div 
          className="w-4 h-4 rounded-full mr-3"
          style={{ backgroundColor: room.color }}
        />
        <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
      </div>

      <div className="relative">
        {/* Hour markers */}
        <div className="absolute left-0 top-0 w-full">
          {hourMarkers.map((hour) => (
            <div
              key={hour}
              className="flex items-center text-xs text-gray-400 absolute left-0"
              style={{ top: `${(hour - 6) * 40}px` }}
            >
              <span className="w-12">{hour}:00</span>
              <div className="flex-1 h-px bg-gray-200 ml-2" />
            </div>
          ))}
        </div>

        {/* Reservations */}
        <div className="ml-16 relative" style={{ height: '680px' }}>
          {roomReservations.map((reservation) => (
            <button
              key={reservation.id}
              onClick={() => onReservationClick(reservation)}
              className="absolute left-0 right-0 rounded-lg p-2 text-left text-white text-xs font-medium 
                         hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200
                         border-l-4 border-white/30"
              style={{
                backgroundColor: reservation.color || room.color,
                top: `${getTimeSlotPosition(reservation.startTime)}px`,
                height: `${getTimeSlotHeight(reservation.startTime, reservation.endTime)}px`,
                minHeight: '40px'
              }}
            >
              <div className="font-semibold truncate">{reservation.doctorName}</div>
              <div className="opacity-90 text-xs">
                {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
              </div>
              {reservation.isRecurring && (
                <div className="opacity-75 text-xs mt-1">🔄 Recurrente</div>
              )}
            </button>
          ))}
          
          {roomReservations.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              <p>No hay reservas para este día</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}