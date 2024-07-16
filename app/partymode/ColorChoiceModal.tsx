'use client';

import AnimateModalLayout from '@/components/AnimateModalLayout';
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
    <AnimateModalLayout
      visibility={vis}
      onReturn={() => {
        onClose(true);
      }}
    > 
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[1170px]  flex justify-center items-center flex-col   md:w-[80svw] bg-lightMainBG dark:bg-darkMainBG h-[70svh] md:h-[85svh]
        }`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative  p-1  overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
        >
          <div
            id="containedDiv"
            className={`absolute top-0 left-0 flex flex-col w-full p-1 justify-center items-center`}
          > 
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="w-full h-24 mb-4"
          /> 
        </div>
        <div className="mt-4 w-full flex justify-center">
          <div
            className="w-16 h-16 rounded-full border-2 border-gray-300"
            style={{ backgroundColor: color }}
          ></div>
        </div>
      </div>
    </div>
    </AnimateModalLayout>
  );
};

export default ColorChoiceModal;