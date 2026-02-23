
import React from 'react';
import { COMPONENT_TYPES, LAYOUT_TYPES } from '../constants';
import { DroppedItem, DraggableType } from '../types';
import { TextIcon, ImageIcon, ButtonIcon, DividerIcon, SpacerIcon, SocialIcon, ColumnsIcon } from './icons';

const DraggableItem: React.FC<{ name: string; type: DraggableType; columns?: number; widths?: string[]; children: React.ReactNode; }> = ({ name, type, columns, widths, children }) => {
  const handleDragStart = (e: React.DragEvent) => {
    const item: DroppedItem = { type };
    if (columns) {
        item.columns = columns;
    }
    if (widths) {
        item.widths = widths;
    }
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex flex-col items-center justify-center p-2 text-center bg-white border border-slate-200 rounded-lg cursor-grab hover:shadow-md hover:border-brand-primary transition-all"
    >
      {children}
      <span className="text-xs mt-1 text-slate-600">{name}</span>
    </div>
  );
};

const iconMap: { [key: string]: React.ReactNode } = {
  text: <TextIcon className="w-8 h-8 text-slate-500" />,
  image: <ImageIcon className="w-8 h-8 text-slate-500" />,
  button: <ButtonIcon className="w-8 h-8 text-slate-500" />,
  divider: <DividerIcon className="w-8 h-8 text-slate-500" />,
  spacer: <SpacerIcon className="w-8 h-8 text-slate-500" />,
  social: <SocialIcon className="w-8 h-8 text-slate-500" />,
};


const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white p-4 border-r border-slate-200 overflow-y-auto shadow-inner">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Components</h3>
        <div className="grid grid-cols-2 gap-2">
          {COMPONENT_TYPES.map(({ name, type }) => (
            <DraggableItem key={type} name={name} type={type}>
              {iconMap[type]}
            </DraggableItem>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Layouts</h3>
        <div className="grid grid-cols-2 gap-2">
          {LAYOUT_TYPES.map(({ name, columns, widths }) => (
            <DraggableItem key={name} name={name} type="layout" columns={columns} widths={widths}>
              <ColumnsIcon columns={columns} className="w-8 h-8 text-slate-500" />
            </DraggableItem>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;