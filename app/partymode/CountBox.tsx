'use client';

import React, { useState } from 'react';

interface CountBoxProps {
  startValue: number;
  setWidth: number;
  onChange: (value: number) => void;
}

const CountBox: React.FC<CountBoxProps> = ({ startValue, setWidth, onChange }) => {
  const [number, setNumber] = useState(startValue);

  const changeNumber = (isAdd: boolean) => {
    const increment = isAdd ? 1 : number > 0 ? -1 : 0;
    const newValue = number + increment;
    setNumber(newValue);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      setNumber(newValue);
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-row justify-center items-center ml-2">
      <button
        className="rounded-full bg-[#3D1152] mr-2 w-8 h-8 flex items-center justify-center text-white text-xl font-extrabold hover:bg-[#2A0B3A] transition-colors"
        onClick={() => changeNumber(false)}
      >
        -
      </button>
      <input
        type="number"
        className={`h-8 w-${setWidth} text-center border border-gray-300 rounded`}
        onChange={handleInputChange}
        value={number}
      />
      <button
        className="rounded-full bg-[#3D1152] ml-2 w-8 h-8 flex items-center justify-center text-white text-xl font-extrabold hover:bg-[#2A0B3A] transition-colors"
        onClick={() => changeNumber(true)}
      >
        +
      </button>
    </div>
  );
};

export default CountBox;