'use client';

import React, { useEffect, useState, useCallback } from 'react';
import ShowIcon from './svg/showIcon';
import { gsap } from '../utils/gsap';
import ImgFromDb from './ImgFromDb';
import { useDimensions } from '@/hooks/useDimensions';
import Image from 'next/image';
import { sleep } from 'openai/core';


type Event = {
  date: string;
  tag: string;
  id: number | string;
  image: string;
  eventtype: string;
};

type Props = {
  seconds: number;
  events: Event[];
};

const BannerGallery = ({ seconds, events }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [startRolling, setStartRolling] = useState(true)
  const windowSize = useDimensions();

  const transitionToNextImage = useCallback(() => {
    const next = (currentIndex + 1) % events.length;
    setNextIndex(next);

    const currentImg = document.getElementById(`image${currentIndex}`);
    const nextImg = document.getElementById(`image${next}`);

    if (currentImg && nextImg) {
      gsap.set(nextImg, { display: 'block', opacity: 0 });
      gsap.to(currentImg, { opacity: 0, duration: seconds * 0.5 });
      gsap.to(nextImg, { opacity: 1, duration: seconds * 0.5 });

      setTimeout(() => {
        gsap.set(currentImg, { display: 'none' });
        setCurrentIndex(next);
      }, seconds * 500);
    }
  }, [currentIndex, events.length, seconds]);

  useEffect(() => {
    if (events.length > 0) {
      const timer = setInterval(transitionToNextImage, seconds * 1000);
      return () => clearInterval(timer);
    }
  }, [events, seconds, transitionToNextImage]);

  const handleImageClick = () => {
    const eventId = events[currentIndex].id;
    location.replace(
      typeof eventId === 'number' ? `/events/${eventId}` : eventId
    );
  };
  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions =
      windowSize.width! > 767
        ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        : {
            weekday: 'short',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          };
    return new Date(date).toLocaleDateString('en-us', options);
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', { timeStyle: 'short' });
  };

  return (
    <div
      id="galleryContainer"
      className="h-full w-full relative overflow-hidden rounded-md flex flex-col"
      style={{ zIndex: 99 }}
    >  
    {events.map((item, index) => (
        <div
          key={`img${index}`}
          id={`image${index}`}
          className="h-full w-screen flex flex-row justify-start items-start absolute top-0 left-0 cursor-pointer"
          style={{
            display: index === currentIndex ? 'block' : 'none',
            opacity: index === currentIndex ? 1 : 0,
          }}
          onClick={handleImageClick}
        >
          {item.id !== undefined &&
            windowSize.width! > 767 &&
            (typeof item.id === 'number' ? (
              <div className="h-full w-fit m-auto relative">
                <ImgFromDb
                  stylings="object-contain  h-full"
                  url={item.image}
                  alt={`Event Picture ${item.id}`}
                />
              </div>
            ) : (
              <div className="h-full w-full m-auto relative">
                <Image
                  src={item.image}
                  alt={`Event Picture ${item.id}`}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            ))}
          <div className={`w-full ${windowSize.width! > 767?'absolute bottom-0 right-0':'h-full flex justify-center items-center'}`}>  
          
            {typeof item.id === 'number'
              ? <h2 className={`w-full text-center text-xs md:text-base ${windowSize.width! > 767 ? "":"flex flex-col justify-center items-center"} z-100 bg-lightMainBG/70 dark:bg-darkMainBG/70`}>
                <span className={`${windowSize.width! > 767 ? "":"font-DancingScript text-2xl text-center max-w-[80%] text-red-600 animate-pulse text-shadow  dark:text-shadow-light"}`}>{item.tag}</span> 
                <span>{windowSize.width! > 767 ? ' Join us on ' : ''}</span> 
                <span>{formatDate(item.date)} @ {formatTime(item.date)}</span>
                </h2>  
              : <h2 className={`w-full text-center ${windowSize.width! > 767 ? "":"font-DancingScript text-red-600 animate-pulse text-shadow  dark:text-shadow-light"} text-2xl md:text-base  z-100 bg-lightMainBG/70 dark:bg-darkMainBG/70`}>{item.tag}</h2>
              }
          
          </div>
        </div>
      ))}
      <NavigationButton
        direction="next"
        onClick={() => transitionToNextImage()}
      />
      <NavigationButton
        direction="prev"
        onClick={() => {
          const prev = (currentIndex - 1 + events.length) % events.length;
          setNextIndex(prev);
          transitionToNextImage();
        }}
      />
    </div>
  );
};

const NavigationButton = ({
  direction,
  onClick,
}: {
  direction: 'next' | 'prev';
  onClick: () => void;
}) => (
  <button
    className={`absolute top-1/2 ${
      direction === 'next' ? 'right-0' : 'left-0'
    } cursor-pointer hover:scale-125`}
    style={{ transform: 'translate(0%, -50%)' }}
    onClick={onClick}
  >
    <div
      className={`${
        direction === 'next' ? 'mr-2' : 'ml-1'
      } h-8 w-8 md:h-16 md:w-16 fill-darkMainColor dark:stroke-darkMainColor dark:fill-lightMainColor stroke-lightMainColor`}
    >
      <ShowIcon
        icon={direction === 'next' ? 'ArrowRight' : 'ArrowLeft'}
        stroke=".1"
      />
    </div>
  </button>
);

export default BannerGallery;
export const dynamic = 'force-dynamic';
