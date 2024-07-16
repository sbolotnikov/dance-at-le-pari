'use client';

import React, { useEffect, useState } from 'react';
type Props={
  seconds: number;
  image1: string;
  text1: string;
  compLogo: string;
  videoBG: string;
  titleBarHider: boolean;
}

const ManualImage: React.FC<Props> = ({
  seconds,
  image1,
  text1,
  compLogo,
  videoBG,
  titleBarHider,
}) => {
  const [actPic, setActPic] = useState('/path/to/winterClass.svg');
  const [actText, setActText] = useState('Fred Astaire presents');
  const [activePic, setActivePic] = useState(0);
  const [size1, setSize1] = useState(0);
  const [size2, setSize2] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setActivePic(prevActivePic => prevActivePic + 1);
    setActPic(image1);
    setActText(text1);
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), seconds * 1000);
    return () => clearTimeout(timer);
  }, [image1, text1, seconds]);

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

  const videoBGtrans = `${videoBG.split('&playlist')[0]}&mute=1&playlist${videoBG.split('&playlist')[1]}`;

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
        className={`absolute inset-0 m-auto w-full h-full transition-opacity duration-1000 ${
          animate ? 'opacity-100' : 'opacity-0'
        }`}
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
            className={`bg-purple-400 bg-opacity-70 absolute left-0 right-0 top-0 flex items-center ${
              size2 === 24 ? 'justify-start' : 'justify-center'
            }`}
            style={{ height: `${size1}%` }}
          >
            <img
              src={compLogo}
              className={`absolute top-2 w-${size2} h-${size2} ${
                size2 === 24 ? 'left-2 mt-8' : 'left-22 mt-1'
              }`}
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
        )}
      </div>

      <div className="absolute inset-0 m-auto w-full h-full flex justify-center items-center">
        <div
          className={`transition-all duration-1000 ${
            animate ? 'w-[1650px] h-[1650px] opacity-0' : 'w-0 h-0 opacity-100'
          }`}
        >
          <img src={compLogo} className="h-full w-full" alt="Company Logo" />
        </div>
      </div>
    </div>
  );
};

export default ManualImage;