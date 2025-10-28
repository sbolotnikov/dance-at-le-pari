
import React, { useState } from 'react';
import { EmailRow, PreviewMode, DroppedItem, EmailColumn, Element as EmailElementType, GlobalStyles } from '../types';
import EmailElement from './EmailElemement';

interface CanvasProps {
  emailData: EmailRow[];
  onDrop: (item: DroppedItem, rowIndex: number, colIndex: number, position: number) => void;
  onSelectElement: (id: string) => void;
  selectedElementId: string | null;
  onDeleteElement: (id: string) => void;
  previewMode: PreviewMode;
  globalStyles: GlobalStyles;
}

const DropIndicator: React.FC = () => (
    <div className="h-1 bg-blue-500 rounded-full my-2 animate-pulse" />
);

const Canvas: React.FC<CanvasProps> = ({ emailData, onDrop, onSelectElement, selectedElementId, onDeleteElement, previewMode, globalStyles }) => {
    const [dragOver, setDragOver] = useState<{rowIndex: number, colIndex: number, position: number} | null>(null);

    const handleDragOver = (e: React.DragEvent, rowIndex: number, colIndex: number) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLDivElement;
        const rect = target.getBoundingClientRect();
        const children = Array.from(target.children).filter(child => child.classList.contains('email-element-wrapper'));
        
        let position = children.length;
        for (let i = 0; i < children.length; i++) {
            const childRect = children[i].getBoundingClientRect();
            if (e.clientY < childRect.top + childRect.height / 2) {
                position = i;
                break;
            }
        }
        
        setDragOver({ rowIndex, colIndex, position });
    };

    const handleLayoutDragOver = (e: React.DragEvent, rowIndex: number) => {
        e.preventDefault();
        setDragOver({rowIndex, colIndex: -1, position: 0});
    };

    const handleDrop = (e: React.DragEvent, rowIndex: number, colIndex: number, position: number) => {
        e.preventDefault();
        e.stopPropagation(); // Stop event from bubbling up to parent drop zones
        setDragOver(null);
    
        try {
            const itemData = e.dataTransfer.getData('application/json');
            
            // Guard against empty or invalid data which can be introduced by external drag-and-drop actions.
            if (!itemData || itemData === 'undefined') {
                 console.warn("Could not process dropped item. This is normal for external drags.");
                 return;
            }
            
            // This will throw if itemData is not valid JSON (e.g., "", "undefined")
            // and the error will be caught below.
            const item = JSON.parse(itemData) as DroppedItem;
            
            // After parsing, validate the structure of the object.
            if (item && typeof item === 'object' && item.type) {
                onDrop(item, rowIndex, colIndex, position);
            } else {
                console.warn("Dropped item has invalid structure:", item);
            }
        } catch (error) {
            // This catch block makes the drop handling robust. It prevents crashes
            // when users drop files, text from other windows, or anything that
            // isn't a valid JSON string from our sidebar. This is expected behavior.
            console.warn("Could not process dropped item. This is normal for external drags.");
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (!e.currentTarget.contains(relatedTarget)) {
            setDragOver(null);
        }
    };

    const getPreviewSize = () => {
        switch (previewMode) {
            case 'tablet': return '768px';
            case 'mobile': return '375px';
            default: return `${globalStyles.width}px`;
        }
    };
    
    const canvasStyle: React.CSSProperties = {
        width: getPreviewSize(),
        maxWidth: '100%',
        background: globalStyles.contentBackground,
        color: globalStyles.textColor,
        fontFamily: globalStyles.fontFamily,
        fontSize: globalStyles.fontSize,
    };

    return (
        <div className="w-full flex justify-center">
            <div 
                className="shadow-lg transition-all duration-300 mx-auto" 
                style={canvasStyle}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, (emailData || []).length -1, 0, 0)} // fallback drop
            >
                {(emailData || []).map((row, rowIndex) => (
                    <div 
                        key={row.id} 
                        className="border-b border-dashed border-slate-300 relative group"
                        onDragOver={(e) => handleLayoutDragOver(e, rowIndex)}
                        onDrop={(e) => handleDrop(e, rowIndex, -1, 0)}
                    >
                         {dragOver?.rowIndex === rowIndex && dragOver.colIndex === -1 && <DropIndicator />}
                        <div className="flex">
                            {(row.columns || []).map((col, colIndex) => {
                                // Robustness fix: Find any element with verticalAlign to control the column's flex alignment.
                                const elementWithVA = (col.elements || []).find(el => el.style.verticalAlign);
                                const columnVerticalAlign = elementWithVA ? elementWithVA.style.verticalAlign : 'top';
                                
                                const flexAlignMap = {
                                    top: 'flex-start',
                                    middle: 'center',
                                    bottom: 'flex-end',
                                };
                                const columnStyle = {
                                    width: col.style.width as string,
                                    display: 'flex',
                                    flexDirection: 'column' as const,
                                    justifyContent: flexAlignMap[columnVerticalAlign as 'top' | 'middle' | 'bottom'] || 'flex-start',
                                };

                                return (
                                    <div 
                                        key={col.id} 
                                        style={columnStyle}
                                        className="border-r border-dashed border-slate-300 last:border-r-0 p-2 min-h-[50px]"
                                        onDrop={(e) => handleDrop(e, rowIndex, colIndex, dragOver?.position || 0)}
                                        onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
                                    >
                                       { (col.elements || []).length === 0 && dragOver?.rowIndex === rowIndex && dragOver?.colIndex === colIndex && (
                                            <DropIndicator />
                                        )}
                                        {(col.elements || []).map((el: EmailElementType, elIndex: number) => (
                                            <React.Fragment key={el.id}>
                                                {dragOver?.rowIndex === rowIndex && dragOver?.colIndex === colIndex && dragOver?.position === elIndex && <DropIndicator />}
                                                <EmailElement
                                                    element={el}
                                                    onSelect={() => onSelectElement(el.id)}
                                                    isSelected={selectedElementId === el.id}
                                                    onDelete={() => onDeleteElement(el.id)}
                                                />
                                            </React.Fragment>
                                        ))}
                                        {dragOver?.rowIndex === rowIndex && dragOver?.colIndex === colIndex && dragOver?.position === (col.elements || []).length && <DropIndicator />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
                {(!emailData || emailData.length === 0) && (
                     <div
                        className="w-full min-h-[200px] flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg"
                        onDragOver={(e) => { e.preventDefault(); setDragOver({rowIndex: 0, colIndex: 0, position: 0})}}
                        onDrop={(e) => handleDrop(e, 0, 0, 0)}
                        onDragLeave={() => setDragOver(null)}
                    >
                        {dragOver ? <DropIndicator /> : <p className="text-slate-500">Drag a component or layout here to start</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Canvas;