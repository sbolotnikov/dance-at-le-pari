import React, { useState, useRef, useEffect, useCallback } from 'react';

interface DraggableListProps {
  initialItems: string[];
  onListChange?: (items: string[]) => void;
  containerClassName?: string;
  itemHeight?: number;
  autoScrollSpeed?: number;
}

const DraggableList: React.FC<DraggableListProps> = ({
  initialItems,
  onListChange,
  containerClassName = '',
  itemHeight = 48,
  autoScrollSpeed = 15
}) => {
  const [items, setItems] = useState<string[]>(initialItems);
  const [dragging, setDragging] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchDragging, setTouchDragging] = useState<boolean>(false);
  
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const dragOverItemIndex = useRef<number | null>(null);
  const autoScrollId = useRef<number | null>(null);
  
  // Initialize item refs array
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length);
  }, [items.length]);
  
  // Notify parent component about list changes
  useEffect(() => {
    if (onListChange) {
      onListChange(items);
    }
  }, [items, onListChange]);
  
  const updateList = useCallback((dragIndex: number, hoverIndex: number) => {
    if (dragIndex === hoverIndex) return;
    
    setItems(prev => {
      const newItems = [...prev];
      const draggedItem = newItems[dragIndex];
      
      // Remove the dragged item
      newItems.splice(dragIndex, 1);
      // Insert at the new position
      newItems.splice(hoverIndex, 0, draggedItem);
      
      return newItems;
    });
  }, []);
  
  const handleDragStart = (index: number, e: React.DragEvent<HTMLLIElement>) => {
    setDragging(index);
    
    // Set drag image (improves visual feedback)
    if (e.dataTransfer && itemRefs.current[index]) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', items[index]);
      
      // Create a transparent drag image for better UX
      try {
        const dragImg = new Image();
        dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Transparent image
        e.dataTransfer.setDragImage(dragImg, 0, 0);
      } catch (error) {
        // Fallback if customizing drag image fails
      }
    }
  };
  
  const handleDragOver = useCallback((index: number, e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    
    if (dragging === null || dragging === index) {
      return;
    }
    
    dragOverItemIndex.current = index;
    
    // Get mouse position relative to the list item
    const mouseY = e.clientY;
    
    if (itemRefs.current[index]) {
      const itemRect = itemRefs.current[index]!.getBoundingClientRect();
      const itemMiddle = itemRect.top + itemRect.height / 2;
      
      // Determine if we should move up or down
      if (mouseY < itemMiddle && index > 0) {
        // Mouse is in the top half of the item
        updateList(dragging, index);
        setDragging(index);
      } else if (mouseY >= itemMiddle && index < items.length - 1) {
        // Mouse is in the bottom half of the item
        updateList(dragging, index);
        setDragging(index);
      }
    }
  }, [dragging, items.length, updateList]);
  
  const handleDragEnd = () => {
    setDragging(null);
    dragOverItemIndex.current = null;
  };
  
  // Touch event handlers
  const handleTouchStart = (index: number, e: React.TouchEvent<HTMLLIElement>) => {
    if (e.touches.length === 1) {
      setTouchStartY(e.touches[0].clientY);
      
      // Use a timeout to distinguish between tap and drag
      const touchTimeout = setTimeout(() => {
        setDragging(index);
        setTouchDragging(true);
        
        // Add visual indication that the item is being dragged
        if (itemRefs.current[index]) {
          itemRefs.current[index]!.style.opacity = '0.7';
          itemRefs.current[index]!.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        }
      }, 200);
      
      // Clear timeout if touch ends quickly (tap)
      return () => clearTimeout(touchTimeout);
    }
  };
  
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLLIElement>) => {
    e.preventDefault(); // Prevent scrolling while dragging
    
    if (dragging === null || !touchDragging) return;
    
    const touch = e.touches[0];
    const touchY = touch.clientY;
    
    // Find the item under the touch point
    for (let i = 0; i < itemRefs.current.length; i++) {
      const item = itemRefs.current[i];
      if (!item) continue;
      
      const rect = item.getBoundingClientRect();
      if (touchY >= rect.top && touchY <= rect.bottom) {
        if (i !== dragging) {
          updateList(dragging, i);
          setDragging(i);
        }
        break;
      }
    }
    
    // Handle auto-scrolling when near the edges
    if (listRef.current) {
      const listRect = listRef.current.getBoundingClientRect();
      const touchOffset = touchY - listRect.top;
      
      if (autoScrollId.current) {
        window.cancelAnimationFrame(autoScrollId.current);
        autoScrollId.current = null;
      }
      
      if (touchOffset < itemHeight) {
        // Auto-scroll up
        const scrollUp = () => {
          if (listRef.current) {
            listRef.current.scrollTop -= autoScrollSpeed;
            autoScrollId.current = window.requestAnimationFrame(scrollUp);
          }
        };
        autoScrollId.current = window.requestAnimationFrame(scrollUp);
      } else if (touchOffset > listRect.height - itemHeight) {
        // Auto-scroll down
        const scrollDown = () => {
          if (listRef.current) {
            listRef.current.scrollTop += autoScrollSpeed;
            autoScrollId.current = window.requestAnimationFrame(scrollDown);
          }
        };
        autoScrollId.current = window.requestAnimationFrame(scrollDown);
      }
    }
  }, [dragging, touchDragging, itemHeight, autoScrollSpeed, updateList]);
  
  const handleTouchEnd = () => {
    if (dragging !== null && touchDragging) {
      // Reset styling for the dragged item
      if (itemRefs.current[dragging]) {
        itemRefs.current[dragging]!.style.opacity = '1';
        itemRefs.current[dragging]!.style.boxShadow = 'none';
      }
      
      if (autoScrollId.current) {
        window.cancelAnimationFrame(autoScrollId.current);
        autoScrollId.current = null;
      }
    }
    
    setDragging(null);
    setTouchStartY(null);
    setTouchDragging(false);
  };
  
  // Ensure auto-scroll is canceled when component unmounts
  useEffect(() => {
    return () => {
      if (autoScrollId.current) {
        window.cancelAnimationFrame(autoScrollId.current);
      }
    };
  }, []);
  
  return (
    <ul
      ref={listRef}
      className={`draggable-list ${containerClassName}`}
      style={{
        padding: '0',
        margin: '0',
        listStyle: 'none',
        maxHeight: '100%',
        overflowY: 'auto'
      }}
    >
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          ref={el => itemRefs.current[index] = el}
          draggable={!touchDragging}
          onDragStart={e => handleDragStart(index, e)}
          onDragOver={e => handleDragOver(index, e)}
          onDragEnd={handleDragEnd}
          onTouchStart={e => handleTouchStart(index, e)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            padding: '10px 16px',
            margin: '4px 0',
            backgroundColor: dragging === index ? '#f0f0f0' : 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'grab',
            height: `${itemHeight}px`,
            display: 'flex',
            alignItems: 'center',
            userSelect: 'none',
            position: 'relative',
            transition: 'transform 0.1s ease, box-shadow 0.1s ease',
            transform: touchDragging && dragging === index ? 'scale(1.02)' : 'scale(1)'
          }}
        >
          <div className="drag-handle" style={{ marginRight: '10px', cursor: 'grab' }}>
            ≡
          </div>
          <div className="item-content" style={{ flexGrow: 1 }}>
            {item}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default DraggableList;