'use client';

import AnimateModalLayout from '@/components/AnimateModalLayout';
import React, { useState, useEffect } from 'react';

type Props = {
  vis: boolean;
  onSelectEmail: (email: string) => void;
  onClose: () => void;
};

const EmailSubscribeModal = ({ vis, onSelectEmail, onClose }: Props) => {
  const [email1, setEmail1] = useState('');

  useEffect(() => {
    if (vis) {
      // Reset color when modal opens
    }
  }, [vis]);
  return (
    <AnimateModalLayout
      visibility={vis}
      onReturn={() => {
        onClose();
      }}
    >
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[800px]  flex justify-center items-center flex-col bg-lightMainBG dark:bg-darkMainBG h-[70svh]
      }`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative  p-1  overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
        >
          <div
            id="containedDiv"
            className={`absolute inset-0 flex flex-col w-full p-1 justify-center items-center`}
          >
            <h1 className="text-center text-4xl font-black">Please subcribe to our newsletter</h1>
            <input
              type="email1"
              value={email1}
              onChange={(e) => setEmail1(e.target.value)}
              className="w-full h-12 m-4"
            />
          
          <div
            className="btnFancy"
            onClick={() => {
              onSelectEmail(email1);
              onClose();
            }}
          >
            Subscribe
          </div>
          </div>
        </div>
      </div>
    </AnimateModalLayout>
  );
};

export default EmailSubscribeModal;
