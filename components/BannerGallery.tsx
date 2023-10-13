import { TEventArray } from '@/types/screen-settings';
import React, { useEffect, useState } from 'react';
import ShowIcon from './svg/showIcon';
import ImgFromDb from './ImgFromDb';
import { gsap } from '../utils/gsap';
import sleep from '@/utils/functions';

type Props = { 
  seconds: number;
};

const BannerGallery = ({ seconds }: Props) => {
  const getEvents = async () => {
    const res = await fetch('/api/get_front_events', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    setEvents(data)
  };
  const [events, setEvents] = useState<TEventArray>([])
  const [firstTime, setFirstTime] = useState(true);
  const [activePic, setActivePic] = useState(0);
  const [nextActivePic, setNextActivePic] = useState(0);
  const nextActive = (num: number) => {
    let timerInterval = setInterval(function () {
      clearInterval(timerInterval);
      let localPic = num;
      if (localPic < events.length - 1) localPic++;
      else localPic = 0;
      setNextActivePic(localPic);

      nextActive(localPic);
    }, seconds * 1000);
  };

  useEffect(() => {
    nextActive(0);
     getEvents()
    console.log(events);
  }, []);
  console.log(events);
  let counter = 0;
  useEffect(() => {
    if (!firstTime) {
      let el = document.getElementById('turbulence');
      let imgEl = document.getElementById(`image${activePic}`);
      if (imgEl) {
        imgEl.style.filter = 'url(#noise)';
        imgEl.style.opacity = '1';
      }
      let textEl = document.getElementById(`text_${activePic}`);
      let imgEl1 = document.getElementById(`image${nextActivePic}`);
      let textEl1 = document.getElementById(`text_${nextActivePic}`);
      gsap
        .timeline()
        .fromTo(
          el,
          { attr: { baseFrequency: '0' } },
          { attr: { baseFrequency: '0.1' }, duration: seconds }
        );

      gsap
        .timeline()
        .to(imgEl, {
          opacity: 0,
          duration: seconds * 0.8,
          stagger: seconds * 0.2,
        });
      gsap
        .timeline()
        .to(textEl, {
          opacity: 0,
          duration: seconds * 0.8,
          stagger: seconds * 0.2,
        });
      gsap
        .timeline()
        .to(textEl1, {
          opacity: 1,
          duration: seconds * 0.8,
          stagger: seconds * 0.6,
        });
      gsap
        .timeline()
        .to(imgEl1, {
          opacity: 1,
          duration: seconds * 0.8,
          stagger: seconds * 0.6,
        })
        .then(() => {
          if (imgEl) imgEl.style.filter = '';
          setActivePic(nextActivePic);
        });
    } else setFirstTime(false);
  }, [nextActivePic]);
  return (
    <div
      id="galleryContainer"
      className=" relative  h-full w-full rounded-md overflow-hidden flex justify-between items-center "
      style={{ zIndex: 300 }}
    >
      

      {events.map((item, index) => (
        <div key={'img' + index} id={'image' + index} className={`h-full w-full ${ (index !== activePic) ? 'hidden' : ''}`}>
        
            <ImgFromDb
              url={item.image}
              stylings="object-contain m-auto"
              alt={"Event Picture"+index}
            />
     
          <h2
            id={'text_' + index}
            className={`w-full  text-center absolute bottom-0 right-0 z-100 bg-lightMainBG/70 dark:bg-darkMainBG/70 ${
              index !== activePic ? 'opacity-0' : 'opacity-100'
            }`}
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
 
      <svg className="absolute inset-0 h-full w-full">
        <filter id="noise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            result="NOISE"
            baseFrequency="0"
            numOctaves="5"
            seed="2"
            id="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="NOISE"
            scale="20"
          ></feDisplacementMap>
        </filter>
      </svg>
      <button
        id="nextButton"
        className=" absolute top-1/2 right-0 cursor-pointer hover:scale-125 "
        style={{ transform: 'translate(0%, -50%)' }}
        onClick={() => {
          if (activePic < events.length - 1) setNextActivePic(activePic + 1);
          else setNextActivePic(0);
        }}
      >
        <div className="mr-2 h-8 w-8 md:h-16 md:w-16 fill-darkMainColor dark:stroke-darkMainColor dark:fill-lightMainColor stroke-lightMainColor">
          <ShowIcon icon={'ArrowRight'} stroke={'.1'} />
        </div>
      </button>
      <button
        id="prevButton"
        className=" absolute top-1/2 left-0 cursor-pointer hover:scale-125 "
        style={{ transform: 'translate(0%, -50%)' }}
        onClick={() => {
          if (activePic > 0) setNextActivePic(activePic - 1);
          else setNextActivePic(events.length - 1);
        }}
      >
        <div className="ml-1 h-8 w-8 md:h-16 md:w-16  fill-darkMainColor dark:stroke-darkMainColor dark:fill-lightMainColor stroke-lightMainColor">
          <ShowIcon icon={'ArrowLeft'} stroke={'.1'} />
        </div>
      </button>
      <button
        id="moreInfo"
        className=" absolute top-10 right-0 cursor-pointer hover:scale-125 "
        style={{ transform: 'translate(0%, -50%)' }}
        onClick={() => {
          window.location.replace("/events/"+events[activePic].id)
        }}
      >
        <div className="mr-2 h-8 w-8 md:h-16 md:w-16 fill-darkMainColor dark:stroke-darkMainColor dark:fill-lightMainColor stroke-lightMainColor">
          Info
        </div>
      </button>
    </div>
  );
};
export default BannerGallery;
