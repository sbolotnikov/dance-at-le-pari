import Image from 'next/image';
import { useEffect, useState } from 'react';
import { gsap } from '../utils/gsap';
type Props = {
  pictures: string[];
  auto: boolean;
  seconds: number;
  width: string;
  height:string;
};

const Gallery = ({ pictures, auto, seconds, width, height }: Props) => {
  const [firstTime, setFirstTime] = useState(true);
  const [activePic, setActivePic] = useState(0);
  const [nextActivePic, setNextActivePic] = useState(0);
  const nextActive=(num:number)=>{
    let timerInterval = setInterval(function () {
        clearInterval(timerInterval);
        let localPic=num;
    if (localPic < pictures.length - 1) localPic++
          else localPic=0;
          setNextActivePic(localPic) 
          
          nextActive(localPic)      

        }, seconds*1000);
  }

  useEffect(() => {
    if (auto)  nextActive(0)
  }, []);
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

      gsap.timeline().to(imgEl, { opacity: 0, duration: seconds*.8, stagger: seconds*.2 });
      gsap.timeline().to(textEl, { opacity: 0, duration: seconds*.8, stagger: seconds*.2 });
      gsap.timeline().to(textEl1, { opacity: 1, duration: seconds*.8, stagger: seconds*.6 });
      gsap
        .timeline()
        .to(imgEl1, { opacity: 1, duration: seconds*.8, stagger: seconds*.6 })
        .then(() => {
          if (imgEl) imgEl.style.filter = '';
          setActivePic(nextActivePic);
        });
    } else setFirstTime(false);
  }, [nextActivePic]);
  return (
    <div className={` relative  h-[${height}] w-[${width}] rounded-md overflow-hidden flex justify-between items-center `}>
      <button
        id="prevButton"
        className={`bg-lightMainBG/70 dark:bg-darkMainBG/70 origin-center cursor-pointer z-10 ${
          auto ? 'hidden' : ''
        }`}
        onClick={() => {
          if (activePic > 0) setNextActivePic(activePic - 1);
          else setNextActivePic(pictures.length - 1);
        }}
      >
        {'<'}
      </button>
      {pictures.map((item, index) => (
        <div key={'img' + index}>
          <Image
            id={'image' + index}
            src={item}
            alt={item}
            fill
            className={`absolute inset-0 ${
              index !== activePic ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <h2
            id={'text_' + index}
            className={`w-full text-center absolute bottom-0 right-0 z-100 bg-lightMainBG/70 dark:bg-darkMainBG/70 ${
              index !== activePic ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {item.substring(item.lastIndexOf('/') + 1).split('.')[0]}
          </h2>
        </div>
      ))}
      <button
        id="nextButton"
        className={`bg-lightMainBG/70 dark:bg-darkMainBG/70 origin-center cursor-pointer z-10  ${
          auto ? 'hidden' : ''
        }`}
        onClick={() => {
          if (activePic < pictures.length - 1) setNextActivePic(activePic + 1);
          else setNextActivePic(0);
        }}
      >
        {'>'}
      </button>
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
    </div>
  );
};

export default Gallery;
