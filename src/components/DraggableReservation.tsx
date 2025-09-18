import React, { useState } from 'react';
import { Reservation } from '../types';
import { formatTime } from '../utils';
import { useDragDrop } from './DragDropContext';

interface DraggableReservationProps {
  reservation: Reservation;
  style: React.CSSProperties;
  onReservationClick: (reservation: Reservation) => void;
  onReservationUpdate: (reservation: Reservation) => void;
}

export function DraggableReservation({ 
  reservation, 
  style, 
  onReservationClick,
  onReservationUpdate 
}: DraggableReservationProps) {
  const { setDraggedReservation, setIsDragging } = useDragDrop();
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggedReservation(reservation);
    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => {
      // Visual feedback during drag
      const element = document.getElementById(`reservation-${reservation.id}`);
      if (element) {
        element.style.transform = `translate(${e.clientX - rect.left - dragOffset.x}px, ${e.clientY - rect.top - dragOffset.y}px)`;
        element.style.zIndex = '1000';
        element.style.opacity = '0.8';
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
      setDraggedReservation(null);
      
      // Reset visual state
      const element = document.getElementById(`reservation-${reservation.id}`);
      if (element) {
        element.style.transform = '';
        element.style.zIndex = '';
        element.style.opacity = '';
      }

      // Find drop target
      const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
      const timeSlot = dropTarget?.closest('[data-time-slot]');
      const roomSchedule = dropTarget?.closest('[data-room-id]');

      if (timeSlot && roomSchedule) {
        const newTime = timeSlot.getAttribute('data-time-slot');
        const newRoomId = roomSchedule.getAttribute('data-room-id');
        
        if (newTime && newRoomId) {
          const [hours, minutes] = newTime.split(':').map(Number);
          const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          
          // Calculate end time based on original duration
          const originalStart = reservation.startTime.split(':').map(Number);
          const originalEnd = reservation.endTime.split(':').map(Number);
          const durationMinutes = (originalEnd[0] * 60 + originalEnd[1]) - (originalStart[0] * 60 + originalStart[1]);
          
          const endMinutes = hours * 60 + minutes + durationMinutes;
          const endHours = Math.floor(endMinutes / 60);
          const endMins = endMinutes % 60;
          const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

          if (newRoomId !== reservation.roomId || startTime !== reservation.startTime) {
            onReservationUpdate({
              ...reservation,
              roomId: newRoomId,
              startTime,
              endTime
            });
          }
        }
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReservationClick(reservation);
  };

  return (
    <div
      id={`reservation-${reservation.id}`}
      className="absolute left-0 right-0 rounded-lg p-2 text-left text-white text-xs font-medium 
                 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200
                 border-l-4 border-white/30 cursor-move select-none"
      style={{
        backgroundColor: reservation.color,
        ...style,
        minHeight: '40px'
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      draggable={false}
    >
      <div className="font-semibold truncate">{reservation.doctorName}</div>
      <div className="opacity-90 text-xs">
        {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
      </div>
      {reservation.isRecurring && (
        <div className="opacity-75 text-xs mt-1">🔄 Recurrente</div>
      )}
    </div>
  );
}