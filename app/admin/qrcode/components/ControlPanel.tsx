import React from 'react';
import type { QrOptions } from '../types';
import { FRAMES, FONTS } from '../constants';

interface ControlPanelProps {
  options: QrOptions;
  setOptions: React.Dispatch<React.SetStateAction<QrOptions>>;
}

const DOT_STYLES = [
    { id: 'square', name: 'Square' },
    { id: 'rounded', name: 'Rounded' },
    { id: 'dots', name: 'Dots' },
    { id: 'classy', name: 'Classy' },
    { id: 'classy-rounded', name: 'Classy Rounded' },
    { id: 'extra-rounded', name: 'Extra Rounded' },
];

const UploadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const ColorPicker: React.FC<{ label: string; color: string; onColorChange: (color: string) => void; opacity: number; onOpacityChange: (opacity: number) => void; }> = ({ label, color, onColorChange, opacity, onOpacityChange }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-300">{label}</label>
    <div className="flex items-center gap-4">
      <input
        type="color"
        value={color}
        onChange={(e) => onColorChange(e.target.value)}
        className="w-12 h-12 p-1 bg-gray-700 border-gray-600 rounded-md cursor-pointer"
      />
      <div className="w-full">
        <label className="text-xs text-gray-400">Opacity: {Math.round(opacity * 100)}%</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={opacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg accent-purple-500"
        />
      </div>
    </div>
  </div>
);

const SimpleColorPicker: React.FC<{ label: string; color: string; onColorChange: (color: string) => void; }> = ({ label, color, onColorChange }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-12 h-12 p-1 bg-gray-700 border-gray-600 rounded-md cursor-pointer"
        />
         <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">#</span>
            <input
            type="text"
            value={color.substring(1)}
            onChange={(e) => {
                const hex = e.target.value.replace(/[^0-9a-fA-F]/g, '');
                onColorChange(`#${hex.slice(0, 6)}`);
            }}
            maxLength={6}
            className="w-full pl-7 bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-purple-500 focus:border-purple-500 transition"
            />
        </div>
      </div>
    </div>
);


const ControlPanel: React.FC<ControlPanelProps> = ({ options, setOptions }) => {

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOptions(prev => ({ ...prev, logo: event.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  const parseRgba = (rgba: string) => {
      if (!rgba || !rgba.startsWith('rgba')) {
          if (rgba.startsWith('#') && rgba.length === 9) { // hex with alpha
              const alphaHex = rgba.slice(7, 9);
              const alpha = parseInt(alphaHex, 16) / 255;
              return { color: rgba.slice(0, 7), opacity: alpha };
          }
          if (rgba.startsWith('#')) {
              return { color: rgba, opacity: 1 };
          }
          return { color: '#000000', opacity: 0 };
      }

      const parts = rgba.substring(rgba.indexOf('(') + 1, rgba.lastIndexOf(')')).split(',');
      const r = parseInt(parts[0], 10);
      const g = parseInt(parts[1], 10);
      const b = parseInt(parts[2], 10);
      const a = parseFloat(parts[3]);

      const toHex = (c: number) => ('0' + c.toString(16)).slice(-2);

      return {
          color: `#${toHex(r)}${toHex(g)}${toHex(b)}`,
          opacity: a
      };
  };

  const handlePositionChange = (position: 'center' | 'background') => {
    if (position === 'background') {
      const { color: bgHex } = parseRgba(options.backgroundColor);
      setOptions(prev => ({ 
        ...prev, 
        logoPosition: position, 
        backgroundColor: hexToRgba(bgHex, 0) // Make background transparent
      }));
    } else {
      setOptions(prev => ({ ...prev, logoPosition: position }));
    }
  };
  
  const { color: dotsHex, opacity: dotsAlpha } = parseRgba(options.dotsColor);
  const { color: bgHex, opacity: bgAlpha } = parseRgba(options.backgroundColor);
  const hasTextFrame = ['modern-scan', 'digital-scan'].includes(options.frameId);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-lg space-y-6">
      <div>
        <label htmlFor="data-input" className="block text-sm font-medium text-gray-300 mb-2">
          URL or Text
        </label>
        <input
          id="data-input"
          type="text"
          value={options.data}
          onChange={(e) => setOptions(prev => ({ ...prev, data: e.target.value }))}
          placeholder="Enter data for QR code"
          className="w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-purple-500 focus:border-purple-500 transition"
        />
      </div>

      <ColorPicker
          label="Dot Color"
          color={dotsHex}
          onColorChange={(hex) => setOptions(prev => ({ ...prev, dotsColor: hexToRgba(hex, dotsAlpha) }))}
          opacity={dotsAlpha}
          onOpacityChange={(alpha) => setOptions(prev => ({ ...prev, dotsColor: hexToRgba(dotsHex, alpha) }))}
      />

      <div>
        <label htmlFor="dot-style-select" className="block text-sm font-medium text-gray-300 mb-2">
            Dot Style
        </label>
        <select
            id="dot-style-select"
            value={options.dotsType}
            onChange={(e) => setOptions(prev => ({ ...prev, dotsType: e.target.value }))}
            className="w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-purple-500 focus:border-purple-500 transition"
        >
            {DOT_STYLES.map(style => (
                <option key={style.id} value={style.id}>
                    {style.name}
                </option>
            ))}
        </select>
      </div>
      
      <ColorPicker
          label="Background Color"
          color={bgHex}
          onColorChange={(hex) => setOptions(prev => ({ ...prev, backgroundColor: hexToRgba(hex, bgAlpha) }))}
          opacity={bgAlpha}
          onOpacityChange={(alpha) => setOptions(prev => ({ ...prev, backgroundColor: hexToRgba(bgHex, alpha) }))}
      />

      {options.frameId !== 'none' && (
        <SimpleColorPicker
            label="Frame Color"
            color={options.frameColor}
            onColorChange={(color) => setOptions(prev => ({...prev, frameColor: color}))}
        />
      )}

      {hasTextFrame && (
        <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Frame Text Options</h3>
            <div>
                <label htmlFor="frame-text-input" className="block text-xs font-medium text-gray-400 mb-1">
                    Text
                </label>
                <input
                    id="frame-text-input"
                    type="text"
                    value={options.frameText}
                    onChange={(e) => setOptions(prev => ({ ...prev, frameText: e.target.value }))}
                    maxLength={20}
                    className="w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-purple-500 focus:border-purple-500 transition"
                />
            </div>
             <div>
                <label htmlFor="frame-font-select" className="block text-xs font-medium text-gray-400 mb-1">
                   Font
                </label>
                <select
                    id="frame-font-select"
                    value={options.frameFont}
                    onChange={(e) => setOptions(prev => ({ ...prev, frameFont: e.target.value }))}
                    className="w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-purple-500 focus:border-purple-500 transition"
                >
                    {FONTS.map(font => (
                        <option key={font} value={font} style={{fontFamily: font}}>
                            {font.charAt(0).toUpperCase() + font.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
            <div className="space-y-2">
              <SimpleColorPicker
                  label="Text Color"
                  color={options.frameTextColor}
                  onColorChange={(color) => setOptions(prev => ({...prev, frameTextColor: color}))}
              />
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                    Text Size
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.01"
                        value={options.frameTextSize}
                        onChange={(e) => setOptions(prev => ({ ...prev, frameTextSize: parseFloat(e.target.value) }))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg accent-purple-500"
                    />
                    <span className="text-sm text-gray-300 w-12 text-right">{Math.round(options.frameTextSize * 100)}%</span>
                </div>
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                    Text Vertical Offset
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="-10"
                        max="10"
                        step="0.5"
                        value={options.frameTextY}
                        onChange={(e) => setOptions(prev => ({ ...prev, frameTextY: parseFloat(e.target.value) }))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg accent-purple-500"
                    />
                    <span className="text-sm text-gray-300 w-12 text-right">{options.frameTextY.toFixed(1)}</span>
                </div>
            </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Logo</label>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition inline-flex items-center justify-center">
              <UploadIcon />
              <span>{options.logo ? 'Change Logo' : 'Upload Logo'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </label>
            {options.logo && (
              <button onClick={() => setOptions(prev => ({...prev, logo: null, logoSize: 0.4, logoPosition: 'center'}))} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition">
                  Remove
              </button>
            )}
          </div>
          {options.logo && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Logo Position</label>
                <div className="flex rounded-md shadow-sm bg-gray-700">
                  <button type="button" onClick={() => handlePositionChange('center')} className={`relative inline-flex items-center justify-center w-1/2 px-4 py-2 rounded-l-md text-sm font-medium ${options.logoPosition === 'center' ? 'bg-purple-500 text-white' : 'text-gray-300 hover:bg-gray-600'} transition-colors`}>
                    Center
                  </button>
                  <button type="button" onClick={() => handlePositionChange('background')} className={`relative -ml-px inline-flex items-center justify-center w-1/2 px-4 py-2 rounded-r-md text-sm font-medium ${options.logoPosition === 'background' ? 'bg-purple-500 text-white' : 'text-gray-300 hover:bg-gray-600'} transition-colors`}>
                    Background
                  </button>
                </div>
              </div>

              {options.logoPosition === 'center' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Logo Size</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0.1"
                      max="0.5"
                      step="0.01"
                      value={options.logoSize}
                      onChange={(e) => setOptions(prev => ({ ...prev, logoSize: parseFloat(e.target.value) }))}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg accent-purple-500"
                    />
                    <span className="text-sm text-gray-300 w-12 text-right">{Math.round(options.logoSize * 100)}%</span>
                  </div>
                </div>
              )}
               {options.logoPosition === 'background' && (
                  <p className="text-xs text-gray-400">Tip: Use a high contrast dot color for better scannability.</p>
               )}
            </>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Frame Style</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {FRAMES.map(frame => (
            <button
              key={frame.id}
              onClick={() => setOptions(prev => ({...prev, frameId: frame.id}))}
              className={`p-2 rounded-md transition border-2 ${options.frameId === frame.id ? 'bg-purple-500 border-purple-400' : 'bg-gray-700 border-gray-600 hover:border-gray-500'}`}
              title={frame.name}
            >
                <div className="aspect-square flex items-center justify-center">
                  {frame.id === 'none' ? <span className="text-xs">None</span> : <frame.component className="w-full h-full text-white"/>}
                </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;