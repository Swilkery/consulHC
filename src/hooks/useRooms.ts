import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Room } from '../types';

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      const formattedRooms: Room[] = data.map(room => ({
        id: room.id,
        name: room.name,
        color: room.color
      }));

      setRooms(formattedRooms);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las salas');
    } finally {
      setLoading(false);
    }
  };

  const addRoom = async (name: string, color: string) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert([{ name, color }])
        .select()
        .single();

      if (error) throw error;

      const newRoom: Room = {
        id: data.id,
        name: data.name,
        color: data.color
      };

      setRooms(prev => [...prev, newRoom]);
      return newRoom;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al crear la sala');
    }
  };

  const updateRoom = async (id: string, name: string, color: string) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .update({ name, color })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedRoom: Room = {
        id: data.id,
        name: data.name,
        color: data.color
      };

      setRooms(prev => prev.map(room => room.id === id ? updatedRoom : room));
      return updatedRoom;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al actualizar la sala');
    }
  };

  const deleteRoom = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      setRooms(prev => prev.filter(room => room.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al eliminar la sala');
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return {
    rooms,
    loading,
    error,
    addRoom,
    updateRoom,
    deleteRoom,
    refetch: fetchRooms
  };
}