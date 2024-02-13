'use client';
import { useEffect } from 'react';
import DocViewer, { PDFRenderer } from "react-doc-viewer";

type DisplayType = {
  onReturn: () => void;
};

export default function PDFDisplay(props: DisplayType) {
  // main popup alert component
  // DO NOT FORGET TO NAME main tag id="mainPage"
  const docs = [
    { uri: "../lp_terms.pdf" }, // Local File
  ];
  const el = document.querySelector('#mainPage');

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
    <div
      className="w-[100vw] h-[100vh] absolute flex justify-center items-center bg-slate-500/70 left-0 z-[1001] backdrop-blur-md"
      style={{ top: el!.scrollTop }}
    >
      <div className="m-auto  max-w-[600px] bg-gray-200 border-2 border-solid border-gray-400 rounded-md w-[97%] p-2 flex flex-col content-evenly">
  


      <DocViewer
  pluginRenderers={[PDFRenderer]}
  documents={docs}
/>;



        <button
          className="px-1 py-2 border-2 border-solid border-transparent rounded-sm w-full m-1 text-center "
          onClick={(e) => {
            AllowScroll();
            props.onReturn();
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}
