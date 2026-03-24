import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DroppedItem } from '../types';

interface DragContextType {
  draggedItem: DroppedItem | null;
  setDraggedItem: (item: DroppedItem | null) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}

const DragContext = createContext<DragContextType | undefined>(undefined);

export const DragProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [draggedItem, setDraggedItem] = useState<DroppedItem | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  return (
    <DragContext.Provider value={{ draggedItem, setDraggedItem, isDragging, setIsDragging }}>
      {children}
    </DragContext.Provider>
  );
};

export const useDragContext = () => {
  const context = useContext(DragContext);
  if (context === undefined) {
    throw new Error('useDragContext must be used within a DragProvider');
  }
  return context;
};
