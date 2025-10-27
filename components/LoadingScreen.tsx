'use client';
import Image from 'next/image';
import Logo from './svg/logo';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [mainPageEl, setMainPageEl] = useState<HTMLElement | null>(null);

  const StopScroll = (el: HTMLElement | null) => {
    if (typeof window !== 'undefined' && el) {
      var x = 0;
      var y = el.scrollTop;
      window.onscroll = function () {
        window.scrollTo(x, y);
      };
    }
  };

  const AllowScroll = () => {
    if (typeof window !== 'undefined') {
      window.onscroll = function () {};
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const el = document.querySelector('#mainPage');
      setMainPageEl(el as HTMLElement);

      console.log('Loading...');
      StopScroll(el as HTMLElement);
      return () => {
        AllowScroll();
      };
    }
  }, []);
  return (
    <div className="blurFilter w-[100vw] h-[100svh] absolute flex justify-center items-center bg-slate-500/70 left-0 z-[1001]"     style={{ top: mainPageEl ? mainPageEl.scrollTop : 0, zIndex: 2011 }}
    >
      <div
        className="m-auto  max-w-[600px] w-full h-full relative"
        style={{
          animation: 'loader 8s infinite',
          transition: '0.5s ease-in-out',
        }}
      >
        <Logo shadow={'0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'} />
        <h1 className="font-bold text-8xl text-franceBlue  text-center font-DancingScript text-shadow  dark:text-shadow-light ">
          Loading...
        </h1>
      </div>
      {/* <Image width={32} height={32} alt={'Logo'} src={'/favicon-32x32.png'} style={{objectFit: "contain"}}/> */}
    </div>
  );
}
