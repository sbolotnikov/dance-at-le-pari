'use client';
import React, { useEffect, useState } from 'react';
import ManualImage from './ManualImage';

type Props = {
    seconds: number; 
    text1: string;
    compLogo: string;
    videoBG: string;
    titleBarHider: boolean;
    showBackdrop: boolean;
    picsArray: string[];
    fontSizeTime: number;
    onRenewInterval: ()=>void
}
 
    const AutoImages = ({ picsArray, seconds, text1,compLogo,videoBG,fontSizeTime, showBackdrop, titleBarHider, onRenewInterval }:Props) => {
      const [activePic, setActivePic] = useState(0);
      let timerIntervalID: any;
      const nextActive = (num:number) => {
        timerIntervalID = window.setTimeout(function () {
          window.clearTimeout(timerIntervalID);
          console.log('interval cleared in nextActive');
          let localPic = num;
          if (localPic < picsArray.length - 1) localPic++;
          else localPic = 0;
          setActivePic(localPic);
          nextActive(localPic);
        }, seconds * 1000);
      };
    
      useEffect(() => {
        // clearTimeout(timerInterval);
        let id = window.setTimeout(function() {}, 0);
        while (id--) {
            window.clearTimeout(id); // will do nothing if no timeout with id is present
        }
        console.log('interval cleared in useEffect');
        onRenewInterval();
        setActivePic(0);
        nextActive(0);
      }, []);
      return (
          <ManualImage image1={picsArray[activePic]} seconds={seconds} fontSizeTime={fontSizeTime} showBackdrop={showBackdrop} text1={ text1} compLogo={compLogo} videoBG={videoBG} titleBarHider={titleBarHider}/>
    
      );
    };
    
    export default AutoImages;