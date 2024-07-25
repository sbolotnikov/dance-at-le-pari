'use client';

import AnimateModalLayout from '@/components/AnimateModalLayout';
import ShowIcon from '@/components/svg/showIcon';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

interface Picture {
  link: string;
  name: string;
}

type Props = {
  vis: boolean;
  onChange: (message: string) => void;
  onMessageArrayChange: (messages: string[]) => void;
  savedMessages: string[];
  message: string;
  onClose: () => void;
};

const ChooseMessageModal: React.FC<Props> = ({
  onChange,
  onMessageArrayChange,
  savedMessages,
  message,
  vis,
  onClose,
}) => {
  const [displayMessages, setDisplayMessages] = useState<string[]>([]);
  const [messageText, setMessageText] = useState(message);

  useEffect(() => {
    setDisplayMessages(savedMessages.sort((a: string, b: string) => a>b?1:-1));
  }, [savedMessages]);

  //   const handleSubmit = (submitType: 'Save' | 'Close') => {
  //     if (submitType === 'Save') {
  //       onReturn(displayPictures.map((item)=>JSON.stringify(item)));
  //     } else {
  //       onReturn([]);
  //     }
  //   };

  //   const handleAddPicture = () => {
  //     const newPicture =   { name: pictureText, link: pictureLink } as Picture;

  //     setDisplayMessages([...displayMessages, newPicture]);
  //     setPictureLink('');
  //     setPictureText('');
  //   };

  const handleDeleteMessages = (index: number) => {
    const newMessages = [...displayMessages];
    newMessages.splice(index, 1);
    onMessageArrayChange([...newMessages]); 
  };

  if (!vis) return null;

  return (
    <AnimateModalLayout
      visibility={vis}
      onReturn={() => {
        onClose();
      }}
    >
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[450px]  flex justify-center items-center flex-col   md:w-[80svw] bg-lightMainBG dark:bg-darkMainBG h-[70svh] md:h-[85svh]
        }`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full   p-1   border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
        > 
            <h2 className="text-xl font-bold mb-4">Available messages</h2>

            <div className="w-full h-[66%] border border-black p-1 rounded-md overflow-y-auto relative">
              <div className="absolute top-0 left-0 flex flex-wrap items-center justify-start">
                {displayMessages.map((item, i) => (
                  <div
                    key={`messagecasting${i}`}
                    className="h-fit w-fit flex flex-col items-end justify-center"
                  >
                    <button
                      onClick={() => handleDeleteMessages(i)}
                      className="  w-10 h-10  outline-none border-none fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor"
                    >
                      <ShowIcon icon={'Close'} stroke={'2'} />
                    </button>
                    <button
                      className=" btnFancy min-h-[3rem] min-w-[3rem] cursor-pointer"
                      style={{ padding: 0 }}
                      onClick={()=>{onChange(item)}}
                    >
                      <p className="mt-1 w-[85%] text-center">{item}</p>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full flex flex-row items-center justify-center">
              <input
                type="text"
                placeholder="Enter message text" 
                defaultValue={message}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-[80%] p-2 border border-gray-300 rounded dark:bg-lightMainColor"
              />
                <button
                    onClick={() => { 
                        onMessageArrayChange([...displayMessages, messageText]);
 
                    }}
                    className="btnFancy  cursor-pointer">Add</button>
            </div> 
            <button
                    onClick={() => {  onChange(  messageText) }}
                    className="btnFancy  cursor-pointer">Display message</button>
        </div>
      </div>
    </AnimateModalLayout>
  );
};

export default ChooseMessageModal;
