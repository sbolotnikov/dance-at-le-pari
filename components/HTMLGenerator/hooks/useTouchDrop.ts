import { useRef, useCallback, useState, useImperativeHandle, forwardRef } from 'react';
import { useDragContext } from './DragContext';
import { DroppedItem } from '../types';

interface UseTouchDropOptions {
  onDrop: (item: DroppedItem, rowIndex: number, colIndex: number, position: number) => void;
  rowIndex: number;
  colIndex: number; // -1 for layout rows
  getElements?: () => HTMLElement[]; 
}

export interface TouchDropHandle {
  dropRef: React.RefObject<HTMLElement>;
  isPointOver: (clientX: number, clientY: number) => boolean;
  getDropData: (e: TouchEvent) => { rowIndex: number; colIndex: number; position: number } | null;
  setIsOver: (over: boolean) => void;
  isOver: boolean;
  rowIndex: number;
  colIndex: number;
  onDrop: (item: DroppedItem, rowIndex: number, colIndex: number, position: number) => void;
}

export const useTouchDrop = ({ onDrop, rowIndex, colIndex, getElements }: UseTouchDropOptions): TouchDropHandle => {
  const dropRef = useRef<HTMLElement>(null);
  const [isOver, setIsOver] = useState(false);

  const calculatePosition = useCallback((e: TouchEvent) => {
    if (!dropRef.current || !getElements) return 0;

    const children = getElements();
    
    let position = children.length;
    for (let i = 0; i < children.length; i++) {
        const childRect = children[i].getBoundingClientRect();
        if (e.touches[0].clientY < childRect.top + childRect.height / 2) {
            position = i;
            break;
        }
    }
    return position;
  }, [getElements]);

  const isPointOver = useCallback((clientX: number, clientY: number) => {
    if (!dropRef.current) return false;
    const rect = dropRef.current.getBoundingClientRect();
    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  }, []);

  const getDropData = useCallback((e: TouchEvent) => {
    if (!dropRef.current) return null;
    const position = calculatePosition(e);
    return { rowIndex, colIndex, position };
  }, [calculatePosition, rowIndex, colIndex]);

  return { dropRef, isPointOver, getDropData, setIsOver, isOver, rowIndex, colIndex, onDrop };
};
