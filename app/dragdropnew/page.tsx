// i have type script component of drag and drop list. i need you to modify it using CSS and no external libraries.  so it could drag and drop on the phone. use Pointe events instead of Drag because they are not supported on phones
 'use client';

import React, { useState, useRef } from 'react'; 

interface Item {
  id: number;
  text: string;
}

const Page: React.FC = () => {
  const [data, setData] = useState<Item[]>([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
  ]);
  const [isDragging, setIsDragging] = useState(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingItem = useRef<number | null>(null); 

  const detectLeftButton = (e: React.PointerEvent) => {
    e = e || window.event;
    if ('buttons' in e) {
      return e.buttons === 1;
    }
    let button = (e as React.PointerEvent).button;
    return button === 1;
  };

  const handlePointerDown = (e: React.PointerEvent, index: number) => {
    if (!detectLeftButton(e)) return;
    setIsDragging(index);
    
    let x = e.clientX;
    let y = e.clientY;
    const container: HTMLElement | null = containerRef.current;
    const itemsArr = Array.from(container!.childNodes) as HTMLElement[];
    const dragItem = itemsArr[index];
    const itemsBelowDragItem = itemsArr.slice(index + 1);
    const notDragItems = itemsArr.filter((item) => item !== dragItem);
    const dragData = data[index];
    let newData: Item[] = [];
    const dragBoundingRect = dragItem.getBoundingClientRect();
    const space =
      itemsArr[1].getBoundingClientRect().top -
      itemsArr[0].getBoundingClientRect().bottom;
    dragItem.style.position = 'absolute';
    dragItem.style.width = dragBoundingRect.width + 'px';
    dragItem.style.cursor = 'grabbing';
    dragItem.style.height = dragBoundingRect.height + 'px';
    dragItem.style.top = `${dragBoundingRect.top}px`;
    dragItem.style.left = `${dragBoundingRect.left}px`;
    dragItem.style.zIndex = '5000';

    const div1 = document.createElement('div');
    div1.id = 'div-temp';
    div1.style.width = dragBoundingRect.width + 'px';
    div1.style.pointerEvents = 'none';
    div1.style.height = dragBoundingRect.height + 'px';
    container!.appendChild(div1);

    const distance = dragBoundingRect.height + space;

    itemsBelowDragItem.forEach((item) => {
      item.style.transform = `translateY(${distance}px)`;
    });

    const dragMove = (e: PointerEvent) => {
      let posX = e.clientX - x;
      let posY = e.clientY - y;
      dragItem.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;

      notDragItems.forEach(item => {
        const rect1 = dragItem.getBoundingClientRect();
        const rect2 = item.getBoundingClientRect();
        let isOverlapping = rect1.y < rect2.y + (rect2.height / 2) && rect1.y + (rect1.height / 2) > rect2.y;
        if (isOverlapping) {
          if (item.getAttribute('style')) {
            item.style.transform = '';
            index++;
          } else {
            item.style.transform = `translateY(${distance}px)`;
            index--;
          }
        }
      });
      newData = data.filter(item => item.id !== dragData.id);
      newData.splice(index, 0, dragData);
    };

    document.onpointermove = dragMove;

    const dragEnd = () => {
      setIsDragging(-1);
      dragItem.style.transform = ""; 
      dragItem.style.cursor = 'pointer'; 
      dragItem.style.width = '';
      dragItem.style.height = '';
      dragItem.style.top = '';
      dragItem.style.left = '';
      document.onpointermove = null;
      document.onpointerup = null;
      container!.removeChild(div1);
      itemsArr.forEach((item) => { 
        item.style.transform = '';
      });
      setData(newData);
    };
    document.onpointerup = dragEnd;

    draggingItem.current = index;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="blurFilter border-0 rounded-md p-2 shadow-2xl w-[90%] max-w-[850px] h-full max-h-[85%] md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70">
        <div className="w-full h-full flex flex-col justify-center items-center border rounded-md border-lightMainColor dark:border-darkMainColor relative p-2 overflow-y-auto">
          <div ref={containerRef} className="bg-blue-500 relative">
            {data.map((item, index) => (
              <div
                key={item.id}
                data-index={index}
                onPointerDown={(e) => handlePointerDown(e, index)}
                className={`m-2 ${isDragging === index ? 'dragging' : ''}`}
                style={{ touchAction: 'none', backgroundColor: 'red' }}
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
