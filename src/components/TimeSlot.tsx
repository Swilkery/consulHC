import React from 'react';

interface TimeSlotProps {
  time: string;
  roomId: string;
  children?: React.ReactNode;
}

export function TimeSlot({ time, roomId, children }: TimeSlotProps) {
  return (
    <div
      data-time-slot={time}
      data-room-id={roomId}
      className="relative h-10 border-b border-gray-100 transition-colors duration-150"
    >
      {children}
    </div>
  );
}