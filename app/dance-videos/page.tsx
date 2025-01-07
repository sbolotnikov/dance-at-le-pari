'use client';
import { FC, useState, useContext } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import { ScreenSettingsContextType} from '@/types/screen-settings';
import SharePostModal from '@/components/SharePostModal';
import ShowIcon from '@/components/svg/showIcon';
import { SettingsContext } from '@/hooks/useSettings';
import BannerGallery from '@/components/BannerGallery';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
   
  const [revealSharingModal, setRevealSharingModal] = useState(false);
  const { events } = useContext(SettingsContext) as ScreenSettingsContextType;
  
   
  
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex flex-col items-center  justify-start">
      <div className="w-full h-1/5 relative overflow-auto mt-1 md:mt-6  rounded-md">
        {events != undefined && (
          <BannerGallery events={[...events]} seconds={7} />
        )}
      </div>
      <SharePostModal
        title={
          'Page: Dance Pictures Gallery | Dance at Le Pari Studio'
        }
        url={process.env.NEXT_PUBLIC_URL + '/dance-videos'}
        quote={`Description:  Studio video gallery  \n Click on the link below. \n`}
        hashtag={' Videos VideoGallery DanceLePariDanceCenter'}
        onReturn={() => setRevealSharingModal(false)}
        visibility={revealSharingModal}
      />
       
      <div
        className="blurFilter border-0 rounded-md p-2  shadow-2xl w-[90%] h-[73svh]  max-w-[850px] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70  md:m-3"
        // style={{ boxShadow: '0 0 150px rgb(113, 113, 109 / 50%),inset 0 0 20px #242422' }}
      >
        <div className="w-full h-full border relative rounded-md border-lightMainColor dark:border-darkMainColor flex flex-col justify-center items-center overflow-y-auto">
          <div id="containedDiv" className="absolute top-0 left-0 w-full">
            <h2
              className="text-center font-semibold md:text-4xl uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Dance Video Gallery
            </h2>

            <div className=" h-32 w-32 m-auto">
              <ShowIcon icon={'VideoGallery'} stroke={'0.05'} />
            </div>
            <button
              className=" outline-none border-none absolute right-0 top-0  rounded-md  mt-2  w-8 h-8"
              aria-label='Share this page'
              onClick={(e) => {
                e.preventDefault();
                setRevealSharingModal(!revealSharingModal);
                return;
              }}
            >
              <ShowIcon icon={'Share'} stroke={'2'} />
            </button>
            <div className="w-full  text-center ">
                Under constraction...
            </div>
          </div>
        </div>
       </div> 
    </PageWrapper>
  );     
}

export default page;