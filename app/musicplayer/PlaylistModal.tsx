import React, { useState, useEffect } from 'react';
import DanceItem from './DanceItem';
import EditDanceModal from './EditDanceModal';
import { TDanceItemType } from '@/types/screen-settings';

interface PlaylistModalProps {
 
  list: TDanceItemType[];
    onMoveItem: (fromIndex: number, toIndex: number) => void;
    onEditItem: (updatedItem: TDanceItemType) => void;
    onDeleteItem: (id: number) => void;
    currentIndex: number;
    onItemClick: (index: number) => void;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({ list, onMoveItem, onEditItem, onDeleteItem, currentIndex, onItemClick }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<TDanceItemType | null>(null);
  const [reorderFromIndex, setReorderFromIndex] = useState<number | null>(null);
  

  const handleToggleReorder = (index: number) => {
    setReorderFromIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const handleMoveItem = (toIndex: number) => {
    if (reorderFromIndex === null) return;

    if (reorderFromIndex === toIndex) {
      setReorderFromIndex(null);
      return;
    }
    onMoveItem(reorderFromIndex, toIndex);
    // setCurrentList(prevList => {
    //   const newList = [...prevList];
    //   const [movedItem] = newList.splice(reorderFromIndex, 1);
    //   newList.splice(toIndex, 0, movedItem);
    //   return newList;
    // });

    setReorderFromIndex(null);
  };

  const handleDelete = (id: number) => {
    onDeleteItem(id);
  };

  const handleEdit = (id: number) => {
    const item = list.find(d => d.id === id);
    if (item) {
      setItemToEdit(item);
      setIsEditModalOpen(true);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setItemToEdit(null);
  };

  const handleEditSubmit = (updatedItem: TDanceItemType) => {
    onEditItem(updatedItem);
    closeEditModal();
  };



  return (
    <div className="w-full h-fullflex flex-col p-4">
      <div className="container mx-auto max-w-2xl flex-grow flex flex-col">
   

        <div className="flex-grow overflow-y-auto">
          {list.length > 0 ? (
            <ul className="space-y-3" >
              {list.map((item, index) => (
                <DanceItem
                  key={item.id}
                  item={item}
                  index={index}
                  isCurrent={index === currentIndex}
                  isReorderActive={reorderFromIndex !== null}
                  isSourceOfReorder={reorderFromIndex === index}
                  onToggleReorder={handleToggleReorder}
                  onItemClick={() => onItemClick(index)}
                  onMoveItem={handleMoveItem}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </ul>
          ) : (
            <div className="text-center py-12 px-6 bg-white rounded-lg shadow-sm h-full flex flex-col justify-center">
              <h2 className="text-xl font-semibold text-slate-700">Your playlist is empty!</h2>
              <p className="mt-2 text-slate-500">Add a new dance to get started.</p>
            </div>
          )}
        </div>
      </div>

      {itemToEdit && (
        <EditDanceModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSubmit={handleEditSubmit}
          item={itemToEdit}
        />
      )}
    </div>
  );
};

export default PlaylistModal;
