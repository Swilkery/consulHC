import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Reservation } from '../types';

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      const formattedReservations: Reservation[] = data.map(reservation => ({
        id: reservation.id,
        doctorName: reservation.doctor_name,
        roomId: reservation.room_id,
        date: new Date(reservation.date),
        startTime: reservation.start_time,
        endTime: reservation.end_time,
        isRecurring: reservation.is_recurring,
        recurringDays: reservation.recurring_days,
        color: reservation.color
      }));

      setReservations(formattedReservations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const addReservation = async (reservation: Omit<Reservation, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert([{
          doctor_name: reservation.doctorName,
          room_id: reservation.roomId,
          date: reservation.date.toISOString().split('T')[0],
          start_time: reservation.startTime,
          end_time: reservation.endTime,
          is_recurring: reservation.isRecurring,
          recurring_days: reservation.recurringDays,
          color: reservation.color
        }])
        .select()
        .single();

      if (error) throw error;

      const newReservation: Reservation = {
        id: data.id,
        doctorName: data.doctor_name,
        roomId: data.room_id,
        date: new Date(data.date),
        startTime: data.start_time,
        endTime: data.end_time,
        isRecurring: data.is_recurring,
        recurringDays: data.recurring_days,
        color: data.color
      };

      setReservations(prev => [...prev, newReservation]);
      return newReservation;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al crear la reserva');
    }
  };

  const updateReservation = async (id: string, reservation: Partial<Omit<Reservation, 'id'>>) => {
    try {
      const updateData: any = {};
      
      if (reservation.doctorName) updateData.doctor_name = reservation.doctorName;
      if (reservation.roomId) updateData.room_id = reservation.roomId;
      if (reservation.date) updateData.date = reservation.date.toISOString().split('T')[0];
      if (reservation.startTime) updateData.start_time = reservation.startTime;
      if (reservation.endTime) updateData.end_time = reservation.endTime;
      if (reservation.isRecurring !== undefined) updateData.is_recurring = reservation.isRecurring;
      if (reservation.recurringDays) updateData.recurring_days = reservation.recurringDays;
      if (reservation.color) updateData.color = reservation.color;

      const { data, error } = await supabase
        .from('reservations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedReservation: Reservation = {
        id: data.id,
        doctorName: data.doctor_name,
        roomId: data.room_id,
        date: new Date(data.date),
        startTime: data.start_time,
        endTime: data.end_time,
        isRecurring: data.is_recurring,
        recurringDays: data.recurring_days,
        color: data.color
      };

      setReservations(prev => prev.map(res => res.id === id ? updatedReservation : res));
      return updatedReservation;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al actualizar la reserva');
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReservations(prev => prev.filter(res => res.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al eliminar la reserva');
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return {
    reservations,
    loading,
    error,
    addReservation,
    updateReservation,
    deleteReservation,
    refetch: fetchReservations
  };
}