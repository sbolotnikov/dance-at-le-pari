'use client';
import { useEffect, useState } from 'react'; 
import AnimateModalLayout from './AnimateModalLayout';
type DisplayType = {
  onReturn: () => void;
};

export default function PDFDisplay({ onReturn }: DisplayType) {
  const el = document.querySelector('#mainPage');
  const [isVisible, setIsVisible] = useState(true);

  function StopScroll() {
    var x = 0;
    var y = el!.scrollTop;
    window.onscroll = function () {
      window.scrollTo(x, y);
    };
  }

  function AllowScroll() {
    window.onscroll = function () {};
  }

  useEffect(() => {
    StopScroll();
  }, []);

  return (
    <AnimateModalLayout
      visibility={isVisible}
      onReturn={() => {
        setIsVisible(false);
        onReturn();
      }}
    >
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-3xl  flex justify-center items-center flex-col bg-lightMainBG dark:bg-darkMainBG  h-[75svh] md:h-[85svh]`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative  p-1  overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
        >
          <div
            id="containedDiv"
            className={` absolute top-0 left-0  flex flex-col w-full h-full p-1 justify-center items-center`}
          >
            <iframe
              className="w-full h-3/4"
              src="https://dance-at-le-pari.vercel.app//lp_terms.pdf"
              width="100%"
              height="75%"
            ></iframe>
   
          </div>
        </div>
      </div>
    </AnimateModalLayout>
  );
}
