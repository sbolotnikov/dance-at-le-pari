import React, { useState, useEffect, useRef } from 'react';
import { GOOGLE_FONTS } from '../constants';

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelect = (font: string) => {
    onChange(font);
    setIsOpen(false);
  };

  const safeFontFamily = (font: string) => {
    // Add fallback fonts
    if (['Arial', 'Verdana'].includes(font)) return `${font}, sans-serif`;
    if (['Georgia', 'Times New Roman'].includes(font)) return `${font}, serif`;
    if (['Courier New'].includes(font)) return `${font}, monospace`;
    return `${font}, sans-serif`;
  }

  return (
    <div className="relative w-1/2" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-1 border border-slate-300 rounded-md text-sm text-left truncate"
        style={{ fontFamily: safeFontFamily(value) }}
      >
        {value}
      </button>
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-slate-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
          {GOOGLE_FONTS.map(font => (
            <li
              key={font}
              onClick={() => handleSelect(font)}
              className="p-2 text-sm hover:bg-slate-100 cursor-pointer"
              style={{ fontFamily: safeFontFamily(font) }}
            >
              {font}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FontSelector;