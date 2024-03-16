'use client';
import { FC, useState } from 'react';
import Iframe from 'react-iframe';
import { PageWrapper } from '@/components/page-wrapper';
import { galeryPictures } from '@/utils/galeryPictures';

import Gallery from '@/components/gallery';
import FullScreenGalleryView from '@/components/fullScreenGalleryView';
import sleep from '@/utils/functions';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  // const router = useRouter();
  const [revealGallery, setRevealGallery] = useState(false);
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
        <FullScreenGalleryView
          pictures={picturesArray}
          onReturn={() => {
            sleep(1200).then(() => {
              setRevealGallery(false);
            });
          }}
        />
      )}
      <div className="border-0 rounded-md p-2 mt-8  shadow-2xl w-[90%] max-w-[450px] flex justify-center items-center flex-col  h-[70svh] md:h-[85svh] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md">
        <div className="w-full h-full relative  p-1 flex  overflow-y-scroll border border-lightMainColor dark:border-darkMainColor rounded-md">
          <div className="flex flex-col w-full p-1 justify-center items-center absolute top-0 left-0">
            <h2
              className="text-center font-bold uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Our Studio
            </h2>
            <div className="h-[300px] w-full">
              <Iframe
                url="https://www.youtube.com/embed/oiF1NnGzUiM?autoplay=1&amp;mute=1&amp;controls=1&amp;loop=0&amp;origin=https%3A%2F%2Fwww.leparidancenter.com&amp;playsinline=1&amp;enablejsapi=1&amp;widgetid=3"
                width="100%"
                height="100%"
                title="Best Dance Studio in New Jersey. Wedding event/ Special events rental.  Dance events in New Jersey."
                allowFullScreen
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                className=""
                display="block"
                position="relative"
              />
            </div>
            <div
              className="cursor-pointer h-[300px] w-[300px] mb-10"
              onClick={() => {
                setRevealGallery(true);
              }}
            >
              {!revealGallery && (
                <Gallery
                  pictures={galeryPictures}
                  auto={true}
                  seconds={8}
                  width={'300px'}
                  height={'300px'}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
