import React, { useCallback, useRef, useState, useEffect } from 'react'; // Added useEffect
import { EmailColumn, Element as EmailElementType, GlobalStyles, PreviewMode, DroppedItem } from '../types';
import EmailElement from './EmailElemement';
import { useTouchDrop, TouchDropHandle } from '../hooks/useTouchDrop'; // Updated import
import { useDragContext } from '../hooks/DragContext';
import { DropIndicator } from './Canvas';

interface CanvasColumnProps {
  col: EmailColumn;
  colIndex: number;
  rowIndex: number;
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

const CanvasColumn: React.FC<CanvasColumnProps> = ({
  col,
  colIndex,
  rowIndex,
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

  const getColumnElements = useCallback(() => {
    if (touchDropHandle.dropRef.current) { // Use touchDropHandle.dropRef
      return Array.from(touchDropHandle.dropRef.current.children).filter(child => child.classList.contains('email-element-wrapper')) as HTMLElement[];
    }
    return [];
  }, []);

  const touchDropHandle = useTouchDrop({ // Renamed to touchDropHandle
    onDrop: onDrop,
    rowIndex: rowIndex,
    colIndex: colIndex,
    getElements: getColumnElements,
  });

  useEffect(() => {
    const cleanup = registerDropTarget(touchDropHandle);
    return () => cleanup();
  }, [registerDropTarget, touchDropHandle]);

  const [isOverNativeCol, setIsOverNativeCol] = useState(false); // Keep for native drag indicator

  const handleNativeDragOverCol = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsOverNativeCol(true);
    handleDragOver(e, rowIndex, colIndex); // Call original handler for position calculation
  }, [handleDragOver, rowIndex, colIndex]);

  const handleNativeDragLeaveCol = useCallback(() => {
    setIsOverNativeCol(false);
  }, []);

  const handleNativeDropCol = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOverNativeCol(false);
    handleDrop(e, rowIndex, colIndex); // Call original handler for drop logic
  }, [handleDrop, rowIndex, colIndex]);

  // Robustness fix: Find any element with verticalAlign to control the column's flex alignment.
  const elementWithVA = (col.elements || []).find(el => el.style.verticalAlign);
  const columnVerticalAlign = elementWithVA ? elementWithVA.style.verticalAlign : 'top';
  
  const flexAlignMap = {
      top: 'flex-start',
      middle: 'center',
      bottom: 'flex-end',
  };
  const columnStyle = {
      width: col.style.width as string,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: flexAlignMap[columnVerticalAlign as 'top' | 'middle' | 'bottom'] || 'flex-start',
  };

  return (
    <div
      key={col.id}
      style={columnStyle}
      className="border-r border-dashed border-slate-300 last:border-r-0 p-4 min-h-[50px]"
      onDrop={!isTouchDragging ? handleNativeDropCol : undefined}
      onDragOver={!isTouchDragging ? handleNativeDragOverCol : undefined}
      onDragLeave={!isTouchDragging ? handleNativeDragLeaveCol : undefined}
      ref={touchDropHandle.dropRef as React.RefObject<HTMLDivElement>} // Use dropRef from touchDropHandle
    >
      {(col.elements || []).length === 0 && ((isTouchDragging && touchDropHandle.isOver) || (!isTouchDragging && isOverNativeCol && dragOver?.rowIndex === rowIndex && dragOver?.colIndex === colIndex)) && (
        <DropIndicator />
      )}
      {(col.elements || []).map((el: EmailElementType, elIndex: number) => (
        <React.Fragment key={el.id}>
          {/* For touch drag, the position is calculated in useTouchDrop and passed to onDrop.
              For native drag, dragOver.position is used. */}
          {((isTouchDragging && touchDropHandle.isOver && elIndex === 0) || (!isTouchDragging && isOverNativeCol && dragOver?.rowIndex === rowIndex && dragOver?.colIndex === colIndex && dragOver?.position === elIndex)) && <DropIndicator />}
          <EmailElement
            element={el}
            onSelect={() => onSelectElement(el.id)}
            isSelected={selectedElementId === el.id}
            onDelete={() => onDeleteElement(el.id)}
          />
        </React.Fragment>
      ))}
      {((isTouchDragging && touchDropHandle.isOver && (col.elements || []).length > 0) || (!isTouchDragging && isOverNativeCol && dragOver?.rowIndex === rowIndex && dragOver?.colIndex === colIndex && dragOver?.position === (col.elements || []).length)) && <DropIndicator />}
    </div>
  );
};

export default CanvasColumn;
