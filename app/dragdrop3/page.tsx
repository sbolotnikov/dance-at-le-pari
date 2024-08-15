'use client';
import React, { useState, useRef } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const Page: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: '1 Learn React', completed: false },
    { id: 2, text: '2 Build a project', completed: false },
    { id: 3, text: '3 Deploy to production', completed: false },
    { id: 4, text: '4 Learn React', completed: false },
    { id: 5, text: '5 Build a project', completed: false },
    { id: 6, text: '6 Deploy to production', completed: false },
  ]); 
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const dragItem = useRef<HTMLLIElement | null>(null);
  const dragOverItem = useRef<HTMLLIElement | null>(null);

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    id: number
  ) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return; // Only primary button for mouse
    setDraggingId(id);
    dragItem.current = e.currentTarget as unknown as HTMLLIElement;
    dragItem.current.style.opacity = '0.5';
    dragItem.current.style.cursor = 'grabbing';
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingId) return;
    const container = e.currentTarget.parentElement;
    if (!container) return;

    const items = Array.from(container.children) as HTMLLIElement[];
    const dragItemRect = dragItem.current!.getBoundingClientRect();
    const dragItemIndex = items.indexOf(dragItem.current!);

    items.forEach((item, index) => {
      if (item === dragItem.current) return;

      const rect = item.getBoundingClientRect();
      const isAfter = index > dragItemIndex;

      if (
        (isAfter && e.clientY > rect.top) ||
        (!isAfter && e.clientY < rect.bottom)
      ) {
        if (dragOverItem.current !== item) {
          dragOverItem.current = item;
          items.forEach((i) => (i.style.transform = ''));
          const shift = isAfter ? -dragItemRect.height : dragItemRect.height;
          item.style.transform = `translateY(${shift}px)`;
        }
      }
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingId || !dragItem.current || !dragOverItem.current) return;

    const items = Array.from(
      e.currentTarget.parentElement!.children
    ) as HTMLLIElement[];
    const fromIndex = items.indexOf(dragItem.current);
    const toIndex = items.indexOf(dragOverItem.current);

    const newTodos = [...todos];
    const [movedItem] = newTodos.splice(fromIndex, 1);
    newTodos.splice(toIndex, 0, movedItem);

    setTodos(newTodos);
    setDraggingId(null);
    dragItem.current.style.opacity = '1';
    dragItem.current.style.cursor = 'grab';
    items.forEach((item) => (item.style.transform = ''));
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="blurFilter border-0 rounded-md p-2 shadow-2xl w-[90%] max-w-[850px] h-full max-h-[85%] md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70">
        <div className="w-full h-full flex flex-col justify-center items-center border rounded-md border-lightMainColor dark:border-darkMainColor relative p-2 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">To-Do List</h1>

          <div>
            {todos.map((todo) => (
              <div
                key={todo.id}
                onPointerDown={(e) => handlePointerDown(e, todo.id)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={`flex items-center justify-between p-2 mb-2 border rounded   cursor-grab animate-fade-in`}
                style={{ touchAction: 'none' }}
              >
                <span className={`flex-grow `}>{todo.text}</span>
                <div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
