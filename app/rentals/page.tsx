'use client';
import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/page-wrapper';
import Image from 'next/image';

import Gallery from '@/components/gallery';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  // const router = useRouter();
  const [revealGallery, setRevealGallery] = useState(false);
  const el = document.querySelector('#mainPage');
  const picturesArray = [
    '/images/Main ballroom -  side view.webp',
    '/images/Main ballroom - table view.webp',
    '/images/Table arrangements.webp',
    '/images/Front view from road (outside).webp',
    '/images/Parking lot (Back of the Building).webp',
    '/images/Main Ballroom-entrance view.webp',
    '/images/Fitness Room (Studio A).webp',
    '/images/Front Room (Studio B).webp',
    '/images/Kitchen.webp',
  ];
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {/* {revealAlert && <AlertMenu onReturn={onReturn} styling={alertStyle} />} */}
      {revealGallery && (
        <div
          className="w-[100vw] h-[100vh] absolute flex justify-center items-center bg-slate-500/70 left-0 z-[1001] backdrop-blur-md"
          style={{ top: el!.scrollTop }}
        >
          <div className="relative h-full w-full">
            <button
              className={`absolute top-0 right-0 m-4 bg-lightMainBG/70 dark:bg-darkMainBG/70 origin-center cursor-pointer z-10 `}
              onClick={() => {
                setRevealGallery(false);
              }}
            >
              {'x'}
            </button>
            <Gallery
              pictures={picturesArray}
              auto={false}
              seconds={0}
              width={'100vw'}
              height={'100vh'}
            />
          </div>
        </div>
      )}
      <div className="border-0 rounded-md p-4  shadow-2xl w-[90%] max-w-[450px] flex justify-center items-center flex-col  h-[90%] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md">
        <h2
          className="text-center font-bold uppercase"
          style={{ letterSpacing: '1px' }}
        >
          Rentals
        </h2>
        <div
          className="cursor-pointer"
          onClick={() => {
            setRevealGallery(true);
          }}
        >
          {!revealGallery && (
            <Gallery
              pictures={picturesArray}
              auto={true}
              seconds={7}
              width={'300px'}
              height={'300px'}
            />
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
