'use client';

import React, { useState, useEffect } from 'react';

interface ColorChoiceModalProps {
  vis: boolean;
  onSelectColor: (color: string) => void;
  onClose: (value: boolean) => void;
}

const ColorChoiceModal: React.FC<ColorChoiceModalProps> = ({
  vis,
  onSelectColor,
  onClose,
}) => {
  const [color, setColor] = useState('#ff0000');

  useEffect(() => {
    if (vis) {
      setColor('#ff0000'); // Reset color when modal opens
    }
  }, [vis]);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setColor(newColor);
    onSelectColor(newColor);
  };

  if (!vis) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white w-11/12 max-w-2xl h-3/5 rounded-md shadow-lg flex flex-col items-center justify-between p-6">
        <div className="w-full max-w-md flex flex-col items-center">
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="w-full h-48 mb-4"
          />
          <input
            type="text"
            value={color}
            onChange={handleColorChange}
            className="mt-4 p-2 border rounded w-full text-center"
          />
        </div>
        <div className="mt-4 w-full flex justify-center">
          <div
            className="w-16 h-16 rounded-full border-2 border-gray-300"
            style={{ backgroundColor: color }}
          ></div>
        </div>
        <button
          onClick={() => onClose(true)}
          className="mt-6 px-4 py-2 bg-purple-800 text-white rounded hover:bg-purple-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ColorChoiceModal;