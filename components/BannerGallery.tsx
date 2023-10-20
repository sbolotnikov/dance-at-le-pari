'use client'
import { TEvent, TEventArray } from '@/types/screen-settings';
import React, { useEffect, useState } from 'react';
import ShowIcon from './svg/showIcon';
import { gsap } from '../utils/gsap';

 
type Props = {
  seconds: number;
  events: TEventArray
};

const BannerGallery = ({ seconds, events }: Props) => {

  const [activePic, setActivePic] = useState(0);
  const [nextActivePic, setNextActivePic] = useState(1);
  const nextActive = (num: number) => {
    let timerInterval = setInterval(function () {
      clearInterval(timerInterval);
      let localPic = num;
      if (localPic < events!.length - 1) localPic++;
      else localPic = 0;
      setNextActivePic(localPic);
      console.log("old Next:"+nextActivePic+"new "+localPic)
      nextActive(localPic);
    }, seconds * 1000);
  };

 
  useEffect(() => {
      nextActive(0);
    
  }, []);
  console.log(events)
  useEffect(() => {
    if (events!= null ) {
    // if (!firstTime) {
      console.log("nextactivepic in Effect "+nextActivePic)
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
      style={{ zIndex: 300 }}
    >
      { events.map((item, index) => (
        <div
          key={'img' + index}
          id={'image' + index}
          className={`h-full w-screen flex flex-row justify-start items-start absolute top-0 left-0  `}
          style={{ display: index !== activePic ? 'none' : 'block' }}
        >
          <div className='h-full w-fit m-auto relative'>
          <img
            src={ item.image}
            className="object-contain h-full"
            alt={'Event Picture' + index}
          />
         <button 
        className=" absolute top-8 -right-16  cursor-pointer  "
        style={{ transform: 'translate(0%, -50%)' }}
        onClick={() => {
          window.location.replace('/events/' + events![activePic].id);
        }}
      >
        <div className="text-lg italic  hover:scale-125  dark:fill-darkMainColor dark:stroke-darkMainColor fill-lightMainColor stroke-lightMainColor flex flex-row justify-between items-center">
          <div className=" h-4 w-4">
            <ShowIcon icon={'Info'} stroke={'.5'} />
          </div>
        <h2>info</h2> 
        </div>
      </button>
      </div>
          <h2
            id={'text_' + index}
            className={`w-full  text-center absolute bottom-0 right-0 z-100 bg-lightMainBG/70 dark:bg-darkMainBG/70`}
            style={{ display: index !== activePic ? 'none' : 'block' }}
          >
            {item.tag +
              ' Join us on ' +
              new Date(item.date).toLocaleDateString('en-us', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }) +
              ' at ' +
              new Date(item.date).toLocaleTimeString('en-US', {
                timeStyle: 'short',
              })}
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