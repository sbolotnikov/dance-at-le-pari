import { useRef, useCallback, useEffect, useState } from 'react';
import { DroppedItem } from '../types';
import { useDragContext } from './DragContext';

interface UseTouchDragOptions {
  item: DroppedItem;
  onDragStart?: (item: DroppedItem) => void;
  onDragEnd?: () => void;
}

export const useTouchDrag = ({ item, onDragStart, onDragEnd }: UseTouchDragOptions) => {
  const { setDraggedItem, setIsDragging } = useDragContext();
  const draggableRef = useRef<HTMLElement>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const initialTouchPos = useRef<{ x: number; y: number } | null>(null);

  const createGhost = useCallback(() => {
    if (draggableRef.current) {
      const rect = draggableRef.current.getBoundingClientRect();
      const ghost = draggableRef.current.cloneNode(true) as HTMLDivElement;
      ghost.style.position = 'fixed';
      ghost.style.top = `${rect.top}px`;
      ghost.style.left = `${rect.left}px`;
      ghost.style.width = `${rect.width}px`;
      ghost.style.height = `${rect.height}px`;
      ghost.style.opacity = '0.7';
      ghost.style.pointerEvents = 'none';
      ghost.style.zIndex = '9999';
      ghost.classList.add('touch-drag-ghost'); // Add a class for potential styling
      document.body.appendChild(ghost);
      ghostRef.current = ghost;
    }
  }, []);

  const destroyGhost = useCallback(() => {
    if (ghostRef.current) {
      document.body.removeChild(ghostRef.current);
      ghostRef.current = null;
    }
  }, []);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      e.stopPropagation();
      initialTouchPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setDraggedItem(item);
      setIsDragging(true);
      createGhost();
      onDragStart?.(item);
    },
    [item, setDraggedItem, setIsDragging, createGhost, onDragStart]
  );

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
    if (ghostRef.current && initialTouchPos.current) {
      const dx = e.touches[0].clientX - initialTouchPos.current.x;
      const dy = e.touches[0].clientY - initialTouchPos.current.y;
      ghostRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      e.stopPropagation();
      setDraggedItem(null);
      setIsDragging(false);
      destroyGhost();
      initialTouchPos.current = null;
      onDragEnd?.();
    },
    [setDraggedItem, setIsDragging, destroyGhost, onDragEnd]
  );

  useEffect(() => {
    const node = draggableRef.current;
    if (node) {
      node.addEventListener('touchstart', handleTouchStart as EventListener, { passive: false });
      node.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false });
      node.addEventListener('touchend', handleTouchEnd as EventListener);
      node.addEventListener('touchcancel', handleTouchEnd as EventListener); // Handle touch interruptions

      return () => {
        node.removeEventListener('touchstart', handleTouchStart as EventListener);
        node.removeEventListener('touchmove', handleTouchMove as EventListener);
        node.removeEventListener('touchend', handleTouchEnd as EventListener);
        node.removeEventListener('touchcancel', handleTouchEnd as EventListener);
      };
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { draggableRef };
};
