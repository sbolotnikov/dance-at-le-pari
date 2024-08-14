
// i have type script component of drag and drop list. i need you to modify it using CSS and no external libraries.  so it could drag and drop on the phone. use Pointe events instead of Drag because they are not supported on phones
'use client';

import React, { useState, useRef } from 'react';

interface Item {
  id: number;
  text: string;
}


const page: React.FC = () => {
    const [items, setItems] = useState<Item[]>([
      { id: 1, text: 'Item 1' },
      { id: 2, text: 'Item 2' },
      { id: 3, text: 'Item 3' },
    ]);
  
    const draggingItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
  
    const handlePointerDown = (e: React.PointerEvent, index: number) => {
      draggingItem.current = index;
      e.currentTarget.setPointerCapture(e.pointerId);
    };
  
    const handlePointerMove = (e: React.PointerEvent) => {
      if (draggingItem.current === null) return;
      const draggingElement = document.querySelector(`[data-index='${draggingItem.current}']`) as HTMLElement;
      if (draggingElement) {
        draggingElement.style.position = 'absolute';
        draggingElement.style.top = `${e.clientY}px`;
        draggingElement.style.left = `${e.clientX}px`;
      }
    };
  
    const handlePointerUp = (e: React.PointerEvent) => {
      if (draggingItem.current === null) return;
      const draggingElement = document.querySelector(`[data-index='${draggingItem.current}']`) as HTMLElement;
      if (draggingElement) {
        draggingElement.style.position = 'static';
      }
      draggingItem.current = null;
      e.currentTarget.releasePointerCapture(e.pointerId);
    };
  
    const handlePointerEnter = (index: number) => {
      dragOverItem.current = index;
    };
  
    const handlePointerLeave = () => {
      dragOverItem.current = null;
    };
  
    const handleDrop = () => {
      if (draggingItem.current === null || dragOverItem.current === null) return;
      const updatedItems = [...items];
      const [draggedItem] = updatedItems.splice(draggingItem.current, 1);
      updatedItems.splice(dragOverItem.current, 0, draggedItem);
      setItems(updatedItems);
      draggingItem.current = null;
      dragOverItem.current = null;
    };
  
    return (
      <ul>
        {items.map((item, index) => (
          <li
            key={item.id}
            data-index={index}
            onPointerDown={(e) => handlePointerDown(e, index)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerEnter={() => handlePointerEnter(index)}
            onPointerLeave={handlePointerLeave}
            onPointerUpCapture={handleDrop}
            className="draggable-item"
            style={{ touchAction: 'none'}}
          >
            {item.text}
          </li>
        ))}
      </ul>
    );
  };

export default page;
