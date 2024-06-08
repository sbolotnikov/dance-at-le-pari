import { useEffect, useState } from 'react';
import { gsap } from '../utils/gsap';
import AnimateModalLayout from './AnimateModalLayout';
import sleep from '@/utils/functions';
import ShowIcon from './svg/showIcon';
import ImgFromDb from './ImgFromDb';
import ImgFromDbWithID from './ImgFromDbWithID';
import { useDimensions } from '@/hooks/useDimensions';
import { text } from 'stream/consumers';

type Props = {
  pictures: { bio: string; urlData: string; capture: string; role: string }[];
  index: number;
  onReturn: () => void;
};

const FullScreenTeamView = ({ pictures, index, onReturn }: Props) => {
  const [isVisible, setIsVisible] = useState(true);
  let el = document.querySelector('#mainPage');
  const windowSize = useDimensions();
  const [firstTime, setFirstTime] = useState(true);
  const [activePic, setActivePic] = useState(index);
  const [nextActivePic, setNextActivePic] = useState(index);
  const [containerHeight, setContainerHeight] = useState(50);
  let seconds = 5;

  useEffect(() => {
    if (!firstTime) {
      let el = document.getElementById('turbulence');
      let imgEl = document.getElementById(`image${activePic}`);

      imgEl!.style.filter = 'url(#noise)';
      imgEl!.style.opacity = '1';

      let textEl = document.getElementById(`text_${activePic}`);
      textEl!.style.opacity = '1';
      let imgEl1 = document.getElementById(`imageNext`);
      let textEl1 = document.getElementById(`textNext`);
      imgEl1!.style.opacity = '0';
      imgEl1!.style.filter = 'url(#noise)';
      textEl1!.style.opacity = '0';
      console.log('anime');
      gsap
        .timeline()
        .fromTo(
          el,
          { attr: { baseFrequency: '0' } },
          { attr: { baseFrequency: '0.1' }, duration: seconds }
        );

      gsap.timeline().to(imgEl, {
        opacity: 0,
        duration: seconds * 0.8,
        stagger: 0,
      });
      gsap.timeline().to(textEl, {
        opacity: 0,
        duration: seconds * 0.8,
        stagger: 0,
      });
      gsap.timeline().to(textEl1, {
        opacity: 1,
        duration: seconds * 0.7,
        stagger: seconds * 0.2,
      });
      gsap
        .timeline()
        .to(imgEl1, {
          opacity: 1,
          duration: seconds * 0.7,
          stagger: seconds * 0.2,
        })
        .then(() => {
          imgEl!.style.filter = '';
          imgEl1!.style.filter = '';
          imgEl!.style.opacity = '0';
          // textEl!.style.opacity = '0';
          setActivePic(nextActivePic);
        });
    } else setFirstTime(false);
  }, [nextActivePic]);
  useEffect(() => {
    setContainerHeight((document.getElementById(`textNext`)?.offsetHeight!>50)? document.getElementById(`textNext`)?.offsetHeight!:50);
    console.log(document.getElementById(`textNext`)?.offsetHeight!);
  },[windowSize.height, windowSize.width]);
  return (
    <AnimateModalLayout
      visibility={isVisible}
      onReturn={() => {
        onReturn();
      }}
    >
      <div className="w-full h-full relative">
        <div
          className={`relative h-full w-full flex flex-col md:flex-row justify-center md:justify-start items-center`}
        >
          <div className="w-[90%] h-[45%] md:h-full md:w-1/2 flex justify-center items-center">
            <ImgFromDbWithID
              id={'imageNext'}
              url={pictures[nextActivePic].urlData}
              stylings={` h-full md:h-auto md:w-5/12 object-contain rounded-md`}
              alt={pictures[nextActivePic].capture}
            />
          </div>

          <div
            id={'textNext'}
            className={`w-[98%] h-1/4 md:h-3/4 md:w-5/12 md:max-h-[80%]  
             rounded-md p-2  bg-darkMainColor dark:bg-lightMainColor`}
          >
            {containerHeight>50 &&<div className='w-full  border rounded-md border-lightMainColor dark:border-darkMainColor relative overflow-y-scroll flex flex-col justify-center items-center'
            style={{height: (containerHeight-15)+'px'}}
            >
              <section className=" absolute top-0 left-0 flex flex-col justify-center items-center  p-2  w-[98%] mx-auto">
                <strong className="font-bold text-4xl md:text-6xl text-franceBlue  text-center font-DancingScript text-shadow">
                  {pictures[nextActivePic].capture}
                </strong>
                <span className="md:text-2xl m-2">
                  {pictures[nextActivePic].role == 'Admin'
                    ? 'Manager'
                    : pictures[nextActivePic].role == 'Teacher'
                    ? 'Dance Instructor'
                    : 'Owner'}
                </span>
                <div className=" w-full  md:text-xl">
                  {pictures[nextActivePic].bio}
                </div>
              </section>
            </div>}
          </div>
        </div>
        <div className="w-full h-full absolute top-0 left-0">
          {pictures.map((item, index) => (
            <div
              key={'img' + index}
              className={`relative h-full w-full flex flex-col md:flex-row justify-center md:justify-start items-center 
          ${index !== activePic ? 'hidden' : ''}`}
            >
              <div className="w-[90%] h-[45%] md:h-full md:w-1/2 flex justify-center items-center">
                <ImgFromDbWithID
                  id={'image' + index}
                  url={item.urlData}
                  stylings={` h-full md:h-auto md:w-5/12 object-contain rounded-md`}
                  alt={item.capture}
                />
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

              <div
                id={'text_' + index}
                className={`w-[98%] h-1/4 md:h-3/4 md:w-5/12 md:max-h-[80%]  
             rounded-md p-2  bg-darkMainColor dark:bg-lightMainColor`}
              >
                {containerHeight>50 &&<div  className='w-full border rounded-md border-lightMainColor dark:border-darkMainColor relative overflow-y-scroll flex flex-col justify-center items-center'
                style={{height: (containerHeight-15)+'px'}}
                >
                  <div className=" absolute top-0 left-0 flex flex-col justify-center items-center  p-2  w-[98%] mx-auto"  style={{minHeight: '100%'}} >
                    <strong className="font-bold text-4xl md:text-6xl text-franceBlue  text-center font-DancingScript text-shadow">
                      {item.capture}
                    </strong>
                    <span className="md:text-2xl m-2">
                      {item.role == 'Admin'
                        ? 'Manager'
                        : item.role == 'Teacher'
                        ? 'Dance Instructor'
                        : 'Owner'}
                    </span>
                    <div className=" w-full  md:text-xl">{item.bio}</div>
                  </div>
                </div>}
              </div>
            </div>
          ))}
        </div>
        <button
          id="prevButton"
          className={` absolute top-1/2 left-0  translate-x-0 -translate-y-1/2 cursor-pointer z-10 hover:scale-125 `}
          onClick={() => {
            if (activePic > 0) setNextActivePic(activePic - 1);
            else setNextActivePic(pictures.length - 1);
          }}
        >
          <div className="ml-1 h-8 w-8 md:h-16 md:w-16  fill-darkMainColor stroke-darkMainColor">
            <ShowIcon icon={'ArrowLeft'} stroke={'.1'} />
          </div>
        </button>
        <button
          id="nextButton"
          className={` absolute top-1/2 right-0 translate-x-0 -translate-y-1/2 cursor-pointer z-10 hover:scale-125 `}
          onClick={() => {
            if (activePic < pictures.length - 1)
              setNextActivePic(activePic + 1);
            else setNextActivePic(0);
          }}
        >
          <div className="mr-2 h-8 w-8 md:h-16 md:w-16  fill-darkMainColor stroke-darkMainColor">
            <ShowIcon icon={'ArrowRight'} stroke={'.1'} />
          </div>
        </button>

      </div>
    </AnimateModalLayout>
  );
};

export default FullScreenTeamView;
