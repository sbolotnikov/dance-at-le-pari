import React, { useState, useContext } from 'react';
import { SettingsContext } from '@/hooks/useSettings';

type UrgentMessage = {
  id: number;
  htmlContent: string;
  pages: string[];
};

interface EditPagesModalProps {
  message: UrgentMessage;
  onClose: () => void;
  onSave: (pages: string[]) => void;
}

const EditPagesModal: React.FC<EditPagesModalProps> = ({ message, onClose, onSave }) => {
  const [selectedPages, setSelectedPages] = useState<string[]>(message.pages);
  const [inputValue, setInputValue] = useState('');
  const settings = useContext(SettingsContext);
  const darkMode = settings?.darkMode;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newPage = inputValue.trim();
      if (newPage && !selectedPages.includes(newPage)) {
        setSelectedPages([...selectedPages, newPage]);
      }
      setInputValue('');
    }
  };

  const handleRemovePage = (pageToRemove: string) => {
    setSelectedPages(selectedPages.filter((page) => page !== pageToRemove));
  };

  const handleSave = () => {
    onSave(selectedPages);
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-darkMainBG p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-darkMainColor">Edit Pages for Message {message.id}</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedPages.map((page) => (
            <div key={page} className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 text-sm text-gray-800 dark:text-darkMainColor">
              {page}
              <button onClick={() => handleRemovePage(page)} className="text-red-500">
                &times;
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Add a page and press Enter"
          className="w-full p-2 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-darkMainColor"
        />
        <div className="flex gap-2 mt-4">
          <button className="btnFancy" onClick={handleSave}>
            Save
          </button>
          <button className="btnFancy" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPagesModal;
