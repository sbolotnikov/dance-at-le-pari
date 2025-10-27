import React, { useEffect, useRef } from 'react';
import type { QrOptions } from '../types';
import { FRAMES } from '../constants';

// declare global {
//   interface Window {
//     QRCodeStyling?: any;
//   }
// }

interface QrCodePreviewProps {
  options: QrOptions;
}

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

// Helper functions moved outside component for performance and clarity
const getLuminance = (hex: string): number => {
    if (!hex || hex.length < 7) return 0;
    try {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    } catch(e) {
        return 0;
    }
};
  
const parseColorToHex = (color: string): string => {
      if (!color) return '#000000';
      if (color.startsWith('rgba')) {
          const parts = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')')).split(',');
          const r = parseInt(parts[0], 10);
          const g = parseInt(parts[1], 10);
          const b = parseInt(parts[2], 10);
          const toHex = (c: number) => ('0' + c.toString(16)).slice(-2);
          return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      }
      if (color.startsWith('#')) {
          return color.slice(0, 7);
      }
      return '#000000';
};

// Using a simple rounded rectangle for the background clip-path to improve scannability.
const BackgroundClipPath: React.FC = () => (
  <svg width="0" height="0" className="absolute">
    <defs>
      <clipPath id="background-clip" clipPathUnits="objectBoundingBox">
        <rect x="0" y="0" width="1" height="1" rx="0.1" ry="0.1" />
      </clipPath>
    </defs>
  </svg>
);

const QrCodePreview: React.FC<QrCodePreviewProps> = ({ options }) => {
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const previewSize = 400;
  const framePadding = 50;

  const ActiveFrame = FRAMES.find(f => f.id === options.frameId)?.component;
  const hasFrame = options.frameId !== 'none' && ActiveFrame;
  const isBackgroundLogo = options.logo && options.logoPosition === 'background';

  const qrSize = hasFrame ? previewSize - (framePadding * 2) : previewSize;
  
  const dotsHex = parseColorToHex(options.dotsColor);
  const isDotsLight = getLuminance(dotsHex) > 0.5;
  // Increased overlay opacity for better contrast and scannability.
  const backgroundOverlay = isBackgroundLogo
    ? (isDotsLight ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.85)')
    : undefined;

  useEffect(() => {
    const qrBackgroundColor = isBackgroundLogo ? '#00000000' : options.backgroundColor;
    
    // When using a background logo, force dots to be opaque for better scannability.
    const finalDotsColor = isBackgroundLogo ? parseColorToHex(options.dotsColor) : options.dotsColor;

    const qrOptions = {
      width: qrSize,
      height: qrSize,
      margin: 10,
      data: options.data,
      image: isBackgroundLogo ? null : options.logo,
      dotsOptions: {
        color: finalDotsColor,
        type: options.dotsType as any,
      },
      backgroundOptions: {
        color: qrBackgroundColor,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 5,
        imageSize: options.logoSize,
      },
      qrOptions: {
        errorCorrectionLevel: 'H'
      }
    };

    if (qrContainerRef.current ) {
        if (qrContainerRef.current.firstChild) {
            qrContainerRef.current.removeChild(qrContainerRef.current.firstChild);
        }
        const QRCodeStyling = require('qr-code-styling');

        const qrCode = new QRCodeStyling({ type: 'svg', ...qrOptions });
        qrCode.append(qrContainerRef.current);
    }
  }, [options, qrSize, isBackgroundLogo]);

  const createFinalSvg = (): string => {
    const qrSvgElement = qrContainerRef.current?.querySelector('svg');
    const frameSvgElement = frameRef.current?.querySelector('svg');

    const qrWrapper = `<g transform="translate(${hasFrame ? framePadding : 0}, ${hasFrame ? framePadding : 0})">${qrSvgElement?.innerHTML || ''}</g>`;
    
    const frameScale = previewSize / 120; // Frames are designed on a 120x120 grid
    const frameWrapper = hasFrame && frameSvgElement 
      ? `<g transform="scale(${frameScale})" fill="${options.frameColor}">${frameSvgElement.innerHTML}</g>` 
      : '';

    let backgroundWrapper = '';
    if (isBackgroundLogo && options.logo) {
      const cornerRadius = previewSize * 0.1;
      backgroundWrapper = `
        <defs>
          <clipPath id="background-clip-download">
             <rect x="0" y="0" width="${previewSize}" height="${previewSize}" rx="${cornerRadius}" ry="${cornerRadius}" />
          </clipPath>
        </defs>
        <g clip-path="url(#background-clip-download)">
            <image href="${options.logo}" x="0" y="0" width="${previewSize}" height="${previewSize}" preserveAspectRatio="xMidYMid slice" />
            <rect x="0" y="0" width="${previewSize}" height="${previewSize}" fill="${backgroundOverlay}" />
        </g>
      `;
    }

    return `<svg width="${previewSize}" height="${previewSize}" viewBox="0 0 ${previewSize} ${previewSize}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        ${backgroundWrapper}
        ${qrWrapper}
        ${frameWrapper}
    </svg>`;
  };

  const onDownloadClick = (extension: 'png' | 'svg') => {
    const svgString = createFinalSvg();
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const download = (href: string, fileName: string) => {
        const a = document.createElement('a');
        a.href = href;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (extension === 'svg') {
        download(url, 'fancy-qrcode.svg');
        URL.revokeObjectURL(url);
    } else { // PNG
        const downloadSize = 1024; // High-resolution for PNG download
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = downloadSize;
            canvas.height = downloadSize;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, downloadSize, downloadSize);
            }
            URL.revokeObjectURL(url);
            const pngUrl = canvas.toDataURL('image/png');
            download(pngUrl, 'fancy-qrcode.png');
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            console.error("Failed to load SVG for PNG conversion.");
        };
        img.src = url;
    }
  };
  
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-lg flex flex-col items-center justify-center gap-6 h-full min-h-[500px]">
      <BackgroundClipPath />
      <div 
        className="relative flex items-center justify-center rounded-lg overflow-hidden bg-gray-900/20" 
        style={{ 
            width: previewSize, 
            height: previewSize,
        }}
      >
        {isBackgroundLogo && (
            <>
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${options.logo})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        clipPath: 'url(#background-clip)',
                    }}
                />
                 <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: backgroundOverlay,
                        clipPath: 'url(#background-clip)',
                    }}
                />
            </>
        )}
        <div ref={qrContainerRef} style={{ width: qrSize, height: qrSize }} />
        {hasFrame && (
           <div ref={frameRef} className="absolute inset-0 pointer-events-none">
              <ActiveFrame 
                className="w-full h-full" 
                style={{ color: options.frameColor }} 
                text={options.frameText}
                font={options.frameFont}
                textSize={options.frameTextSize}
                textColor={options.frameTextColor}
                textY={options.frameTextY}
                />
           </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => onDownloadClick('png')}
          className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <DownloadIcon />
          Download PNG
        </button>
         <button
          onClick={() => onDownloadClick('svg')}
          className="inline-flex items-center justify-center bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <DownloadIcon />
          Download SVG
        </button>
      </div>
    </div>
  );
};

export default QrCodePreview;