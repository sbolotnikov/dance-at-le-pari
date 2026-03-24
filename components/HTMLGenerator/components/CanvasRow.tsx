import React, { useCallback, useRef, useState, useEffect } from 'react'; // Added useEffect
import { EmailRow, EmailColumn, Element as EmailElementType, GlobalStyles, PreviewMode, DroppedItem } from '../types';
import { useTouchDrop, TouchDropHandle } from '../hooks/useTouchDrop'; // Updated import
import { useDragContext } from '../hooks/DragContext';
import { DropIndicator } from './Canvas';
import CanvasColumn from './CanvasColumn';

interface CanvasRowProps {
  row: EmailRow;
  rowIndex: number;
  emailData: EmailRow[];
  onDrop: (item: DroppedItem, rowIndex: number, colIndex: number, position: number) => void;
  onSelectElement: (id: string) => void;
  selectedElementId: string | null;
  onDeleteElement: (id: string) => void;
  previewMode: PreviewMode;
  globalStyles: GlobalStyles;
  handleDragOver: (e: React.DragEvent, rowIndex: number, colIndex: number) => void;
  handleDrop: (e: React.DragEvent, rowIndex: number, colIndex: number) => void;
  dragOver: {rowIndex: number, colIndex: number, position: number} | null;
  registerDropTarget: (target: TouchDropHandle) => () => void; // New prop
}

const CanvasRow: React.FC<CanvasRowProps> = ({
  row,
  rowIndex,
  emailData,
  onDrop,
  onSelectElement,
  selectedElementId,
  onDeleteElement,
  previewMode,
  globalStyles,
  handleDragOver,
  handleDrop,
  dragOver,
  registerDropTarget, // New prop
}) => {
  const { isDragging: isTouchDragging } = useDragContext();

  const touchDropHandle = useTouchDrop({ // Renamed to touchDropHandle
    onDrop: onDrop,
    rowIndex: rowIndex,
    colIndex: -1, // Indicates a row drop
    getElements: useCallback(() => [], []),
  });

  useEffect(() => {
    const cleanup = registerDropTarget(touchDropHandle);
    return () => cleanup();
  }, [registerDropTarget, touchDropHandle]);

  const [isOverNativeRow, setIsOverNativeRow] = useState(false); // Keep for native drag indicator

  const handleNativeDragOverRow = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsOverNativeRow(true);
    handleDragOver(e, rowIndex, -1); // Call original handler for position calculation
  }, [handleDragOver, rowIndex]);

  const handleNativeDragLeaveRow = useCallback(() => {
    setIsOverNativeRow(false);
  }, []);

  const handleNativeDropRow = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOverNativeRow(false);
    handleDrop(e, rowIndex, -1); // Call original handler for drop logic
  }, [handleDrop, rowIndex]);

  return (
    <div
      key={row.id}
      className="border-b border-dashed border-slate-300 relative group"
      onDragOver={!isTouchDragging ? handleNativeDragOverRow : undefined}
      onDrop={!isTouchDragging ? handleNativeDropRow : undefined}
      onDragLeave={!isTouchDragging ? handleNativeDragLeaveRow : undefined}
      ref={touchDropHandle.dropRef as React.RefObject<HTMLDivElement>} // Use dropRef from touchDropHandle
    >
      {((isTouchDragging && touchDropHandle.isOver) || (!isTouchDragging && isOverNativeRow && dragOver?.rowIndex === rowIndex && dragOver.colIndex === -1)) && <DropIndicator />}
      <div className="flex">
        {(row.columns || []).map((col, colIndex) => (
          <CanvasColumn
            key={col.id}
            col={col}
            colIndex={colIndex}
            rowIndex={rowIndex}
            onDrop={onDrop}
            onSelectElement={onSelectElement}
            selectedElementId={selectedElementId}
            onDeleteElement={onDeleteElement}
            previewMode={previewMode}
            globalStyles={globalStyles}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            dragOver={dragOver}
            registerDropTarget={registerDropTarget} // Pass to CanvasColumn
          />
        ))}
      </div>
    </div>
  );
};
export default CanvasRow;