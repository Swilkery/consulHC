import React, { useRef, useCallback } from 'react';
import { Reservation } from '../types';
import { formatTime } from '../utils';

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
  const dragRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const originalPosRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!dragRef.current) return;
    
    isDraggingRef.current = true;
    const rect = dragRef.current.getBoundingClientRect();
    
    startPosRef.current = { x: e.clientX, y: e.clientY };
    originalPosRef.current = { x: rect.left, y: rect.top };
    
    // Add visual feedback
    dragRef.current.style.zIndex = '1000';
    dragRef.current.style.opacity = '0.8';
    dragRef.current.style.transform = 'scale(1.02)';
    dragRef.current.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
    dragRef.current.style.transition = 'none';
    
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !dragRef.current) return;
      
      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;
      
      dragRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.02)`;
      
      // Highlight drop zones
      const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
      const timeSlot = elementBelow?.closest('[data-time-slot]');
      
      // Remove previous highlights
      document.querySelectorAll('.drop-zone-highlight').forEach(el => {
        el.classList.remove('drop-zone-highlight');
      });
      
      // Add highlight to current drop zone
      if (timeSlot) {
        timeSlot.classList.add('drop-zone-highlight');
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDraggingRef.current || !dragRef.current) return;
      
      isDraggingRef.current = false;
      
      // Reset visual state
      dragRef.current.style.zIndex = '';
      dragRef.current.style.opacity = '';
      dragRef.current.style.transform = '';
      dragRef.current.style.boxShadow = '';
      dragRef.current.style.transition = '';
      
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      // Remove all highlights
      document.querySelectorAll('.drop-zone-highlight').forEach(el => {
        el.classList.remove('drop-zone-highlight');
      });
      
      // Find drop target
      const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
      const timeSlot = elementBelow?.closest('[data-time-slot]');
      const roomSchedule = elementBelow?.closest('[data-room-id]');
      
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
  }, [reservation, onReservationUpdate]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isDraggingRef.current) return;
    e.stopPropagation();
    onReservationClick(reservation);
  }, [reservation, onReservationClick]);

  return (
    <div
      ref={dragRef}
      className="absolute left-0 right-0 rounded-lg p-2 text-left text-white text-xs font-medium 
                 hover:shadow-lg cursor-grab active:cursor-grabbing
                 border-l-4 border-white/30 select-none transition-all duration-200"
      style={{
        backgroundColor: reservation.color,
        ...style,
        minHeight: '40px'
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
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