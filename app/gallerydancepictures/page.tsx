'use client';
import { FC, useState, useEffect, useContext } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import { ScreenSettingsContextType} from '@/types/screen-settings';
import SharePostModal from '@/components/SharePostModal';
import ShowIcon from '@/components/svg/showIcon';
import { SettingsContext } from '@/hooks/useSettings';
import BannerGallery from '@/components/BannerGallery';
import { fetchInstagramPosts } from '@/utils/functions';


interface InstagramPost {
    id: string;
    media_url: string;
    permalink: string;
}


interface pageProps {}

const page: FC<pageProps> = ({}) => {
   
  const [revealSharingModal, setRevealSharingModal] = useState(false);
  const { events } = useContext(SettingsContext) as ScreenSettingsContextType;
  
  const [posts, setPosts] = useState<InstagramPost[]>([]);
    const accessToken = 'YOUR_INSTAGRAM_ACCESS_TOKEN';
  
    useEffect(() => {
        fetchInstagramPosts().then((posts:InstagramPost[]) => {
            setPosts(posts)
           }).catch((error) => {
             
            console.log(error);
          })
    }, []); 
  
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
        url={process.env.NEXT_PUBLIC_URL + '/gallerydancepictures'}
        quote={`Description:  Studio pictures gallery  \n Click on the link below. \n`}
        hashtag={' Gallery PictureGallery DanceLePariDanceCenter'}
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
              Dance Pictures Gallery
            </h2>

            <div className=" h-32 w-32 m-auto">
              <ShowIcon icon={'Gallery'} stroke={'0.05'} />
            </div>
            <button
              className=" outline-none border-none absolute right-0 top-0  rounded-md  mt-2  w-8 h-8"
              onClick={(e) => {
                e.preventDefault();
                setRevealSharingModal(!revealSharingModal);
                return;
              }}
            >
              <ShowIcon icon={'Share'} stroke={'2'} />
            </button>
            <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Instagram Gallery</h1>
                <div className="w-full grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {posts.map((post) => (
                <div key={post.id} className="relative">
                    <a href={post.permalink} target="_blank" rel="noopener noreferrer">
                        <img src={post.media_url} alt="Instagram Post" className="w-full h-full object-cover rounded-lg shadow-lg" />
                    </a>
                </div>
                ))}
                </div>
            </div>
          </div>
        </div>
       </div> 
    </PageWrapper>
  );     
}

export default page;