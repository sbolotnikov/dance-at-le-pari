import React from 'react';
import type { Frame } from './types';

export const FONTS = [
  'sans-serif',
  'serif',
  'monospace',
  'cursive',
  'fantasy',
  'Arial',
  'Brush Script MT',
  'Comic Sans MS',
  'Courier New',
  'Garamond',
  'Georgia',
  'Impact',
  'Verdana',
];

const Frame1: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 120 120" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M20 0H100C111.046 0 120 8.9543 120 20V100C120 111.046 111.046 120 100 120H20C8.9543 120 0 111.046 0 100V20C0 8.9543 8.9543 0 20 0ZM105 15H15V105H105V15Z"/>
  </svg>
);

const Frame2: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 120 120" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 35 V0 H35 V15 H15 V35 H0Z"/>
    <path d="M85 0 H120 V35 H105 V15 H85 V0Z"/>
    <path d="M120 85 V120 H85 V105 H105 V85 H120Z"/>
    <path d="M35 120 H0 V85 H15 V105 H35 V120Z"/>
  </svg>
);

const Frame3: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 120 120" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M60 120C93.1371 120 120 93.1371 120 60C120 26.8629 93.1371 0 60 0C26.8629 0 0 26.8629 0 60C0 93.1371 26.8629 120 60 120ZM105 15H15V105H105V15Z"/>
  </svg>
);

const Frame4: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 120 120" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0 H35 L20 15 H15 V20 L0 35 V0Z" />
    <path d="M120 0 V35 L100 20 V15 H105 L85 0 H120Z" />
    <path d="M120 120 H85 L100 105 H105 V100 L120 85 V120Z" />
    <path d="M0 120 V85 L20 100 V105 H15 L35 120 H0Z" />
  </svg>
);

const calculateFrameTextSize = (textLength: number, scale: number = 1): number => {
    let baseSize: number;
    if (textLength <= 8) baseSize = 12;
    else if (textLength >= 20) baseSize = 6;
    else {
        // Linear interpolation for lengths between 8 and 20
        baseSize = 12 - ((textLength - 8) / (20 - 8)) * (12 - 6);
    }
    return baseSize * scale;
};

const Frame5: React.FC<{ className?: string; style?: React.CSSProperties; text?: string; font?: string; textSize?: number; textColor?: string; textY?: number; }> = ({ className, style, text, font, textSize = 1, textColor = '#ffffff', textY = 0 }) => {
  const fontSize = calculateFrameTextSize(text?.length || 0, textSize);
  const verticalPosition = 112 + textY;

  return (
    <svg className={className} style={style} viewBox="0 0 120 120" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M0 0 H120 V15 H0 V0Z M0 105 H120 V120 H0 V105Z M0 15 H15 V105 H0 V15Z M105 15 H120 V105 H105 V15Z" />
        <text x="60" y={verticalPosition} textAnchor="middle" dominantBaseline="middle" fontFamily={font} fontSize={fontSize} fontWeight="bold" fill={textColor}>{text}</text>
      </g>
    </svg>
  );
};

const Frame6: React.FC<{ className?: string; style?: React.CSSProperties; text?: string; font?: string; textSize?: number; textColor?: string; textY?: number; }> = ({ className, style, text, font, textSize = 1, textColor = '#ffffff', textY = 0 }) => {
  const fontSize = calculateFrameTextSize(text?.length || 0, textSize);
  const verticalPosition = 112 + textY;

  return (
    <svg className={className} style={style} viewBox="0 0 120 120" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M0 0 H25 V5 H5 V25 H0 V0Z"/>
        <path d="M120 0 H95 V5 H115 V25 H120 V0Z"/>
        <path d="M0 120 H25 V115 H5 V95 H0 V120Z"/>
        <path d="M120 120 H95 V115 H115 V95 H120 V120Z"/>
        <rect x="0" y="105" width="120" height="15" />
        <text x="60" y={verticalPosition} textAnchor="middle" dominantBaseline="middle" fontFamily={font} fontSize={fontSize} fontWeight="bold" fill={textColor}>{text}</text>
      </g>
    </svg>
  );
};


export const FRAMES: Frame[] = [
  { id: 'none', name: 'None', component: () => null },
  { id: 'rounded-rect', name: 'Soft', component: Frame1 },
  { id: 'corner-cuts', name: 'Corners', component: Frame2 },
  { id: 'circle', name: 'Circle', component: Frame3 },
  { id: 'tech-box', name: 'Tech', component: Frame4 },
  { id: 'modern-scan', name: 'Scan 1', component: Frame5 },
  { id: 'digital-scan', name: 'Scan 2', component: Frame6 },
];