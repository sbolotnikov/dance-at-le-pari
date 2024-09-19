'use client'

import React, { useEffect, useState } from 'react';
import ShowIcon from './svg/showIcon';
import { gsap } from '../utils/gsap';
import ImgFromDb from './ImgFromDb';
import { useDimensions } from '@/hooks/useDimensions';

 
type Props = {
  seconds: number;
  events: {
    date: string;
    tag: string;
    id: number | string;
    image: string;
    eventtype: string;
  }[]
};

const BannerGallery = ({ seconds, events }: Props) => {

  const [activePic, setActivePic] = useState(0);
  const [nextActivePic, setNextActivePic] = useState(1);
  const windowSize = useDimensions();
  const nextActive = (num: number) => {
    let timerInterval = setInterval(function () {
      clearInterval(timerInterval);
      let localPic = num;
      if (localPic < events!.length - 1) localPic++;
      else localPic = 0;
      setNextActivePic(localPic); 
      nextActive(localPic);
    }, seconds * 1000);
  };

 
  useEffect(() => {
    if (events?.length > 0) 
      nextActive(0);
    console.log(events)
  }, [events]); 
  useEffect(() => {
    if (events!= null ) { 
      let imgEl = document.getElementById(`image${activePic}`);
      if (imgEl) {
        imgEl.style.opacity = '1';
      }
      let imgEl1 = document.getElementById(`image${nextActivePic}`);
      if (imgEl1) {
        imgEl1.style.opacity = '0';
        imgEl1.style.display = 'block';
      }

      gsap
        .timeline()
        .to(imgEl, {
          opacity: 0,
          duration: seconds * 0.3,
          stagger: seconds * 0.1,
        })
        .then(() => {
          if (imgEl) imgEl.style.display = 'none';
        });

      gsap
        .timeline()
        .to(imgEl1, {
          opacity: 1,
          duration: seconds * 0.3,
          stagger: seconds * 0.2,
        })
        .then(() => {
          if (imgEl) imgEl.style.display = 'block';
          setActivePic(nextActivePic);
        });
    // } else setFirstTime(false);
  }
  }, [nextActivePic]);
  return (
    <div
      id="galleryContainer"
      className=" h-full w-full relative overflow-hidden rounded-md flex flex-col  "
      style={{ zIndex: 99 }}
    > 
    
      { events.map((item, index) => (
        <div
          key={'img' + index}
          id={'image' + index}
          className={`h-full w-screen flex flex-row justify-start items-start absolute top-0 left-0 cursor-pointer `}
          style={{ display: index !== activePic ? 'none' : 'block' }}
          onClick={() => {
            if (typeof(events![activePic].id)=="number")
            location.replace('/events/' + events![activePic].id)
          else 
          location.replace(events![activePic].id)
          }}
        >
          <div className='h-full w-fit m-auto relative'>
         {typeof(events![activePic].id)=="number" ?<ImgFromDb stylings={"object-contain h-full"} url={item.image} alt={'Event Picture' + index} />  :
          <img
             src={ item.image}
             className="object-contain h-full"
             alt={'Event Picture' + index}
           /> 
           }
         <button 
        className=" absolute top-6 -right-16  cursor-pointer  "
        style={{ transform: 'translate(0%, -50%)' }}
        onClick={() => {
          if (typeof(events![activePic].id)=="number")
            location.replace('/events/' + events![activePic].id)
          else 
          location.replace(events![activePic].id)
        }}
      >
         
      </button>
      </div>
          <h2
            id={'text_' + index}
            className={`w-full  text-center text-xs md:text-base absolute bottom-0 right-0 z-100 bg-lightMainBG/70 dark:bg-darkMainBG/70`}
            style={{ display: index !== activePic ? 'none' : 'block' }}
          >
            {(typeof(events![activePic].id)=="number")? item.tag +  `${(windowSize.width!>767)?' Join us on':''} ${(windowSize.width!>767)? new Date(item.date).toLocaleDateString('en-us', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }) : new Date(item.date).toLocaleDateString('en-us', {
                weekday: 'short',
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              })} @ ${new Date(item.date).toLocaleTimeString('en-US', {
                timeStyle: 'short',
              })}` :item.tag
            }
          </h2>
        </div>
      ))}

      <button
        id="nextButton"
        className=" absolute top-1/2 right-0 cursor-pointer "
        style={{ transform: 'translate(0%, -50%)' }}
        onClick={() => {
          if (activePic < events!.length - 1) setNextActivePic(activePic + 1);
          else setNextActivePic(0);
        }}
      >
        <div className="mr-2 h-8 w-8 md:h-16 md:w-16 fill-darkMainColor dark:stroke-darkMainColor dark:fill-lightMainColor stroke-lightMainColor  hover:scale-125">
          <ShowIcon icon={'ArrowRight'} stroke={'.1'} />
        </div>
      </button>
      <button
        id="prevButton"
        className=" absolute top-1/2 left-0 cursor-pointer hover:scale-125 "
        style={{ transform: 'translate(0%, -50%)' }}
        onClick={() => {
          if (activePic > 0) setNextActivePic(activePic - 1);
          else setNextActivePic(events!.length - 1);
        }}
      >
        <div className="ml-1 h-8 w-8 md:h-16 md:w-16  fill-darkMainColor dark:stroke-darkMainColor dark:fill-lightMainColor stroke-lightMainColor  hover:scale-125">
          <ShowIcon icon={'ArrowLeft'} stroke={'.1'} />
        </div>
      </button>
      
    </div>
  );
};
export default BannerGallery;
export const dynamic = 'force-dynamic'