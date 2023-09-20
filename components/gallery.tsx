import Image from 'next/image';
import { useEffect, useState } from 'react';
import { gsap } from '../utils/gsap';
import ShowIcon from './svg/showIcon';
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
    <div className={` relative  h-[${height}] w-[${width}] rounded-md overflow-hidden flex justify-between items-center `} style={{zIndex:300}}>
      <button
        id="prevButton"
        className={` absolute top-1/2 left-0 cursor-pointer z-10 hover:scale-125 ${
          auto ? 'hidden' : ''}`} style={{transform: 'translate(0%, -50%)'}}
        onClick={() => {
          if (activePic > 0) setNextActivePic(activePic - 1);
          else setNextActivePic(pictures.length - 1);
        }}
      >
                <div className="ml-1 h-8 w-8 md:h-16 md:w-16  fill-darkMainColor stroke-darkMainColor">
          <ShowIcon icon={'ArrowLeft'} stroke={'.1'} />
        </div>
      </button>
      {pictures.map((item, index) => (
        <div key={'img' + index}>
          <Image
            id={'image' + index}
            src={item}
            alt={item}
            fill
            style={{objectFit: "contain"}}
            className={`absolute inset-0 ${
              index !== activePic ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <h2
            id={'text_' + index}
            className={`w-full mb-12 text-center absolute bottom-0 right-0 z-100 bg-lightMainBG/70 dark:bg-darkMainBG/70 ${
              index !== activePic ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {item.substring(item.lastIndexOf('/') + 1).split('.')[0]}
          </h2>
        </div>
      ))}
      <button
        id="nextButton"
        className={` absolute top-1/2 right-0 cursor-pointer z-10 hover:scale-125 ${
          auto ? 'hidden' : ''}`} style={{transform: 'translate(0%, -50%)'}}
        onClick={() => {
          if (activePic < pictures.length - 1) setNextActivePic(activePic + 1);
          else setNextActivePic(0);
        }}
      >
        <div className="mr-2 h-8 w-8 md:h-16 md:w-16  fill-darkMainColor stroke-darkMainColor">
          <ShowIcon icon={'ArrowRight'} stroke={'.1'} />
        </div>
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
