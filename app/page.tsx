'use client';
import Image from 'next/image';
import Link from 'next/link';
import { PageWrapper } from '@/components/page-wrapper';
import { useContext, useEffect, useState } from 'react';
import BannerGallery from '@/components/BannerGallery';
import { ScreenSettingsContextType } from '@/types/screen-settings';
import { SettingsContext } from '@/hooks/useSettings';
import { useDimensions } from '@/hooks/useDimensions';

var departmentsArray = [
  { name: 'Studio', path: '/images/ballroom.jpg', link: '/about_us/welcome' },
  { name: 'Calendar', path: '/images/calendar.jpg', link: '/calendar' },
  {
    name: 'Dancing',
    path: '/images/social.jpg',
    link: '/dancing/private-lessons',
  },
  {
    name: 'Wedding Dance',
    path: '/images/weddingcouple.jpg',
    link: '/weddings',
  },
  { name: 'Dance Blog', path: '/images/style.jpg', link: '/blog/0' },
  {
    name: 'Competitive Dance',
    path: '/images/competitive.jpg',
    link: '/competition',
  },
];
const ContainerLoaded = () => {
  function degrees_to_radians(degrees: number) {
    // Store the value of pi.
    var pi = Math.PI;
    // Multiply degrees by pi divided by 180 to convert to radians.
    return degrees * (pi / 180);
  }
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const windowSize = useDimensions();
  useEffect(() => {
    setContainerSize({
      width: document.getElementById('containerBig')?.offsetWidth!,
      height: document.getElementById('containerBig')?.offsetHeight!,
    });
  }, [windowSize.width]);
  return (
    <div
      id="containerBig"
      className=" w-full h-full relative  flex justify-center items-center  overflow-auto"
    >
      <div
        id="text"
        className="blurFilter centerOrigin bgGradientSize50 cards__item    text-lightMainColor bg-lightMainBG/60 dark:text-darkMainColor dark:bg-darkMainBG/60  shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2"
      >
        <h1
          className={`font-bold   text-franceBlue  text-center font-DancingScript text-shadow  dark:text-shadow-light p-3 `}
          style={{ fontSize: `45px`, lineHeight: '0.75' }}
        >
          Dance at Le Pari
        </h1>
        <p
          className="text-center  text-shadow  dark:text-shadow-light"
          style={{ fontSize: `22px` }}
        >
          {' '}
          The place that brings People <br /> together through Dancing
        </p>
        <p className="text-center md:text-xl text-lg">
          Best viewed in fullscreen mode
        </p>
      </div>
      {containerSize.width &&
        departmentsArray.map((item, index) => {
          return (
            <Link
              key={'Links' + index}
              href={item.link}
              className={`absolute -top-[${
                Math.round(containerSize.height! / 6) > 260
                  ? 130
                  : Math.round(containerSize.height! / 6)
              }px] -left-[${
                Math.round(containerSize.width! / 5.5) > 260
                  ? 130
                  : Math.round(containerSize.width! / 11)
              }px] flex flex-col justify-between items-center`}
            >
              <div
                className={`cards__item    p-2 max-w-[260px] flex flex-col justify-start  items-center shadow-2xl shadow-lightMainColor rounded-md border-2`}
                style={
                  {
                    width: Math.round(containerSize.width! / 5.5) + 'px',
                    height: Math.round(containerSize.height! / 3) + 'px',
                    maxHeight: '260px',
                    backgroundImage: `url(${item.path})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    '--item-x':
                      Math.round(
                        (containerSize.width / 2.4) *
                          Math.cos(
                            degrees_to_radians(
                              (index * 360) / departmentsArray.length - 240
                            )
                          )
                      ) + 'px',
                    '--item-y':
                      Math.round(
                        (containerSize.height /
                          (containerSize.height > containerSize.width
                            ? 2.5
                            : 2.5)) *
                          Math.sin(
                            degrees_to_radians(
                              (index * 360) / departmentsArray.length - 240
                            )
                          )
                      ) + 'px',
                  } as React.CSSProperties
                }
              >
                <div className="w-full rounded-md  text-xl  text-center   text-shadow  dark:text-shadow-light text-lightMainColor bg-lightMainBG/80  dark:text-darkMainColor dark:bg-darkMainBG/80  dark:shadow-darkMainColor">
                  {item.name}
                </div>
              </div>
            </Link>
          );
        })}
    </div>
  );
};

export default function Home() {
  // const [events, setEvents] = useState<TEventArray | null>(null);
  const { events } = useContext(SettingsContext) as ScreenSettingsContextType;
  const windowSize = useDimensions();
  const [bigScreen, setBigScreen] = useState(false);

  useEffect(() => {
    if (windowSize.width !== undefined) {
      windowSize.width! > 700 && windowSize.height! > 560
        ? setBigScreen(true)
        : setBigScreen(false);
    }
  }, [windowSize.width]);

  return (
    <PageWrapper className="absolute inset-0 flex flex-col justify-start items-center mt-10 md:mt-20 ">
      <div className="w-full h-1/5 relative overflow-auto   rounded-md">
        {events != undefined && (
          <BannerGallery
            events={[
              ...events,
              {
                date: '',
                tag: 'Give a Gift of Dance!',
                id: '/gift',
                image:'/images/couple.webp',
                eventtype: '',
              },
            ]}
            seconds={10}
          />
        )}
      </div>
      {!bigScreen && (
        <div
          id="text"
          className="blurFilter  text-lightMainColor   dark:text-darkMainColor   mt-3 p-3 md:p-4 shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2"
        >
          <h1 className="font-bold text-5xl md:text-7xl text-franceBlue  text-center font-DancingScript text-shadow  dark:text-shadow-light ">
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
          <div className="absolute top-0 left-0 w-full min-h-full min-w-full  flex flex-col justify-center items-center md:flex-row md:ml-12">
            {departmentsArray.map((item, index) => {
              return (
                <Link key={'Links' + index} href={item.link}>
                  <div className="blurFilter w-[230px] m-3 p-2  flex flex-col justify-center items-center text-lightMainColor bg-lightMainBG/75 dark:text-darkMainColor dark:bg-darkMainBG/75    shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2">
                    <h1 className=" text-2xl text-center   text-shadow  dark:text-shadow-light ">
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
          <div className="w-full h-full absolute  top-0 left-0 ">
            <ContainerLoaded />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
export const dynamic = 'force-dynamic';
