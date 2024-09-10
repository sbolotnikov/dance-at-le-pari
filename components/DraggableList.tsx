import React, { useState, useRef, useEffect } from 'react';

interface DraggableListProps {
  initialItems: string[];
}

const DraggableList: React.FC<DraggableListProps> = ({ initialItems }) => {
  const [items, setItems] = useState<string[]>(initialItems);
  const [dragging, setDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [touchY, setTouchY] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const onTouchStart = (e: React.TouchEvent, index: number) => {
    setDragging(true);
    setDraggedIndex(index);
    setTouchY(e.touches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging || draggedIndex === null || touchY === null) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - touchY;
    const threshold = 30; // Minimum pixels to move before swapping

    if (Math.abs(diff) > threshold) {
      const newIndex = diff > 0 ? draggedIndex + 1 : draggedIndex - 1;
      if (newIndex >= 0 && newIndex < items.length) {
        const newItems = [...items];
        [newItems[draggedIndex], newItems[newIndex]] = [newItems[newIndex], newItems[draggedIndex]];
        setItems(newItems);
        setDraggedIndex(newIndex);
        setTouchY(currentY);
      }
    }
  };

  const onTouchEnd = () => {
    setDragging(false);
    setDraggedIndex(null);
    setTouchY(null);
  };

  const onMouseDown = (e: React.MouseEvent, index: number) => {
    setDragging(true);
    setDraggedIndex(index);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || draggedIndex === null || !listRef.current) return;

    const listRect = listRef.current.getBoundingClientRect();
    const y = e.clientY - listRect.top;
    const newIndex = Math.floor(y / 48); // Assuming each item is 48px high

    if (newIndex >= 0 && newIndex < items.length && newIndex !== draggedIndex) {
      const newItems = [...items];
      [newItems[draggedIndex], newItems[newIndex]] = [newItems[newIndex], newItems[draggedIndex]];
      setItems(newItems);
      setDraggedIndex(newIndex);
    }
  };

  const onMouseUp = () => {
    setDragging(false);
    setDraggedIndex(null);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', onMouseMove as any);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onTouchMove as any, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove as any);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove as any);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [dragging, draggedIndex, items]);

  return (
    <ul 
      ref={listRef}
      className="w-full max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden"
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
    >
      {items.map((item, index) => (
        <li
          key={item}
          onMouseDown={(e) => onMouseDown(e, index)}
          onTouchStart={(e) => onTouchStart(e, index)}
          className={`px-4 py-3 border-b last:border-b-0 cursor-move hover:bg-gray-50 transition-colors duration-150 ease-in-out ${
            index === draggedIndex ? 'bg-gray-100' : ''
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

export default DraggableList;