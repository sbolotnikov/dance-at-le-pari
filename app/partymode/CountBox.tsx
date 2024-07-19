'use client';

import React, { useState } from 'react';
 

interface CountBoxProps {
  startValue: number;
  setWidth: number;
  onChange: (value: number) => void;
}

const CountBox: React.FC<CountBoxProps> = ({ startValue, setWidth, onChange }) => {
 
  const changeNumber = (isAdd: boolean) => {
    const increment = isAdd ? 1 : startValue > 0 ? -1 : 0;
    const newValue = startValue + increment;
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) { 
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-row justify-center items-center ml-2">
      <button
        className="rounded-full bg-[#3D1152] mr-1 w-8 h-8 flex items-center justify-center text-white text-xl font-extrabold hover:bg-[#2A0B3A] transition-colors"
        onClick={() => changeNumber(false)}
      >
        -
      </button>
      <input
        type="text"
        className={`h-8 w-${setWidth} text-center border border-gray-300 rounded`}
        onBlur={handleInputChange}
        defaultValue={startValue}
      />
      <button
        className="rounded-full bg-[#3D1152] ml-1 w-8 h-8 flex items-center justify-center text-white text-xl font-extrabold hover:bg-[#2A0B3A] transition-colors"
        onClick={() => changeNumber(true)}
      >
        +
      </button>
    </div>
  );
};

export default CountBox;