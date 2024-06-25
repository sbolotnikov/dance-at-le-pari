'use client';
import { useEffect, useState } from 'react';
import DocViewer, { PDFRenderer } from 'react-doc-viewer';
import { AnimatePresence, motion } from 'framer-motion';
type DisplayType = {
  onReturn: () => void;
};

export default function PDFDisplay({ onReturn }: DisplayType) {
  // main popup alert component
  // DO NOT FORGET TO NAME main tag id="mainPage"
  const docs = [
    { uri: '../lp_terms.pdf' }, // Local File
  ];
  const el = document.querySelector('#mainPage');
  const [isVisible, setIsVisible] = useState(true);
  function StopScroll() {
    // prevent scrolling
    var x = 0;
    var y = el!.scrollTop;
    window.onscroll = function () {
      window.scrollTo(x, y);
    };
  }
  function AllowScroll() {
    // when done release scroll
    window.onscroll = function () {};
  }

  useEffect(() => {
    // setup buttons style on load
    StopScroll();
  }, []);
  return (
    <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, x: -600 }}
        transition={{
          ease: 'easeOut',
          duration: 1,
          times: [0, 0.2, 0.5, 0.8, 1],
        }}
        animate={{
          opacity: [0, 1, 1, 1, 1],
          rotateX: ['90deg', '89deg', '89deg', '0deg', '0deg'],
          x: ['-100vw', '0vw', '0vw', '0vw', '0vw'],
        }}
        exit={{
          opacity: [1, 1, 1, 1, 0],
          rotateX: ['0deg', '0deg', '89deg', '89deg', '90deg'],
          x: ['0vw', '0vw', '0vw', '0vw', '-100vw'],
        }}
        className="blurFilter w-[100vw] h-[100svh] absolute flex flex-col justify-center items-center bg-slate-500/70 left-0 z-[1001]"
        style={{ top: el!.scrollTop }}
      >
 
 
        <div className="m-auto  max-w-[600px]  border-2 border-solid border-gray-400 rounded-md w-[97%] p-2 flex flex-col content-evenly">
          {/* <DocViewer pluginRenderers={[PDFRenderer]} documents={docs} /> */}
          <button
            className="px-1 py-2 border-2 border-solid border-transparent rounded-sm w-full m-1 text-center "
            onClick={() => {
                AllowScroll();
                setIsVisible(false);
                onReturn();
              }}
          >
            Back
          </button>
        </div>
      </motion.div>)}
      </AnimatePresence>
  )
}
