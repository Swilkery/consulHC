import React, { createContext, useContext, useState } from 'react';
import { Reservation } from '../types';

interface DragDropContextType {
  draggedReservation: Reservation | null;
  setDraggedReservation: (reservation: Reservation | null) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export function DragDropProvider({ children }: { children: React.ReactNode }) {
  const [draggedReservation, setDraggedReservation] = useState<Reservation | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <DragDropContext.Provider value={{
      draggedReservation,
      setDraggedReservation,
      isDragging,
      setIsDragging
    }}>
      {children}
    </DragDropContext.Provider>
  );
}

export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (context === undefined) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
}