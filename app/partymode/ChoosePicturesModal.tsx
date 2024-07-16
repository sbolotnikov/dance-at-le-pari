'use client';

import React, { useState, useEffect } from 'react'; 

interface Picture {
    link: string;
    name: string;
}

type Props = {
  displayPics: Picture[];
  galleryType: 'manual' | 'auto';
  vis: boolean;
  onReturn: (pictures: Picture[]  ) => void;
}

const ChoosePicturesModal: React.FC<Props> = ({
  displayPics,
  galleryType,
  vis,
  onReturn,
}) => {
  const [displayPictures, setDisplayPictures] = useState<Picture[] >([]);
  const [pictureLink, setPictureLink] = useState('');
  const [pictureLinkType, setPictureLinkType] = useState('Regular link');
  const [pictureText, setPictureText] = useState('');

  useEffect(() => {
    setDisplayPictures(displayPics);
  }, [displayPics]);

  const handleSubmit = (submitType: 'Save' | 'Close') => {
    if (submitType === 'Save') {
      onReturn(displayPictures);
    } else {
      onReturn([]);
    }
  };

  const handleAddPicture = () => {
    const newPicture =   { name: pictureText, link: pictureLink } as Picture;
    
    setDisplayPictures([...displayPictures, newPicture]);
    setPictureLink('');
    setPictureText('');
  };

  const handleDeletePicture = (index: number) => {
    const newPictures = [...displayPictures];
    newPictures.splice(index, 1);
    setDisplayPictures(newPictures);
  };

  const handlePictureLinkChange = (text: string) => {
    if (pictureLinkType === 'GDrive Link') {
      const id = text.split('/file/d/')[1]?.split('/')[0];
      setPictureLink(`https://drive.google.com/thumbnail?id=${id}&sz=w1000`);
    } else {
      setPictureLink(text);
    }
  };

  if (!vis) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white w-11/12 max-w-2xl h-5/6 rounded-md shadow-lg flex flex-col items-center p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Available pictures</h2>

        <div className="w-full h-28 border border-black p-1 rounded-md overflow-x-auto mb-4">
          <div className="flex flex-wrap items-center justify-start">
            {displayPictures.map((item, i) => (
              <div key={`picturescasting${i}`} className="relative m-1">
                <img 
                  src={typeof item === 'string' ? item : item.link} 
                  alt={typeof item === 'string' ? `Picture ${i}` : item.name}
                  className="h-16 w-16 bg-gray-300 p-1 rounded-sm"
                />
                <button 
                  onClick={() => handleDeletePicture(i)}
                  className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                >
                  Del
                </button>
                {galleryType === "manual" && typeof item !== 'string' && (
                  <p className="mt-1 text-center max-w-[100px] truncate">{item.name}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col items-center mb-4">
          <img 
            src={pictureLink} 
            alt="Preview" 
            className="h-16 w-16 bg-gray-300 rounded-sm mb-2"
          />
          
          <select
            value={pictureLinkType}
            onChange={(e) => setPictureLinkType(e.target.value)}
            className="mb-2 p-2 border border-gray-300 rounded"
          >
            <option value="Regular link">Regular link</option>
            <option value="GDrive Link">GDrive Link</option>
          </select>

          <input
            type="text"
            placeholder="Enter picture link"
            value={pictureLink}
            onChange={(e) => handlePictureLinkChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />

          {galleryType === "manual" && (
            <input
              type="text"
              placeholder="Enter picture text"
              value={pictureText}
              onChange={(e) => setPictureText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
          )}

          <button
            onClick={handleAddPicture}
            className="w-full bg-purple-800 text-white p-2 rounded hover:bg-purple-700 transition-colors"
          >
            Add Picture
          </button>
        </div>

        <button
          onClick={() => handleSubmit('Save')}
          className="w-full bg-purple-800 text-white p-2 rounded hover:bg-purple-700 transition-colors mb-2"
        >
          Save Changes
        </button>
        <button
          onClick={() => handleSubmit('Close')}
          className="w-full bg-blue-800 text-white p-2 rounded hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ChoosePicturesModal;