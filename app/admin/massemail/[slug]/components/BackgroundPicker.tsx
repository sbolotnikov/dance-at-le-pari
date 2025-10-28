import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TrashIcon } from './icons';

type BackgroundType = 'solid' | 'linear-gradient' | 'radial-gradient' | 'pattern';
type GradientStop = {
  id: number;
  color: string;
  position: number;
};

interface BackgroundPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const PRESET_CATEGORIES = ['All', 'Simple', 'Gradient', 'Pattern'] as const;
type PresetCategory = typeof PRESET_CATEGORIES[number];

type Preset = {
  name: string;
  value: string;
  category: Exclude<PresetCategory, 'All'>;
};

const PRESETS: Preset[] = [
  // Simple
  { name: 'Plain White', value: '#ffffff', category: 'Simple' },
  { name: 'Light Slate', value: '#f1f5f9', category: 'Simple' },
  { name: 'Deep Space', value: '#1f2937', category: 'Simple' },

  // Gradients
  { name: 'Soft Sky', value: 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 100%)', category: 'Gradient' },
  { name: 'Gentle Dawn', value: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', category: 'Gradient' },
  { name: 'Mint Mist', value: 'linear-gradient(to right, #f0fdf4, #dcfce7)', category: 'Gradient' },
  { name: 'Lavender Bliss', value: 'linear-gradient(to bottom right, #f5f3ff, #ede9fe)', category: 'Gradient' },
  { name: 'Faded Denim', value: 'linear-gradient(180deg, #dbeafe 0%, #bfdbfe 100%)', category: 'Gradient' },
  { name: 'Rose Gold', value: 'linear-gradient(90deg, #fdf2f8 0%, #fce7f3 100%)', category: 'Gradient' },
  { name: 'Ocean Wave', value: 'linear-gradient(45deg, #cffafe 0%, #a5f3fc 100%)', category: 'Gradient' },
  { name: 'Sunbeam', value: 'linear-gradient(180deg, #fef9c3 0%, #fef08a 100%)', category: 'Gradient' },
  { name: 'Royal Indigo', value: 'linear-gradient(to right, #4f46e5, #818cf8)', category: 'Gradient' },
  { name: 'Sunset', value: 'linear-gradient(to right, #f97316, #fde047)', category: 'Gradient' },
  { name: 'Radial Sun', value: 'radial-gradient(circle at center, #fef08a, #f97316)', category: 'Gradient' },
  
  // Patterns
  { name: 'Subtle Stripes', value: 'repeating-linear-gradient(45deg, #f8fafc, #f8fafc 10px, #f1f5f9 10px, #f1f5f9 20px)', category: 'Pattern' },
  { name: 'Diagonal Lines', value: 'repeating-linear-gradient(-45deg, #e5e7eb, #e5e7eb 5px, #f3f4f6 5px, #f3f4f6 10px)', category: 'Pattern' },
  { name: 'Blueprint Grid', value: 'repeating-linear-gradient(0deg, #dbeafe, #dbeafe 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #dbeafe, #dbeafe 1px, transparent 1px, transparent 20px)', category: 'Pattern' },
];

const RADIAL_POSITIONS = ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'];


// Helper to check if a string is a valid color
const isColor = (strColor: string): boolean => {
  if (!strColor || typeof strColor !== 'string') return false;
  // This is a robust way to check for valid color strings, including hex, rgb, hsl, names, etc.
  const s = new Option().style;
  s.color = strColor;
  return s.color !== '';
};

const parseColorStops = (parts: string[]): GradientStop[] => {
    let stops: { id: number; color: string; position: number | null }[] = parts.map((part, index) => {
        const stopMatch = part.match(/^(.*?)\s+([\d.]+)%$/);
        let color: string;
        let position: number | null = null;

        if (stopMatch && isColor(stopMatch[1].trim())) {
            color = stopMatch[1].trim();
            position = parseFloat(stopMatch[2]);
        } else if (isColor(part)) {
            color = part.trim();
        } else {
            return null; // Invalid color stop
        }
        return { id: Date.now() + index, color, position };
    }).filter(s => s !== null) as { id: number; color: string; position: number | null }[];
    
    if (stops.length < parts.length) return []; // Some parts failed to parse
    
    // Distribute positions if they are missing
    if (stops.length > 0) {
        if (stops[0].position === null) stops[0].position = 0;
        if (stops[stops.length - 1].position === null) stops[stops.length - 1].position = 100;
        
        let lastDefinedIndex = 0;
        for (let i = 1; i < stops.length; i++) {
            if (stops[i].position !== null) {
                const prevPosition = stops[lastDefinedIndex].position!;
                const currPosition = stops[i].position!;
                const numUndefined = i - lastDefinedIndex - 1;
                if (numUndefined > 0) {
                    const step = (currPosition - prevPosition) / (numUndefined + 1);
                    for (let j = 1; j <= numUndefined; j++) {
                        stops[lastDefinedIndex + j].position = prevPosition + j * step;
                    }
                }
                lastDefinedIndex = i;
            }
        }
    }
    return stops as GradientStop[];
};

const parseLinearGradient = (value: string): { angle: number; stops: GradientStop[] } | null => {
    if (!value || !value.includes('linear-gradient')) return null;
    const gradientMatch = value.match(/linear-gradient\(([^)]+)\)/);
    if (!gradientMatch) return null;

    try {
        const content = gradientMatch[1];
        const parts = content.split(/,(?![^(]*\))/).map(p => p.trim());
        let angle = 180;
        let colorStopParts = parts;
        const firstPartIsAngle = parts[0].match(/^(-?[\d.]+)deg$/);

        if (firstPartIsAngle) {
            angle = parseFloat(firstPartIsAngle[1]);
            colorStopParts = parts.slice(1);
        }

        const stops = parseColorStops(colorStopParts);
        return stops.length > 0 ? { angle, stops } : null;
    } catch (e) { return null; }
};

const parseRadialGradient = (value: string): { shape: 'circle' | 'ellipse'; position: string; stops: GradientStop[] } | null => {
    if (!value || !value.includes('radial-gradient')) return null;
    const gradientMatch = value.match(/radial-gradient\(([^)]+)\)/);
    if (!gradientMatch) return null;

    try {
        const content = gradientMatch[1];
        const parts = content.split(/,(?![^(]*\))/).map(p => p.trim());
        let shape: 'circle' | 'ellipse' = 'circle';
        let position = 'center';
        let colorStopParts = parts;

        const firstPart = parts[0];
        if (!isColor(firstPart.split(' ')[0])) {
            colorStopParts = parts.slice(1);
            const definitionParts = firstPart.split(' at ');
            const shapePart = definitionParts[0].trim();
            if (shapePart === 'circle' || shapePart === 'ellipse') {
                shape = shapePart;
            }
            if (definitionParts.length > 1) {
                position = definitionParts[1].trim();
            }
        }

        const stops = parseColorStops(colorStopParts);
        return stops.length > 0 ? { shape, position, stops } : null;
    } catch (e) { return null; }
};


const BackgroundPicker: React.FC<BackgroundPickerProps> = ({ value, onChange }) => {
  const [mainTab, setMainTab] = useState<'custom' | 'presets'>('custom');
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('solid');
  const [solidColor, setSolidColor] = useState('#ffffff');
  const [gradientAngle, setGradientAngle] = useState(180);
  const [gradientStops, setGradientStops] = useState<GradientStop[]>([]);
  const [radialShape, setRadialShape] = useState<'circle' | 'ellipse'>('circle');
  const [radialPosition, setRadialPosition] = useState('center');
  const [customPattern, setCustomPattern] = useState('');
  const [activePresetCategory, setActivePresetCategory] = useState<PresetCategory>('All');
  const isUpdatingFromProps = useRef(false);

  useEffect(() => {
    isUpdatingFromProps.current = true;
    const radial = parseRadialGradient(value);
    const linear = parseLinearGradient(value);

    if (radial) {
        setBackgroundType('radial-gradient');
        setRadialShape(radial.shape);
        setRadialPosition(radial.position);
        setGradientStops(radial.stops);
    } else if (linear) {
        setBackgroundType('linear-gradient');
        setGradientAngle(linear.angle);
        setGradientStops(linear.stops);
    } else if (isColor(value)) {
        setBackgroundType('solid');
        setSolidColor(value);
    } else {
        // Not a color or simple gradient, treat as a pattern/custom CSS
        setBackgroundType('pattern');
        setCustomPattern(value);
    }
    
    // Let state updates settle before allowing changes to propagate up
    const timer = setTimeout(() => { isUpdatingFromProps.current = false; }, 0);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    if (isUpdatingFromProps.current) return;
    
    let newValue = '';
    if (backgroundType === 'solid') {
      newValue = solidColor;
    } else if (backgroundType === 'pattern') {
        newValue = customPattern;
    } else {
      if (gradientStops.length < 2) return;
      const sortedStops = [...gradientStops].sort((a, b) => a.position - b.position);
      const stopsStr = sortedStops.map(s => `${s.color} ${s.position.toFixed(0)}%`).join(', ');
      if (backgroundType === 'linear-gradient') {
        newValue = `linear-gradient(${gradientAngle}deg, ${stopsStr})`;
      } else { // radial-gradient
        newValue = `radial-gradient(${radialShape} at ${radialPosition}, ${stopsStr})`;
      }
    }

    if (newValue !== value) {
        onChange(newValue);
    }
  }, [backgroundType, solidColor, gradientAngle, gradientStops, radialShape, radialPosition, customPattern, onChange, value]);

  const handleStopChange = (id: number, field: 'color' | 'position', val: string | number) => {
    setGradientStops(stops =>
      stops.map(stop => (stop.id === id ? { ...stop, [field]: val } : stop))
    );
  };

  const addStop = () => {
    const newStop: GradientStop = { id: Date.now(), color: '#000000', position: 100 };
    setGradientStops(stops => [...stops, newStop]);
  };

  const removeStop = (id: number) => {
    if (gradientStops.length <= 2) return;
    setGradientStops(stops => stops.filter(stop => stop.id !== id));
  };
  
  const gradientPreview = useMemo(() => {
    if (backgroundType === 'solid' || gradientStops.length < 2) return solidColor;
    const sortedStops = [...gradientStops].sort((a, b) => a.position - b.position);
    const stopsStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');
    if (backgroundType === 'linear-gradient') {
      return `linear-gradient(${gradientAngle}deg, ${stopsStr})`;
    }
    return `radial-gradient(${radialShape} at ${radialPosition}, ${stopsStr})`;
  }, [backgroundType, solidColor, gradientAngle, gradientStops, radialShape, radialPosition]);

  const filteredPresets = useMemo(() => {
    if (activePresetCategory === 'All') return PRESETS;
    return PRESETS.filter(p => p.category === activePresetCategory);
  }, [activePresetCategory]);

  return (
    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-sm">
      <div className="flex items-center bg-slate-200 rounded-md p-0.5 mb-2">
        {(['custom', 'presets'] as const).map(tab => (
          <button key={tab} onClick={() => setMainTab(tab)} className={`flex-1 text-xs capitalize py-1 rounded-md transition-colors ${mainTab === tab ? 'bg-white shadow-sm text-slate-800 font-semibold' : 'text-slate-500 hover:bg-slate-100'}`}>
            {tab}
          </button>
        ))}
      </div>

      {mainTab === 'custom' && (
        <div>
          <div className="flex items-center bg-slate-200 rounded-md p-0.5 mb-2">
            {(['solid', 'linear-gradient', 'radial-gradient', 'pattern'] as BackgroundType[]).map(type => (
              <button key={type} onClick={() => setBackgroundType(type)} className={`flex-1 text-xs capitalize py-1 rounded-md transition-colors ${backgroundType === type ? 'bg-white shadow-sm text-slate-800 font-semibold' : 'text-slate-500 hover:bg-slate-100'}`}>
                {type === 'pattern' ? 'Custom' : type.replace('-gradient', '')}
              </button>
            ))}
          </div>

          {backgroundType === 'solid' && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Color</span>
              <div className="flex items-center gap-2">
                <input type="text" value={solidColor} onChange={e => setSolidColor(e.target.value)} className="p-1 border border-slate-300 rounded-md text-sm w-24" />
                <input type="color" value={solidColor} onChange={e => setSolidColor(e.target.value)} className="w-8 h-7 p-0.5 border border-slate-300 rounded" />
              </div>
            </div>
          )}

          {backgroundType === 'pattern' && (
            <div className="space-y-2">
                <div className="h-8 w-full rounded border border-slate-300" style={{ background: customPattern || 'transparent' }}></div>
                <label className="text-slate-500 text-xs block">Paste CSS `background` value</label>
                <textarea
                    value={customPattern}
                    onChange={e => setCustomPattern(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md text-sm font-mono"
                    rows={3}
                    placeholder="e.g., url(https://...) or repeating-linear-gradient(...)"
                />
            </div>
          )}

          {backgroundType === 'linear-gradient' && (
            <div className="space-y-3">
                <div className="h-8 w-full rounded border border-slate-300" style={{ background: gradientPreview }}></div>
                <div className="flex items-center justify-between">
                    <label className="text-slate-500">Angle</label>
                    <div className="flex items-center gap-2">
                        <input type="range" min="0" max="360" value={gradientAngle} onChange={e => setGradientAngle(parseInt(e.target.value, 10))} className="w-24" />
                        <input type="number" value={gradientAngle} onChange={e => setGradientAngle(parseInt(e.target.value, 10))} className="p-1 border border-slate-300 rounded-md text-sm w-16" />
                    </div>
                </div>
            </div>
          )}

          {backgroundType === 'radial-gradient' && (
             <div className="space-y-3">
                <div className="h-8 w-full rounded border border-slate-300" style={{ background: gradientPreview }}></div>
                <div className="flex items-center justify-between">
                    <label className="text-slate-500">Shape</label>
                    <select value={radialShape} onChange={e => setRadialShape(e.target.value as any)} className="p-1 border border-slate-300 rounded-md text-sm w-36">
                        <option value="circle">Circle</option>
                        <option value="ellipse">Ellipse</option>
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <label className="text-slate-500">Position</label>
                    <select value={radialPosition} onChange={e => setRadialPosition(e.target.value)} className="p-1 border border-slate-300 rounded-md text-sm w-36 capitalize">
                        {RADIAL_POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>
          )}
          
          {(backgroundType === 'linear-gradient' || backgroundType === 'radial-gradient') && (
            <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                <label className="text-slate-500 block">Color Stops</label>
                {gradientStops.map(stop => (
                    <div key={stop.id} className="flex items-center gap-2">
                        <input type="color" value={stop.color} onChange={e => handleStopChange(stop.id, 'color', e.target.value)} className="w-8 h-7 p-0.5 border border-slate-300 rounded" />
                        <input type="range" min="0" max="100" value={stop.position} onChange={e => handleStopChange(stop.id, 'position', parseInt(e.target.value, 10))} className="flex-1" />
                        <input type="number" min="0" max="100" value={Math.round(stop.position)} onChange={e => handleStopChange(stop.id, 'position', parseInt(e.target.value, 10))} className="p-1 border border-slate-300 rounded-md text-sm w-16" />
                        <button onClick={() => removeStop(stop.id)} className="text-red-500 hover:text-red-700 disabled:opacity-50" disabled={gradientStops.length <= 2}>
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                 <button onClick={addStop} className="w-full mt-2 py-1 text-xs text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
                    + Add Color Stop
                </button>
            </div>
          )}
        </div>
      )}

      {mainTab === 'presets' && (
        <div>
           <div className="flex items-center gap-1 mb-2">
                {PRESET_CATEGORIES.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setActivePresetCategory(cat)}
                        className={`px-2 py-0.5 text-xs rounded-full ${activePresetCategory === cat ? 'bg-brand-primary text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1">
                {filteredPresets.map(preset => (
                    <div
                    key={preset.name}
                    title={preset.name}
                    onClick={() => onChange(preset.value)}
                    className={`h-12 w-full rounded border border-slate-300 cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-brand-primary transition-all ${value === preset.value ? 'ring-2 ring-offset-1 ring-brand-primary' : ''}`}
                    style={{ background: preset.value }}
                    />
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundPicker;