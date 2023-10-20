'use client';
import Image from 'next/image';
import Link from 'next/link';
import { PageWrapper } from '@/components/page-wrapper';
import ShowIcon from '@/components/svg/showIcon';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ChooseTemplates from '@/components/ChooseTemplates';
import BannerGallery from '@/components/BannerGallery';
import { TEventArray } from '@/types/screen-settings';

export default function Home() {
  const [events, setEvents] = useState<TEventArray | null>(null);
  useEffect(() => {
    fetch('/api/get_front_events', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); 
        setEvents(data)  
      }).catch((error) => {console.log(error);})
  }, []);
  const { data: session } = useSession();
  
  // {date:"2023-10-19T20:00",eventtype:"Party",id: 43, image:"cln5j37qp0000sl0g8xip7j0p",tag:"East Coast Swing" }
  let departmentsArray = [
    {name: 'Wedding Dance', path: '/images/weddingcouple.jpg', link: '/wedding',},
    { name: 'Social Dancing', path: '/images/social.jpg', link: '/social' },
    { name: 'Competitive Dance', path: '/images/competitive.jpg', link: '/competition',},
    { name: 'Studio', path: '/images/ballroom.jpg', link: '/rentals' },
    { name: 'Calendar', path: '/images/calendar.jpg', link: '/calendar' },
  ];
 
  return (
    <PageWrapper className="absolute inset-0 flex flex-col justify-start items-center mt-10 md:mt-20 ">
     
      <div className="w-full h-1/3 relative overflow-auto   rounded-md">    
        {(events!=null) &&<BannerGallery events={events} seconds={10}/>}
      </div>  
      <div
        id="text"
        className="text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG mt-3 shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2"
      >
        <h1 className="font-bold text-5xl text-franceBlue  text-center font-DancingScript text-shadow  dark:text-shadow-light  ">
        Welcome to Dance At Le Pari
        </h1>
      </div>
 
      <div className="w-full h-full relative  mb-12 overflow-y-auto ">
        <div className="absolute top-0 left-0 w-full min-h-full flex flex-col justify-center items-center md:flex-row">
          {departmentsArray.map((item, index) => {
            return (
              <Link key={'Links' + index} href={item.link}>
                <div className="m-3 p-2  flex flex-col justify-center items-center text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG    shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2">
                  <h1 className=" text-2xl   text-center   text-shadow  dark:text-shadow-light ">
                    {item.name}
                  </h1>
                  <Image
                    className="rounded-md overflow-hidden "
                    src={item.path}
                    width={300}
                    height={300}
                    // style={{objectFit: "contain"}}
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