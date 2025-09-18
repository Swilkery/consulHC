import React from 'react';
import { useDragDrop } from './DragDropContext';

interface TimeSlotProps {
  time: string;
  roomId: string;
  children?: React.ReactNode;
}

export function TimeSlot({ time, roomId, children }: TimeSlotProps) {
  const { isDragging, draggedReservation } = useDragDrop();

  const [hours, minutes] = time.split(':').map(Number);
  const isValidDropTarget = isDragging && draggedReservation && (
    draggedReservation.roomId !== roomId || 
    draggedReservation.startTime !== time
  );

  return (
    <div
      data-time-slot={time}
      data-room-id={roomId}
      className={`
        relative h-10 border-b border-gray-100 transition-colors duration-200
        ${isValidDropTarget ? 'bg-blue-50 border-blue-200' : ''}
        ${isDragging ? 'cursor-crosshair' : ''}
      `}
      style={{ top: `${(hours - 6) * 40 + (minutes / 60) * 40}px` }}
    >
      {children}
    </div>
  );
}