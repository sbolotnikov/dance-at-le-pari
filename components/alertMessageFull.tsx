'use client';
import { useEffect, useState } from 'react';
import AnimateModalLayout from './AnimateModalLayout';
import AnimateModalLayoutNew from './AnimatedModalLayoutNew';
// color schemas for different occasions

type AlertTypeLocal = {
  visibility: boolean;
  _html: string;
  onReturn: (val: string | null) => void;
};

export default function AlertMessageFull(props: AlertTypeLocal) {
  // main popup alert component
  // DO NOT FORGET TO NAME main tag id="mainPage"

  // const el = document.querySelector('#mainPage');
  const [isVisible, setIsVisible] = useState(props.visibility);
  const [scrollAmount, setScrollAmount] = useState(0);
 

  return (
 
        <AnimateModalLayoutNew
          visibility={isVisible}
          onReturn={() => {
            setIsVisible(false);
            props.onReturn(null);
          }}
        >
          
            <div className="bg-white dark:bg-darkMainBG p-4 rounded-md">
              <div
                dangerouslySetInnerHTML={{ __html: props._html }}
                className="text-gray-900 dark:text-darkMainColor"
              />
              {/* <button
                className="btnFancy mt-4"
                onClick={() => {
                  setIsVisible(false);
                  props.onReturn(null);
                  AllowScroll();
                }}
              >
                Close
              </button> */}
            </div>
        </AnimateModalLayoutNew>
  );
}
