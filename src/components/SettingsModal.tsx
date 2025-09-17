import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Settings, Palette } from 'lucide-react';
import { Room } from '../types';
import { useRooms } from '../hooks/useRooms';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RoomFormData {
  name: string;
  color: string;
}

const PRESET_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { rooms, loading, addRoom, updateRoom, deleteRoom } = useRooms();
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<RoomFormData>({ name: '', color: '#3B82F6' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);
      if (editingRoom) {
        await updateRoom(editingRoom.id, formData.name.trim(), formData.color);
      } else {
        await addRoom(formData.name.trim(), formData.color);
      }
      handleCancelForm();
    } catch (error) {
      console.error('Error al guardar la sala:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({ name: room.name, color: room.color });
    setShowForm(true);
  };

  const handleDelete = async (room: Room) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la sala "${room.name}"?`)) {
      try {
        await deleteRoom(room.id);
      } catch (error) {
        console.error('Error al eliminar la sala:', error);
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingRoom(null);
    setFormData({ name: '', color: '#3B82F6' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Configuración de Salas</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Cargando salas...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Lista de salas */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Salas Disponibles</h3>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 
                           rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Sala</span>
                </button>
              </div>

              <div className="space-y-3">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: room.color }}
                      />
                      <span className="font-medium text-gray-900">{room.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(room)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(room)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {rooms.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No hay salas configuradas</p>
                    <p className="text-sm">Añade tu primera sala para comenzar</p>
                  </div>
                )}
              </div>
            </div>

            {/* Formulario para añadir/editar sala */}
            {showForm && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingRoom ? 'Editar Sala' : 'Nueva Sala'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Sala
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Consulta 1"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      <Palette className="w-4 h-4 mr-2" />
                      Color de la Sala
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color }))}
                          className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                            formData.color === color 
                              ? 'border-gray-900 shadow-lg' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="mt-3">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 
                               transition-colors duration-200 font-medium disabled:opacity-50"
                    >
                      {submitting ? 'Guardando...' : (editingRoom ? 'Actualizar' : 'Crear')} Sala
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 
                               transition-colors duration-200 font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}