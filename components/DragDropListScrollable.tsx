import { useState, useRef, useEffect } from 'react';

interface DraggableListProps<T extends { id: string, name: string }> {
  items: T[];
  onItemsChange: (newItems: T[]) => void;
  renderItem: (item: T) => React.ReactNode;
}

export function DragDropListScrollable<T extends { id: string, name: string }>({
  items,
  onItemsChange,
  renderItem,
}: DraggableListProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(0);
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const handleStart = (clientY: number, index: number) => {
    setDraggedIndex(index);
    setStartY(clientY);
  };

  const handleMove = (clientY: number) => {
    if (draggedIndex === null || !containerRef.current) return;

    // Auto-scroll handling
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const scrollThreshold = 50;
    let newAutoScroll = 0;

    if (clientY < rect.top + scrollThreshold) {
      newAutoScroll = -1;
    } else if (clientY > rect.bottom - scrollThreshold) {
      newAutoScroll = 1;
    }

    setAutoScroll(newAutoScroll);

    // Calculate new position
    const items = [...itemsRef.current];
    const containerScroll = container.scrollTop;
    const containerTop = rect.top + containerScroll;
    const offsetY = clientY - containerTop;
    
    let newIndex = draggedIndex;
    const children = Array.from(container.children) as HTMLElement[];
    
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childRect = child.getBoundingClientRect();
      const childTop = childRect.top - rect.top + containerScroll;
      const childBottom = childRect.bottom - rect.top + containerScroll;

      if (offsetY >= childTop && offsetY <= childBottom) {
        newIndex = i;
        break;
      }
    }

    if (newIndex !== draggedIndex) {
      const newItems = [...items];
      const [removed] = newItems.splice(draggedIndex, 1);
      newItems.splice(newIndex, 0, removed);
      onItemsChange(newItems);
      setDraggedIndex(newIndex);
    }
  };

  const handleEnd = () => {
    setDraggedIndex(null);
    setAutoScroll(0);
  };

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll || !containerRef.current) return;

    const interval = setInterval(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop += autoScroll * 10;
      }
    }, 16);

    return () => clearInterval(interval);
  }, [autoScroll]);

  return (
    <div
      ref={containerRef}
      className="overflow-y-auto h-[400px] relative"
      onTouchMove={(e) => {
        e.preventDefault();
        handleMove(e.touches[0].clientY);
      }}
      onMouseMove={(e) => {
        if (draggedIndex !== null) handleMove(e.clientY);
      }}
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`transition-transform duration-200 touch-none select-none ${
            index === draggedIndex ? 'opacity-50' : ''
          }`}
          onTouchStart={(e) => {
            e.preventDefault();
            handleStart(e.touches[0].clientY, index);
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleStart(e.clientY, index);
          }}
          onTouchEnd={handleEnd}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          style={{
            cursor: draggedIndex === null ? 'grab' : 'grabbing',
            userSelect: 'none',
          }}
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}