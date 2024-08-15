'use client';
import React, { useState, useRef } from 'react';

interface Item {
  id: number;
  text: string;
}

const Page: React.FC = () => {
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
    const draggingElement = document.querySelector(
      `[data-index='${draggingItem.current}']`
    ) as HTMLElement;
    if (draggingElement) {
      draggingElement.style.position = 'absolute';
      draggingElement.style.top = `${e.clientY}px`;
      draggingElement.style.left = `${e.clientX}px`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingItem.current === null) return;
    const draggingElement = document.querySelector(
      `[data-index='${draggingItem.current}']`
    ) as HTMLElement;
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
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="blurFilter border-0 rounded-md p-2 shadow-2xl w-[90%] max-w-[850px] h-full max-h-[85%] md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70">
        <div className="w-full h-full flex flex-col justify-center items-center border rounded-md border-lightMainColor dark:border-darkMainColor  p-2 overflow-y-auto">
        <div>
          {items.map((item, index) => (
            <div
              key={item.id}
              data-index={index}
              onPointerDown={(e) => handlePointerDown(e, index)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerEnter={() => handlePointerEnter(index)}
              onPointerLeave={handlePointerLeave}
              onPointerUpCapture={handleDrop}
              className="draggable-item"
              style={{
                padding: '10px',
                margin: '5px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                cursor: 'pointer',
              }}
            >
              {item.text}
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};
export default Page;
