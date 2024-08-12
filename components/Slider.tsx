import { SettingsContext } from '@/hooks/useSettings';
import { ScreenSettingsContextType } from '@/types/screen-settings';
import React, { useState, useEffect, useRef, useContext } from 'react';

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  width?: string;
  height?: string;
  trackColor?: string;
  thumbColor?: string;
  thumbSize?: number;
  label?: string;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step,
  value,
  onChange,
  width = '100%',
  height = '10px',
  trackColor = '#e0e0e0',
  thumbColor = '#3b82f6',
  thumbSize =25,
  label
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;
  const { darkMode } = useContext(
    SettingsContext
  ) as ScreenSettingsContextType;
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateValue(event.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      updateValue(event.clientX);
    }
  };

  const updateValue = (clientX: number) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const position = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, position / rect.width));
      const newValue = Math.round((percentage * (max - min) + min) / step) * step;
      onChange(newValue);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col">
      {label && <label className="mb-2 text-sm font-medium">{label}</label>}
      <div
        ref={sliderRef}
        className="relative cursor-pointer"
        style={{ width, height }}
        onMouseDown={handleMouseDown}
      >
        <div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ backgroundColor: trackColor, width: '100%' }}
        />
        <div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ backgroundColor: thumbColor, width: `${percentage}%` }}
        />
        <div
          className="absolute top-1/2 rounded-full"
          style={{
            width: `${thumbSize}px`,
            height: `${thumbSize}px`,
            backgroundColor: thumbColor,
            transform: `translate(-50%, -50%)`,
            left: `${percentage}%`,
          }}
        />
      </div>
      {/* <div className="mt-2 text-sm">{value}</div> */}
    </div>
  );
};

export default Slider;