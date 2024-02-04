'use client';
import Image from 'next/image';
import { useEffect } from 'react';
import Logo from './svg/logo';

export default function LoadingScreen() {
  // DO NOT FORGET TO NAME main tag id="mainPage"

  const el = document.querySelector('#mainPage');

  function StopScroll() {
    // prevent scrolling
    var x = 0;
    var y = el!.scrollTop;
    window.onscroll = function () {
      window.scrollTo(x, y);
    };
  }
  function AllowScroll() {
    // when done release scroll
    window.onscroll = function () {};
  }

  useEffect(() => {
    // setup buttons style on load
    StopScroll();
  }, []);
  return (
    <div
      className="w-[100vw] h-[100vh] absolute flex justify-center items-center bg-slate-500/70 left-0 z-[1001] backdrop-blur-md"
      style={{ top: el!.scrollTop, zIndex: 101 }}
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
