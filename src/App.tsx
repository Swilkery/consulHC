import React, { useState, useEffect } from 'react';
import { Calendar } from './components/Calendar';
import { DayView } from './components/DayView';
import { ReservationModal } from './components/ReservationModal';
import { SettingsModal } from './components/SettingsModal';
import { Reservation } from './types';
import { Stethoscope, Settings } from 'lucide-react';
import { useReservations } from './hooks/useReservations';

function App() {
  const [currentView, setCurrentView] = useState<'calendar' | 'day'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | undefined>();

  const { 
    reservations, 
    loading: reservationsLoading, 
    addReservation, 
    updateReservation, 
    deleteReservation 
  } = useReservations();

  const handleMonthChange = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentView('day');
  };

  const handleBackToCalendar = () => {
    setCurrentView('calendar');
    setSelectedDate(null);
  };

  const handleAddReservation = () => {
    setEditingReservation(undefined);
    setIsModalOpen(true);
  };

  const handleReservationClick = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setIsModalOpen(true);
  };

  const handleSaveReservation = (reservation: Reservation) => {
    const { id, ...reservationData } = reservation;
    const existing = reservations.find(r => r.id === id);
    
    if (existing) {
      updateReservation(id, reservationData);
    } else {
      addReservation(reservationData);
    }
  };

  const handleUpdateReservation = (reservation: Reservation) => {
    const { id, ...reservationData } = reservation;
    updateReservation(id, reservationData);
  };

  const handleDeleteReservation = deleteReservation;

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReservation(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Stethoscope className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              Consultas HC
            </h1>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="ml-6 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Configuración"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sistema de gestión y reserva de consultas
          </p>
        </div>

        {reservationsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando datos...</p>
          </div>
        ) : currentView === 'calendar' ? (
          <Calendar
            currentMonth={currentMonth}
            currentYear={currentYear}
            reservations={reservations}
            selectedDate={selectedDate}
            onMonthChange={handleMonthChange}
            onDateSelect={handleDateSelect}
            onReservationUpdate={handleUpdateReservation}
          />
        ) : (
          selectedDate && (
            <DayView
              selectedDate={selectedDate}
              reservations={reservations}
              onBack={handleBackToCalendar}
              onAddReservation={handleAddReservation}
              onReservationClick={handleReservationClick}
            />
          )
        )}

        <ReservationModal
          isOpen={isModalOpen}
          reservation={editingReservation}
          selectedDate={selectedDate}
          onClose={handleCloseModal}
          onSave={handleSaveReservation}
          onDelete={handleDeleteReservation}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;