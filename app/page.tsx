'use client';
import Image from 'next/image';
import Link from 'next/link';
import { PageWrapper } from '@/components/page-wrapper';
import { useContext } from 'react';
import BannerGallery from '@/components/BannerGallery';
import { ScreenSettingsContextType } from '@/types/screen-settings';
import { SettingsContext } from '@/hooks/useSettings';

export default function Home() {
  // const [events, setEvents] = useState<TEventArray | null>(null);
  const { events } = useContext(
    SettingsContext
  ) as ScreenSettingsContextType;
 
  
  // {date:"2023-10-19T20:00",eventtype:"Party",id: 43, image:"cln5j37qp0000sl0g8xip7j0p",tag:"East Coast Swing" }
  let departmentsArray = [
    { name: 'Calendar', path: '/images/calendar.jpg', link: '/calendar' },
    { name: 'Activities', path: '/images/social.jpg', link: '/dancing' },
    {name: 'Wedding Dance', path: '/images/weddingcouple.jpg', link: '/wedding',}, 
    { name: 'Studio', path: '/images/ballroom.jpg', link: '/about_us/0' },     
    { name: 'Competitive Dance', path: '/images/competitive.jpg', link: '/competition',}, 
  ];
 
  return (
    <PageWrapper className="absolute inset-0 flex flex-col justify-start items-center mt-10 md:mt-20 ">
     
      <div className="w-full h-1/5 relative overflow-auto   rounded-md">    
        {(events!=undefined) &&<BannerGallery events={events} seconds={10}/>}
      </div>  
      <div
        id="text"
        className="text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG mt-3 p-1 md:p-4 shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2"
      >
        <h1 className="font-bold text-5xl md:text-7xl text-franceBlue  text-center font-DancingScript text-shadow  dark:text-shadow-light  ">
        Dance at Le Pari
        </h1>
        <p className="text-center md:text-2xl text-xl text-shadow  dark:text-shadow-light"> The place that brings People <br/> together through Dancing</p>
      </div>
 
      <div className="w-full h-full relative  mb-12 overflow-y-auto ">
        <div className="absolute top-0 left-0 w-full min-h-full  flex flex-col justify-center items-center md:flex-row ">
          {departmentsArray.map((item, index) => {
            return (
              <Link key={'Links' + index} href={item.link}>
                <div className="m-3 p-2  flex flex-col justify-center items-center text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG    shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2">
                  <h1 className=" text-2xl  text-center   text-shadow  dark:text-shadow-light ">
                    {item.name}
                  </h1>
                  
                  <Image 
                    className="rounded-md overflow-hidden "
                    src={item.path}
                    width={250}
                    height={250} 
                    alt="Logo"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      
    </PageWrapper>
  );
}
export const dynamic = 'force-dynamic'