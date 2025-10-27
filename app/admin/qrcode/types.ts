import React from 'react';

export interface QrOptions {
  data: string;
  dotsColor: string;
  backgroundColor: string;
  logo: string | null;
  logoSize: number;
  logoPosition: 'center' | 'background';
  frameId: string;
  frameColor: string;
  frameText: string;
  frameFont: string;
  frameTextSize: number;
  frameTextColor: string;
  frameTextY: number;
  dotsType: string;
}

export interface Frame {
  id: string;
  name: string;
  component: React.FC<{ className?: string; style?: React.CSSProperties; text?: string; font?: string; textSize?: number; textColor?: string; textY?: number; }>;
}