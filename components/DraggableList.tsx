import React, { useState } from 'react';

interface DraggableListProps {
  initialItems: string[];
}

const DraggableList: React.FC<DraggableListProps> = ({ initialItems }) => {
  const [items, setItems] = useState<string[]>(initialItems);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const onDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    setDraggedItem(items[index]);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
    e.currentTarget.classList.add('bg-gray-100');
  };

  const onDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDragEnter = (e: React.DragEvent<HTMLLIElement>) => {
    e.currentTarget.classList.add('bg-yellow-100');
  };

  const onDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
    e.currentTarget.classList.remove('bg-yellow-100');
  };

  const onDrop = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-yellow-100');
    
    if (draggedItem) {
      const newItems = items.filter(item => item !== draggedItem);
      newItems.splice(index, 0, draggedItem);
      setItems(newItems);
      setDraggedItem(null);
    }
  };

  const onDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    e.currentTarget.classList.remove('bg-gray-100');
  };

  return (
    <ul className="w-full max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden">
      {items.map((item, index) => (
        <li
          key={item}
          draggable
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, index)}
          onDragEnd={onDragEnd}
          className="px-4 py-3 border-b last:border-b-0 cursor-move hover:bg-gray-50 transition-colors duration-150 ease-in-out"
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

export default DraggableList;