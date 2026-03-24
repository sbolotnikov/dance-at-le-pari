
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { EmailRow, PreviewMode, DroppedItem, EmailColumn, Element as EmailElementType, GlobalStyles } from '../types';
import EmailElement from './EmailElemement';
import { useTouchDrop, TouchDropHandle } from '../hooks/useTouchDrop'; // Updated import
import { useDragContext } from '../hooks/DragContext'; // New import
import EmptyCanvasDropTarget from './EmptyCanvasDropTarget'; // New import
import  CanvasRow  from '@/components/HTMLGenerator/components/CanvasRow'; // New import
import  CanvasColumn  from '@/components/HTMLGenerator/components/CanvasColumn'; // New import

interface CanvasProps {
  emailData: EmailRow[];
  onDrop: (item: DroppedItem, rowIndex: number, colIndex: number, position: number) => void;
  onSelectElement: (id: string) => void;
  selectedElementId: string | null;
  onDeleteElement: (id: string) => void;
  previewMode: PreviewMode;
  globalStyles: GlobalStyles;
}

export const DropIndicator: React.FC = () => (
    <div className="h-1 bg-blue-500 rounded-full my-2 animate-pulse" />
);

const Canvas: React.FC<CanvasProps> = ({ emailData, onDrop, onSelectElement, selectedElementId, onDeleteElement, previewMode, globalStyles }) => {
    const [dragOver, setDragOver] = useState<{rowIndex: number, colIndex: number, position: number} | null>(null);
    const lastCalculatedPosition = useRef<{rowIndex: number, colIndex: number, position: number} | null>(null);
    const { isDragging: isTouchDragging, draggedItem, setDraggedItem, setIsDragging } = useDragContext(); // Added draggedItem, setDraggedItem, setIsDragging

    const handleDragOver = (e: React.DragEvent, rowIndex: number, colIndex: number) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLDivElement;
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
        lastCalculatedPosition.current = { rowIndex, colIndex, position };
    };

    const handleLayoutDragOver = (e: React.DragEvent, rowIndex: number) => {
        e.preventDefault();
        setDragOver({rowIndex, colIndex: -1, position: 0});
        lastCalculatedPosition.current = {rowIndex, colIndex: -1, position: 0};
    };

    const handleDrop = (e: React.DragEvent, rowIndex: number, colIndex: number) => {
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
                const target = e.currentTarget as HTMLDivElement;
                const children = Array.from(target.children).filter(child => child.classList.contains('email-element-wrapper'));
                let position = children.length;
                for (let i = 0; i < children.length; i++) {
                    const childRect = children[i].getBoundingClientRect();
                    if (e.clientY < childRect.top + childRect.height / 2) {
                        position = i;
                        break;
                    }
                }
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
            lastCalculatedPosition.current = null;
        }
    };

    const registeredDropTargets = useRef<TouchDropHandle[]>([]); // New: Registry for droppable areas

    // New: Function to register a droppable area
    const registerDropTarget = useCallback((target: TouchDropHandle) => {
        registeredDropTargets.current.push(target);
        return () => {
            registeredDropTargets.current = registeredDropTargets.current.filter(t => t !== target);
        };
    }, []);

    // Global touchmove handler
    const handleGlobalTouchMove = useCallback((e: TouchEvent) => {
        if (!isTouchDragging || !draggedItem) return;
        e.preventDefault(); // Prevent scrolling during drag

        const touch = e.touches[0];
        let foundOverTarget = false;

        registeredDropTargets.current.forEach(target => {
            const isOver = target.isPointOver(touch.clientX, touch.clientY);
            target.setIsOver(isOver); // Update isOver state for each target
            if (isOver) {
                foundOverTarget = true;
            }
        });
        // Optionally, update a global dragOver state for the Canvas if needed for visual feedback
        // For now, relying on individual target's isOver
    }, [isTouchDragging, draggedItem]);

    // Global touchend handler
    const handleGlobalTouchEnd = useCallback((e: TouchEvent) => {
        if (!isTouchDragging || !draggedItem) return;
        
        const touch = e.changedTouches[0];
        let dropped = false;

        // Find the drop target the touch ended over
        for (const target of registeredDropTargets.current) {
            if (target.isPointOver(touch.clientX, touch.clientY)) {
                const dropData = target.getDropData(e);
                if (dropData) {
                    target.onDrop(draggedItem, dropData.rowIndex, dropData.colIndex, dropData.position);
                    dropped = true;
                    break;
                }
            }
        }

        // Reset drag state
        setDraggedItem(null);
        setIsDragging(false);
        registeredDropTargets.current.forEach(target => target.setIsOver(false)); // Clear all isOver states

        // Clean up global listeners
        window.removeEventListener('touchmove', handleGlobalTouchMove);
        window.removeEventListener('touchend', handleGlobalTouchEnd);
        window.removeEventListener('touchcancel', handleGlobalTouchEnd);

    }, [isTouchDragging, draggedItem, setDraggedItem, setIsDragging]);

    // Effect to attach/detach global listeners
    useEffect(() => {
        if (isTouchDragging) {
            window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
            window.addEventListener('touchend', handleGlobalTouchEnd);
            window.addEventListener('touchcancel', handleGlobalTouchEnd);
        } else {
            window.removeEventListener('touchmove', handleGlobalTouchMove);
            window.removeEventListener('touchend', handleGlobalTouchEnd);
            window.removeEventListener('touchcancel', handleGlobalTouchEnd);
        }
        return () => {
            window.removeEventListener('touchmove', handleGlobalTouchMove);
            window.removeEventListener('touchend', handleGlobalTouchEnd);
            window.removeEventListener('touchcancel', handleGlobalTouchEnd);
        };
    }, [isTouchDragging, handleGlobalTouchMove, handleGlobalTouchEnd]);

    const getPreviewSize = () => {
        switch (previewMode) {
            case 'tablet': return '768px';
            case 'mobile': return '375px';
            default: return `${globalStyles.width}px`;
        }
    };
    
    const canvasStyle: React.CSSProperties = {
        width: getPreviewSize(),
        minWidth: '200px', // Ensure minimum width
        // Removed maxWidth: '100%' to allow extension
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
                onDrop={(e) => handleDrop(e, (emailData || []).length -1, 0)} // fallback drop
            >
                {(emailData || []).map((row, rowIndex) => (
                    <CanvasRow
                        key={row.id}
                        row={row}
                        rowIndex={rowIndex}
                        emailData={emailData}
                        onDrop={onDrop}
                        onSelectElement={onSelectElement}
                        selectedElementId={selectedElementId}
                        onDeleteElement={onDeleteElement}
                        previewMode={previewMode}
                        globalStyles={globalStyles}
                        handleDragOver={handleDragOver}
                        handleDrop={handleDrop}
                        dragOver={dragOver}
                        registerDropTarget={registerDropTarget} // New prop
                    />
                ))}
                {(!emailData || emailData.length === 0) && (
                     <EmptyCanvasDropTarget onDrop={onDrop} registerDropTarget={registerDropTarget} />
                )}
            </div>
        </div>
    );
};

export default Canvas;