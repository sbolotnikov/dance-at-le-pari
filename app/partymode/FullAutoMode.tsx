'use client';
import React, { useEffect, useState } from 'react';
import ManualImage from './ManualImage';

type Props = {
  seconds: number;
  text1: string;
  compLogo: string;
  videoBG: string;
  titleBarHider: boolean;
  message: string;
  fontSizeTime: number;
  picsArray: { link: string; dances: string[] }[];
  vidsArray: { link: string; dances: string[] }[];
  onRenewInterval: () => void;
};

const FullAutoMode = ({
  picsArray,
  vidsArray,
  seconds,
  text1,
  compLogo,
  videoBG,
  fontSizeTime,
  titleBarHider,
  onRenewInterval,
}: Props) => {
  const [activePic, setActivePic] = useState(0);
  const [activeVideo, setActiveVideo] = useState(0);
  let timerIntervalID: any;
  let timerIntervalVideoID: any;
  const nextActive = (num: number) => {
    timerIntervalID = window.setTimeout(function () {
      window.clearTimeout(timerIntervalID);
      console.log('interval cleared in nextActive pictures', num);  
      setActivePic(Math.floor(Math.random() * picsArray.length));
      nextActive(num);
    }, num * 1000);
  };
  const nextActiveVideo = (num: number) => {
    timerIntervalVideoID = window.setTimeout(function () {
      window.clearTimeout(timerIntervalVideoID);
      console.log('interval cleared in nextActive video ',num);     
      setActiveVideo(Math.floor(Math.random()*vidsArray.length));
      nextActiveVideo(num);
    }, num * 1000);
  };
  useEffect(() => {
    console.log(picsArray);
    let id = window.setTimeout(function () {}, 0);
    while (id--) {
      window.clearTimeout(id); // will do nothing if no timeout with id is present
    }
    console.log('interval cleared in useEffect pictures');
    setActivePic(Math.floor(Math.random() * picsArray.length));
    nextActive(seconds);
    console.log(vidsArray);    
    setActiveVideo(Math.floor(Math.random()*vidsArray.length));
    nextActiveVideo(seconds*3);
    onRenewInterval();
  }, [vidsArray, picsArray]);
  return (
    <>
      {(picsArray[activePic] !== undefined) && (vidsArray[activeVideo] !== undefined)&&(
        <ManualImage
          image1={picsArray[activePic].link}
          seconds={seconds}
          text1={text1}
          compLogo={compLogo}
          fontSizeTime={fontSizeTime}
          videoBG={vidsArray[activeVideo].link}
          titleBarHider={titleBarHider}
        />
      )}
    </>
  );
};

export default FullAutoMode;
