'use client';
import { gsap } from '@/utils/gsap';
import React, { useEffect, useState } from 'react';
type Props = {
  seconds: number;
  image1: string;
  text1: string;
  compLogo: string;
  videoBG: string;
  titleBarHider: boolean;
};

const ManualImage: React.FC<Props> = ({
  seconds,
  image1,
  text1,
  compLogo,
  videoBG,
  titleBarHider,
}) => {
  const [actPic, setActPic] = useState('');
  const [actText, setActText] = useState('Fred Astaire presents');
  const [activePic, setActivePic] = useState(0);
  const [size1, setSize1] = useState(0);
  const [size2, setSize2] = useState(0); 

  useEffect(() => {
    setActivePic((prevActivePic) => prevActivePic + 1);
    setActPic(image1);
    setActText(text1);
    let logoEl = document.getElementById('logoDiv');
    let imgEl = document.getElementById(`image${activePic}`);
    console.log("animation starts")
    logoEl!.style.opacity = '0';
    gsap
      .timeline()
      .fromTo(
        logoEl,
        { scale:0.1, opacity: 0 },
        { scale:1, opacity:1, duration: 5 }
      );

    gsap.timeline().to(logoEl, {
      opacity: 0,
      scale:2,
      duration: 5,
      stagger:5
    })
    // gsap.timeline().to(textEl, {
    //   opacity: 0,
    //   duration: seconds * 0.8,
    //   stagger: 0,
    // });
    // gsap.timeline().to(textEl1, {
    //   opacity: 1,
    //   duration: seconds * 0.7,
    //   stagger: seconds * 0.2,
    // });
    // gsap
    //   .timeline()
    //   .to(imgEl1, {
    //     opacity: 1,
    //     duration: seconds * 0.7,
    //     stagger: seconds * 0.2,
    //   })
      .then(() => {
         
      });
  
    // const timer = setTimeout(() => setAnimate(false), seconds * 1000);
    // return () => clearTimeout(timer);
  }, [image1, text1 ]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setSize1(width > 1000 ? 15 : 25);
      setSize2(width > 1000 ? 28 : 24);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const videoBGtrans = `${videoBG.split('&playlist')[0]}&mute=1&playlist${
    videoBG.split('&playlist')[1]
  }`;

  return (
    <div className="w-full h-full flex justify-start items-center relative">
      <iframe
        className="w-full h-full"
        src={videoBGtrans}
        allow="autoplay;fullscreen;"
        frameBorder="0"
        allowFullScreen
      ></iframe>

      <div
        className={`absolute inset-0 m-auto w-full h-full transition-opacity `}
      >
        {image1 && (
          <div
            
            className="h-full w-auto my-auto z-10 bg-center bg-no-repeat bg-contain"
            style={{
              backgroundImage: `url(${actPic})`,
              boxShadow: '0 30px 40px rgba(0,0,0,.1)',
            }}
          ></div>
        )}

        {text1 && !titleBarHider && (
          <div
            className={`bg-purple-400 bg-opacity-70 absolute left-0 right-0 top-0`}
            style={{ height: `${size1}%` }}
          >
            <div className="flex justify-center h-full w-full items-center relative">
            <img
              src={compLogo}
              className={` w-${size2} h-${size2} absolute top-2 left-2  `}
              alt="Company Logo"
            />
            <p
              className="font-bold text-white text-6xl text-center"
              style={{
                textShadow: '5px 5px #C9AB78',
                fontFamily: 'DancingScript',
                zIndex: 100,
              }}
            >
              {actText}
            </p>
            </div>
          </div>
        )}
      </div>

      <div className="absolute inset-0 m-auto w-full h-full flex justify-center items-center">
        <div
        id="logoDiv"
          className={` w-[850px] h-[850px]  `}
        >
          <img src={compLogo} className="h-full w-full" alt="Company Logo" />
        </div>
      </div>
    </div>
  );
};

export default ManualImage;
