import React from 'react';
import { Element } from '../types';
import { TrashIcon, SocialPlatformIcon } from './icons';
import { SOCIAL_PLATFORM_COLORS } from '../constants';

interface EmailElementProps {
  element: Element;
  onSelect: () => void;
  isSelected: boolean;
  onDelete: () => void;
}

const EmailElement: React.FC<EmailElementProps> = ({ element, onSelect, isSelected, onDelete }) => {
  const renderElement = () => {
    const style = element.style as React.CSSProperties;
    switch (element.type) {
      case 'text':
        return <p style={style} dangerouslySetInnerHTML={{ __html: element.content.text?.replace(/\n/g, '<br />') || '' }} />;
      case 'image': {
        const { padding, ...imageStyles } = style;
        return <img src={element.content.src} alt={element.content.alt} style={{...imageStyles, maxWidth: '100%', height: 'auto', display: 'inline-block'}} />;
      }
      case 'button':
        return <a href={element.content.href} style={{ ...style, display: 'inline-block', textDecoration: 'none', color: style.color || '#ffffff' }}>{element.content.text}</a>;
      case 'divider':
        return <div style={{...style, width: '100%'}}></div>
      case 'spacer':
        return <div style={{...style, width: '100%' }}></div>;
      case 'social':
        const alignMap = { left: 'flex-start', center: 'center', right: 'flex-end' };
        const justifyContent = alignMap[style.textAlign as keyof typeof alignMap] || 'center';
        return (
            <div style={{ ...style, display: 'flex', justifyContent, alignItems: 'center', gap: '10px' }}>
                {(element.content.links || []).map((link, index) => (
                    <a key={index} href={link.href} style={{
                        display: 'inline-block',
                        textDecoration: 'none',
                        color: SOCIAL_PLATFORM_COLORS[link.platform] || '#4A5568'
                    }}>
                        <SocialPlatformIcon platform={link.platform} className="w-8 h-8" />
                    </a>
                ))}
            </div>
        );
      default:
        return null;
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete();
  }

  const wrapperStyle: React.CSSProperties = {};
  if ((element.type === 'button' || element.type === 'image' || element.type === 'social') && element.style.textAlign) {
    wrapperStyle.textAlign = element.style.textAlign as React.CSSProperties['textAlign'];
  }

  // For images, apply padding to the wrapper to mimic email client behavior and fix sizing issues.
  if (element.type === 'image') {
    wrapperStyle.padding = element.style.padding;
  }

  return (
    <div
      onClick={onSelect}
      className={`email-element-wrapper relative cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400 ${isSelected ? 'outline outline-2 outline-brand-primary' : ''}`}
      style={wrapperStyle}
    >
      {renderElement()}
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-10">
           <button onClick={handleDelete} className="bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600">
               <TrashIcon className="w-4 h-4" />
            </button>
        </div>
      )}
    </div>
  );
};

export default EmailElement;
