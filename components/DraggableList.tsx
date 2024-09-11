import React, { useState, useRef, useEffect } from 'react';

interface DraggableListProps {
  initialItems: string[];
}

const DraggableList: React.FC<DraggableListProps> = ({ initialItems }) => {
  const [items, setItems] = useState<string[]>(initialItems);
  const [dragging, setDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [ghostPosition, setGhostPosition] = useState({ x: 0, y: 0 });
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);

  const getClientY = (e: React.TouchEvent | React.MouseEvent | TouchEvent | MouseEvent) => {
    return 'touches' in e ? e.touches[0].clientY : e.clientY;
  };

  const onDragStart = (e: React.TouchEvent | React.MouseEvent, index: number) => {
    setDragging(true);
    setDraggedIndex(index);
    setPlaceholderIndex(index);

    const clientY = getClientY(e);
    const listRect = listRef.current!.getBoundingClientRect();
    setGhostPosition({ x: listRect.left, y: clientY - 20 });

    if (ghostRef.current) {
      ghostRef.current.innerText = items[index];
    }
  };

  const onDragMove = (e: React.TouchEvent | React.MouseEvent | TouchEvent | MouseEvent) => {
    if (!dragging || draggedIndex === null || !listRef.current) return;

    const clientY = getClientY(e);
    const listRect = listRef.current.getBoundingClientRect();
    const y = clientY - listRect.top;
    const newIndex = Math.max(0, Math.min(Math.floor(y / 48), items.length - 1));

    setGhostPosition({ x: listRect.left, y: clientY - 20 });
    setPlaceholderIndex(newIndex);
  };

  const onDragEnd = () => {
    if (draggedIndex !== null && placeholderIndex !== null && draggedIndex !== placeholderIndex) {
      const newItems = [...items];
      const [removed] = newItems.splice(draggedIndex, 1);
      newItems.splice(placeholderIndex, 0, removed);
      setItems(newItems);
    }
    setDragging(false);
    setDraggedIndex(null);
    setPlaceholderIndex(null);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => onDragMove(e);
    const handleTouchMove = (e: TouchEvent) => onDragMove(e);

    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', onDragEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', onDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', onDragEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', onDragEnd);
    };
  }, [dragging, draggedIndex, placeholderIndex, items]);

  return (
    <>
      <ul
        ref={listRef}
        className="w-full max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden"
      >
        {items.map((item, index) => (
          <React.Fragment key={item}>
            {index === placeholderIndex && draggedIndex !== null && draggedIndex !== index && (
              <li className="h-12 bg-blue-100 border-2 border-blue-300 border-dashed"></li>
            )}
            <li
              onMouseDown={(e) => onDragStart(e, index)}
              onTouchStart={(e) => onDragStart(e, index)}
              className={`px-4 h-12 flex items-center border-b last:border-b-0 cursor-move hover:bg-gray-50 transition-colors duration-150 ease-in-out ${
                index === draggedIndex ? 'opacity-50' : ''
              }`}
            >
              {item}
            </li>
          </React.Fragment>
        ))}
        {placeholderIndex === items.length && (
          <li className="h-12 bg-blue-100 border-2 border-blue-300 border-dashed"></li>
        )}
      </ul>
      {dragging && draggedIndex !== null && (
        <div
          ref={ghostRef}
          className="fixed px-4 py-2 bg-white shadow-lg rounded opacity-80 pointer-events-none"
          style={{
            left: `${ghostPosition.x}px`,
            top: `${ghostPosition.y}px`,
            width: listRef.current ? `${listRef.current.offsetWidth - 32}px` : 'auto',
          }}
        >
          {items[draggedIndex]}
        </div>
      )}
    </>
  );
};

export default DraggableList;