import React, { useCallback, useState, useEffect } from 'react'; // Added useEffect
import { DroppedItem } from '../types';
import { useTouchDrop, TouchDropHandle } from '../hooks/useTouchDrop'; // Updated import
import { useDragContext } from '../hooks/DragContext';
import { DropIndicator } from './Canvas';

interface EmptyCanvasDropTargetProps {
  onDrop: (item: DroppedItem, rowIndex: number, colIndex: number, position: number) => void;
  registerDropTarget: (target: TouchDropHandle) => () => void; // New prop
}

const EmptyCanvasDropTarget: React.FC<EmptyCanvasDropTargetProps> = ({ onDrop, registerDropTarget }) => {
  const { isDragging: isTouchDragging } = useDragContext();
  const touchDropHandle = useTouchDrop({ // Renamed to touchDropHandle
    onDrop: (item, rI, cI, pos) => onDrop(item, rI, cI, pos),
    rowIndex: 0,
    colIndex: 0,
    getElements: useCallback(() => [], []),
  });

  useEffect(() => {
    const cleanup = registerDropTarget(touchDropHandle);
    return () => cleanup();
  }, [registerDropTarget, touchDropHandle]);

  const [isOverNative, setIsOverNative] = useState(false); // Keep for native drag indicator

  const handleNativeDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsOverNative(true);
  }, []);

  const handleNativeDragLeave = useCallback(() => {
    setIsOverNative(false);
  }, []);

  const handleNativeDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOverNative(false);
    try {
      const itemData = e.dataTransfer.getData('application/json');
      if (!itemData || itemData === 'undefined') {
        console.warn("Could not process dropped item. This is normal for external drags.");
        return;
      }
      const item = JSON.parse(itemData) as DroppedItem;
      if (item && typeof item === 'object' && item.type) {
        onDrop(item, 0, 0, 0);
      } else {
        console.warn("Dropped item has invalid structure:", item);
      }
    } catch (error) {
      console.warn("Could not process dropped item. This is normal for external drags.");
    }
  }, [onDrop]);

  return (
    <div
      ref={touchDropHandle.dropRef as React.RefObject<HTMLDivElement>} // Use dropRef from touchDropHandle
      className="w-full min-h-[200px] flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg"
      onDragOver={!isTouchDragging ? handleNativeDragOver : undefined}
      onDrop={!isTouchDragging ? handleNativeDrop : undefined}
      onDragLeave={!isTouchDragging ? handleNativeDragLeave : undefined}
    >
      {(isTouchDragging && touchDropHandle.isOver) || (!isTouchDragging && isOverNative) ? <DropIndicator /> : <p className="text-slate-500">Drag a component or layout here to start</p>}
    </div>
  );
};

export default EmptyCanvasDropTarget;
