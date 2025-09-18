import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Reservation } from '../types';
import { formatDate } from '../utils';
import { RoomSchedule } from './RoomSchedule';
import { useRooms } from '../hooks/useRooms';
import { DragDropProvider } from './DragDropContext';

interface DayViewProps {
  selectedDate: Date;
  reservations: Reservation[];
  onBack: () => void;
  onAddReservation: () => void;
  onReservationClick: (reservation: Reservation) => void;
  onReservationUpdate: (reservation: Reservation) => void;
}

export function DayView({ 
  selectedDate, 
  reservations, 
  onBack, 
  onAddReservation,
  onReservationClick,
  onReservationUpdate
}: DayViewProps) {
  const { rooms } = useRooms();

  return (
    <DragDropProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 
                       transition-colors duration-200 hover:bg-gray-100 rounded-lg p-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al calendario</span>
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900">
              {formatDate(selectedDate)}
            </h1>
          </div>
          
          <button
            onClick={onAddReservation}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 
                     rounded-lg hover:bg-blue-700 transition-colors duration-200 
                     shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Reserva</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomSchedule
              key={room.id}
              room={room}
              date={selectedDate}
              reservations={reservations}
              onReservationClick={onReservationClick}
              onReservationUpdate={onReservationUpdate}
            />
          ))}
        </div>
      </div>
    </DragDropProvider>
  );
}