import React from 'react';
import { Room, Reservation } from '../types';
import { getReservationsForRoom, formatTime } from '../utils';
import { DraggableReservation } from './DraggableReservation';
import { TimeSlot } from './TimeSlot';
import { useDragDrop } from './DragDropContext';

interface RoomScheduleProps {
  room: Room;
  date: Date;
  reservations: Reservation[];
  onReservationClick: (reservation: Reservation) => void;
  onReservationUpdate: (reservation: Reservation) => void;
}

export function RoomSchedule({ 
  room, 
  date, 
  reservations, 
  onReservationClick,
  onReservationUpdate 
}: RoomScheduleProps) {
  const roomReservations = getReservationsForRoom(reservations, room.id, date);
  const { isDragging } = useDragDrop();

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

  // Generate time slots every 15 minutes from 6 AM to 10 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Generate hour markers from 6 AM to 10 PM
  const hourMarkers = [];
  for (let hour = 6; hour <= 22; hour++) {
    hourMarkers.push(hour);
  }

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 min-h-[600px] transition-all duration-200 ${
        isDragging ? 'ring-2 ring-blue-200' : ''
      }`}
      data-room-id={room.id}
    >
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
          {/* Time slots for drop targets */}
          {timeSlots.map((time) => (
            <TimeSlot key={time} time={time} roomId={room.id} />
          ))}

          {/* Reservations */}
          {roomReservations.map((reservation) => (
            <DraggableReservation
              key={reservation.id}
              reservation={reservation}
              onReservationClick={onReservationClick}
              onReservationUpdate={onReservationUpdate}
              style={{
                top: `${getTimeSlotPosition(reservation.startTime)}px`,
                height: `${getTimeSlotHeight(reservation.startTime, reservation.endTime)}px`
              }}
            />
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