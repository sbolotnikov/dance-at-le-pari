
import React, { useState, useEffect } from 'react';
import { TDanceItemType } from '@/types/screen-settings';

interface EditDanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedItem: TDanceItemType) => void;
  item: TDanceItemType | null;
}

const EditDanceModal: React.FC<EditDanceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  item
}) => {
  const [formData, setFormData] = useState({ danceName: '', songName: '', speed: '' });
  const [errors, setErrors] = useState({ danceName: '', songName: '', speed: '' });

  useEffect(() => {
    if (isOpen && item) {
      setFormData({
        danceName: item.danceName,
        songName: item.songName,
        speed: item.speed.toString(),
      });
      setErrors({ danceName: '', songName: '', speed: '' });
    }
  }, [isOpen, item]);
  
  const validate = () => {
    const newErrors = { danceName: '', songName: '', speed: '' };
    let isValid = true;
    
    if (!formData.danceName.trim()) {
      newErrors.danceName = 'Dance name is required.';
      isValid = false;
    }
    if (!formData.songName.trim()) {
      newErrors.songName = 'Song name is required.';
      isValid = false;
    }
    const speedNum = parseInt(formData.speed, 10);
    if (isNaN(speedNum) || speedNum <= 0) {
      newErrors.speed = 'Speed must be a positive number.';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item && validate()) {
      onSubmit({
        ...item,
        danceName: formData.danceName.trim(),
        songName: formData.songName.trim(),
        speed: parseInt(formData.speed, 10),
      });
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-800 mb-6">Edit Dance Routine</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div>
              <label htmlFor="danceName" className="block text-sm font-medium text-slate-700 mb-1">Dance Name</label>
              <input
                id="danceName"
                name="danceName"
                type="text"
                value={formData.danceName}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.danceName ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'}`}
                autoFocus
              />
              {errors.danceName && <p className="text-red-500 text-sm mt-1">{errors.danceName}</p>}
            </div>
            <div>
              <label htmlFor="songName" className="block text-sm font-medium text-slate-700 mb-1">Song Name</label>
              <input
                id="songName"
                name="songName"
                type="text"
                value={formData.songName}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.songName ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'}`}
              />
              {errors.songName && <p className="text-red-500 text-sm mt-1">{errors.songName}</p>}
            </div>
            <div>
              <label htmlFor="speed" className="block text-sm font-medium text-slate-700 mb-1">Speed (BPM)</label>
              <input
                id="speed"
                name="speed"
                type="number"
                value={formData.speed}
                onChange={handleChange}
                min="1"
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.speed ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'}`}
              />
              {errors.speed && <p className="text-red-500 text-sm mt-1">{errors.speed}</p>}
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDanceModal;