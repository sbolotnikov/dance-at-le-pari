import React from 'react'
import Gallery from './gallery';

type Props = {
    pictures: string[];
    onReturn: () => void
}

const FullScreenGalleryView = ({pictures, onReturn}: Props) => {
    let el = document.querySelector('#mainPage');
  return (
    <div
    className="w-[100vw] h-[100vh] absolute flex justify-center items-center bg-slate-500/70 left-0 z-[1001] backdrop-blur-md"
    style={{ top: el!.scrollTop }}
  >
    <div className="relative h-full w-full">
      <button
        className={`absolute top-0 right-0 m-4 bg-lightMainBG/70 dark:bg-darkMainBG/70 origin-center cursor-pointer z-10 `}
        onClick={() => {
          onReturn();
        }}
      >
        {'x'}
      </button>
      <Gallery
        pictures={pictures}
        auto={false}
        seconds={0}
        width={'100vw'}
        height={'100vh'}
      />
    </div>
  </div>
  )
}

export default FullScreenGalleryView