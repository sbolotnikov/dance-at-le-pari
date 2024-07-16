'use client'; 

import React, { useState } from 'react'; 

interface UrgentMessageComponentProps {
  onChange: (message: string) => void;
  onMessageArrayChange: (messages: string[]) => void;
  savedMessages: string[];
  message: string;
}

const UrgentMessageComponent: React.FC<UrgentMessageComponentProps> = ({
  onChange,
  onMessageArrayChange,
  savedMessages,message
}) => {
  const [openList, setOpenList] = useState(false);
  const [urgentMessage, setUrgentMessage] = useState(message);

  const handleMessageChange = (text: string) => {
    setUrgentMessage(text);
    onChange(text);
  };

  const handleAddMessage = () => {
    onMessageArrayChange([...savedMessages, urgentMessage]);
  };

  const handleDeleteMessage = (index: number) => {
    onMessageArrayChange(savedMessages.filter((_, i) => i !== index));
  };

  return (
    <div className="relative w-11/12 max-w-md mt-5 z-10">
      <input
        className="h-11 w-full pl-3 rounded-full border-2 border-[#C9AB78] focus:outline-none focus:border-[#A58A5C]"
        placeholder="Enter urgent message"
        value={message}
        onChange={(e) => handleMessageChange(e.target.value)}
      />
      <button
        onClick={() => setOpenList(!openList)}
        className="absolute top-3 right-3 z-10 text-[#776548] hover:text-[#5A4C36] transition-colors"
      >
        <span className={`transform ${openList ? 'rotate-180' : ''} transition-transform`}>{'^'}</span>
      </button>
      <button
        onClick={handleAddMessage}
        className="absolute top-3 right-8 z-10 pr-3 text-[#776548] hover:text-[#5A4C36] transition-colors"
      >
        {"+"}
      </button>
      {openList && (
        <div className="absolute top-full w-full bg-white rounded-b-md shadow-lg mt-1">
          {savedMessages.sort((a, b) => a.localeCompare(b)).map((item, i) => (
            <div key={i} className="w-full flex justify-between items-center hover:bg-gray-100">
              <button
                onClick={() => {
                  handleMessageChange(item);
                  setOpenList(false);
                }}
                className="p-3 text-left w-full"
              >
                {item}
              </button>
              <button
                onClick={() => handleDeleteMessage(i)}
                className="p-3 text-red-500 hover:text-red-700 transition-colors"
              >
                {'-'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UrgentMessageComponent;