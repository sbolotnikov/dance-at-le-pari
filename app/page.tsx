'use client';
import Image from 'next/image';
import Link from 'next/link';
import { PageWrapper } from '@/components/page-wrapper';
import { useContext, useEffect, useState } from 'react';
import BannerGallery from '@/components/BannerGallery';
import { ScreenSettingsContextType } from '@/types/screen-settings';
import { SettingsContext } from '@/hooks/useSettings';
import { useDimensions } from '@/hooks/useDimensions';
import { Divider } from 'react-square-web-payments-sdk';

export default function Home() {
  // const [events, setEvents] = useState<TEventArray | null>(null);
  const { events } = useContext(SettingsContext) as ScreenSettingsContextType;
  const windowSize = useDimensions();
  const [bigScreen, setBigScreen] = useState(false);
  useEffect(() => {
    if (windowSize.width !== undefined) {
      windowSize.width! > 1023 && windowSize.height! > 767
        ? setBigScreen(true)
        : setBigScreen(false);
    }
    console.log((windowSize.height! * 4) / 5 / 3);
  }, [windowSize.width]);
  function degrees_to_radians(degrees: number) {
    // Store the value of pi.
    var pi = Math.PI;
    // Multiply degrees by pi divided by 180 to convert to radians.
    return degrees * (pi / 180);
  }
  // {date:"2023-10-19T20:00",eventtype:"Party",id: 43, image:"cln5j37qp0000sl0g8xip7j0p",tag:"East Coast Swing" }
  let departmentsArray = [
    { name: 'Studio', path: '/images/ballroom.jpg', link: '/about_us/welcome' },
    { name: 'Calendar', path: '/images/calendar.jpg', link: '/calendar' },
    { name: 'Dancing', path: '/images/social.jpg', link: '/dancing' },
    {
      name: 'Wedding Dance',
      path: '/images/weddingcouple.jpg',
      link: '/wedding',
    },
    { name: 'Dance Blog', path: '/images/style.jpg', link: '/blog/0' },
    {
      name: 'Competitive Dance',
      path: '/images/competitive.jpg',
      link: '/competition',
    },
  ];

  return (
    <PageWrapper className="absolute inset-0 flex flex-col justify-start items-center mt-10 md:mt-20 ">
      <div className="w-full h-1/5 relative overflow-auto   rounded-md">
        {events != undefined && <BannerGallery events={events} seconds={10} />}
      </div>
      {!bigScreen && windowSize.height!>560  && (
        <div
          id="text"
          className="text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG mt-3 p-1 md:p-4 shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2"
        >
          <h1 className="font-bold text-5xl md:text-7xl text-franceBlue  text-center font-DancingScript text-shadow  dark:text-shadow-light  ">
            Dance at Le Pari
          </h1>
          <p className="text-center md:text-2xl text-xl text-shadow  dark:text-shadow-light">
            {' '}
            The place that brings People <br /> together through Dancing
          </p>
        </div>
      )}

      <div className="w-full h-full relative  mb-12 md:mb-0 overflow-y-auto  md:overflow-auto ">
        {!bigScreen ? (
          <div className="absolute top-0 left-0 w-full min-h-full min-w-full  flex flex-col justify-center items-center md:flex-row md:ml-[23rem]">
            {departmentsArray.map((item, index) => {
              return (
                <Link key={'Links' + index} href={item.link}>
                  <div className="w-[230px] m-3 p-2  flex flex-col justify-center items-center text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG    shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2">
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
        ) : (
          <div className=" w-full h-full absolute  top-0 left-0  min-h-[700px] min-w-[1000px]">
            <div className=" w-full h-full relative  flex justify-center items-center ">
              <div
                id="text"
                className="text-lightMainColor bg-lightMainBG/60 dark:text-darkMainColor dark:bg-darkMainBG/60 mt-3 p-1 md:p-4 shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2"
              >
                <h1 className="font-bold text-5xl md:text-7xl text-franceBlue  text-center font-DancingScript text-shadow  dark:text-shadow-light  ">
                  Dance at Le Pari
                </h1>
                <p className="text-center md:text-2xl text-xl text-shadow  dark:text-shadow-light">
                  {' '}
                  The place that brings People <br /> together through Dancing
                </p>
              </div>
              {departmentsArray.map((item, index) => {
                return (
                  <Link
                    key={'Links' + index}
                    href={item.link}
                    className="cards__item absolute top-[50%] left-[50%]"
                    style={
                      {
                        '--item-x':
                          Math.round(
                            250 *
                              Math.cos(
                                degrees_to_radians(
                                  (index * 360) / departmentsArray.length - 150
                                )
                              )
                          ) -
                          130 +
                          'px',
                        '--item-y':
                          Math.round(
                            400 *
                              Math.sin(
                                degrees_to_radians(
                                  (index * 360) / departmentsArray.length - 150
                                )
                              )
                          ) -
                          120 +
                          'px',
                      } as React.CSSProperties
                    }
                  >
                    <div
                      className={` w-[230px] p-2  flex flex-col justify-center  items-center text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG    shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2`}
                    >
                      
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
        )}
      </div>
    </PageWrapper>
  );
}
export const dynamic = 'force-dynamic';
