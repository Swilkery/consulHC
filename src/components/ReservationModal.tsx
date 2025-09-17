import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Repeat } from 'lucide-react';
import { Reservation } from '../types';
import { DAYS_OF_WEEK, generateUUID, getDoctorColor } from '../utils';
import { useRooms } from '../hooks/useRooms';

interface ReservationModalProps {
  isOpen: boolean;
  reservation?: Reservation;
  selectedDate?: Date;
  onClose: () => void;
  onSave: (reservation: Reservation) => void;
  onDelete?: (reservationId: string) => void;
}

export function ReservationModal({
  isOpen,
  reservation,
  selectedDate,
  onClose,
  onSave,
  onDelete
}: ReservationModalProps) {
  const { rooms } = useRooms();
  const [formData, setFormData] = useState({
    doctorName: '',
    roomId: '',
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    isRecurring: false,
    recurringDays: [] as number[]
  });

  useEffect(() => {
    if (reservation) {
      setFormData({
        doctorName: reservation.doctorName,
        roomId: reservation.roomId,
        date: reservation.date.toISOString().split('T')[0],
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        isRecurring: reservation.isRecurring,
        recurringDays: reservation.recurringDays
      });
    } else if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0],
        doctorName: '',
        roomId: rooms[0]?.id || '',
        startTime: '09:00',
        endTime: '10:00',
        isRecurring: false,
        recurringDays: []
      }));
    }
  }, [reservation, selectedDate, rooms]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReservation: Reservation = {
      id: reservation?.id || generateUUID(),
      doctorName: formData.doctorName,
      roomId: formData.roomId,
      date: new Date(formData.date),
      startTime: formData.startTime,
      endTime: formData.endTime,
      isRecurring: formData.isRecurring,
      recurringDays: formData.recurringDays,
      color: getDoctorColor(formData.doctorName)
    };

    onSave(newReservation);
    onClose();
  };

  const handleRecurringDayToggle = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      recurringDays: prev.recurringDays.includes(dayIndex)
        ? prev.recurringDays.filter(d => d !== dayIndex)
        : [...prev.recurringDays, dayIndex]
    }));
  };

  const handleDelete = () => {
    if (reservation && onDelete) {
      onDelete(reservation.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {reservation ? 'Editar Reserva' : 'Nueva Reserva'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 mr-2" />
              Nombre del Doctor
            </label>
            <input
              type="text"
              required
              value={formData.doctorName}
              onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Dr. Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sala
            </label>
            <select
              required
              value={formData.roomId}
              onChange={(e) => setFormData(prev => ({ ...prev, roomId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {rooms.map(room => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              Fecha
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2" />
                Hora Inicio
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2" />
                Hora Fin
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Repeat className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">Reserva recurrente</span>
            </label>
          </div>

          {formData.isRecurring && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Días de la semana
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DAYS_OF_WEEK.map((day, index) => (
                  <label key={index} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.recurringDays.includes(index)}
                      onChange={() => handleRecurringDayToggle(index)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 
                       transition-colors duration-200 font-medium"
            >
              {reservation ? 'Actualizar' : 'Crear'} Reserva
            </button>
            
            {reservation && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 
                         transition-colors duration-200 font-medium"
              >
                Eliminar
              </button>
            )}
            
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 
                       transition-colors duration-200 font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}