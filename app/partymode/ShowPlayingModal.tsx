'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
// Note: Some imports and components might need to be adjusted or replaced
// for a web-based React application
import VideoPlayingComponent from './VideoPlayingComponent';
import ManualImage from './ManualImage';
import AutoImages from './AutoImages';
import FullAutoMode from './FullAutoMode';
import { SettingsContext } from '@/hooks/useSettings';
import { ScreenSettingsContextType } from '@/types/screen-settings';
import { useDimensions } from '@/hooks/useDimensions';
import svgPath from './svgPath';
import ImgFromDb from '@/components/ImgFromDb';

type Props = {
  videoUri: { link: string; name: string };
  button1: string;
  compName: string;
  heatNum: string;
  image: string;
  mode: string;
  fontSize: number;
  fontSizeTime: number;
  seconds: number;
  manualPicture: { link: string; name: string };
  displayedPicturesAuto: { link: string; name: string }[];
  displayedPictures: { link: string; name: string; dances: string[] }[];
  displayedVideos: { link: string; dances: string[] }[];
  vis: boolean;
  compLogo: { link: string; name: string };
  message: string;
  titleBarHider: boolean;
  showUrgentMessage: boolean;
  showHeatNumber: boolean;
  textColor: string;
  animationSpeed: number;
  speedVariation: number;
  particleCount: number;
  maxSize: number;
  animationOption: number;
  rainAngle: number;
  originX: number;
  originY: number;
  particleTypes: string[];
  heat:string;
  showSVGAnimation: boolean;
  onReturn: (submitten: string) => void;
  onRenewInterval: () => void;
};

const ShowPlayingModal: React.FC<Props> = ({
  videoUri,
  button1,
  image,
  heatNum,
  mode,
  fontSize,
  fontSizeTime,
  seconds,
  manualPicture,
  displayedPicturesAuto,
  displayedPictures,
  displayedVideos,
  vis,
  compLogo,
  message,
  titleBarHider,
  showUrgentMessage,
  showHeatNumber,
  textColor,
  animationSpeed,
  speedVariation,
  particleCount,
  maxSize,
  animationOption,
  rainAngle,
  originX,
  originY,
  showSVGAnimation,
  particleTypes,
  heat,
  onReturn,
  onRenewInterval,
}) => {
  const { changeNav } = useContext(
    SettingsContext
  ) as ScreenSettingsContextType;

  const [picArrAutoMode, setPicArrAutoMode] = useState<
    { link: string; dances: string[] }[]
  >([]);
  const [videoArrAutoMode, setVideoArrAutoMode] = useState<
    { link: string; dances: string[] }[]
  >([]);
  const windowSize = useDimensions();
  const handleSubmit = (e: React.MouseEvent, submitten: string) => {
    e.preventDefault();
    changeNav(true);
    onReturn(submitten);
  };
  const svgRef = useRef<SVGSVGElement>(null);
  const [timeNow, setTimeNow] = useState('');
  const [refreshVar, setRefreshVar] = useState(false);
  const [animationSpeed1, setAnimationSpeed] = useState(animationSpeed);
  const [speedVariation1, setSpeedVariation] = useState(speedVariation);
  const [particleCount1, setParticleCount] = useState(particleCount);
  const [maxSize1, setMaxSize] = useState(maxSize);
  const [animationOption1, setAnimationOption] = useState(animationOption);
  const [rainAngle1, setRainAngle] = useState(rainAngle);
  const [originX1, setOriginX] = useState(originX);
  const [originY1, setOriginY] = useState(originY);
  const [showSVGAnimation1, setShowSVGAnimation] = useState(showSVGAnimation);
  const [particleTypes1, setParticleTypes] = useState(particleTypes);


  useEffect(()=>{
    setAnimationSpeed(animationSpeed);
    setSpeedVariation(speedVariation);
    setParticleCount(particleCount);
    setMaxSize(maxSize);
    setAnimationOption(animationOption);
    setRainAngle(rainAngle);
    setOriginX(originX);
    setOriginY(originY);
    setShowSVGAnimation(showSVGAnimation);
    setParticleTypes(particleTypes);
  },[
    animationSpeed,
  speedVariation,
  particleCount,
  maxSize,
  animationOption,
  rainAngle,
  originX,
  originY,
  showSVGAnimation,
  particleTypes
  ])
  
useEffect(() => {
  if (mode === 'Auto Full') {
    console.log("changing mode")
    // setAnimationSpeed(animationSpeed);
    // setSpeedVariation(speedVariation);
    // setParticleCount(particleCount);
    // setMaxSize(maxSize);
    setAnimationOption(Math.floor(Math.random() * 4)+1);
    setRainAngle(Math.floor(Math.random() * 360));
    // setOriginX(originX);
    // setOriginY(originY);
    // setShowSVGAnimation(!showSVGAnimation1);
    // setParticleTypes(particleTypes);
    
    } 
},[
  message,mode
])
  useEffect(() => {
    if (mode === 'Auto Full' && displayedPictures.length > 0) {
      let arr1 = displayedPictures
        .map((pic) => ({ link: pic.link, dances: pic.dances }))
        .filter((pic) => pic.dances.indexOf(message) >= 0);
      let arr2 = displayedPictures
        .map((pic) => ({ link: pic.link, dances: pic.dances }))
        .filter((pic) => pic.dances.indexOf('All') >= 0);
      let arr = arr1.concat(arr2);
      let videoArr1 = displayedVideos.filter(
        (vid) => vid.dances.indexOf(message) >= 0
      );
      let videoArr2 = displayedVideos.filter(
        (vid) => vid.dances.indexOf('All') >= 0
      );
      let videoArr = videoArr1.concat(videoArr2);

      console.log(message, arr);
      setPicArrAutoMode(arr);
      setVideoArrAutoMode(videoArr);
    } else {
      setPicArrAutoMode([]);
      setVideoArrAutoMode([]);
    }
  }, [message, mode, displayedPictures, displayedVideos]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const now = new Date();
      const currentDateTime = now.toLocaleString();
      setTimeNow(currentDateTime.split(',')[1]);
    }, 1000);
    !vis ? changeNav(false) : changeNav(true);
    return () => clearInterval(timerInterval);
  }, [vis, refreshVar]);

  const gradientStyle = {
    background: 'linear-gradient(135deg, white, red, blue, red, white)',
  }; 
  useEffect(() => {
    const svg = svgRef.current;
    if (svg) {
      const svgNS = 'http://www.w3.org/2000/svg';

      const createParticle = () => {
        const particle = document.createElementNS(svgNS, 'path');
        const animateMotion = document.createElementNS(svgNS, 'animateMotion');
        const animateOpacity = document.createElementNS(svgNS, 'animate');
        const animateTransform = document.createElementNS(svgNS,'animateTransform');
        const animateTransform2 = document.createElementNS(svgNS,'animateTransform');
        const animateColor = document.createElementNS(svgNS, 'animate');

        const shape =
          particleTypes1[Math.floor(Math.random() * particleTypes1.length)];
        const size = animationOption1 === 2 ? maxSize1 : Math.random() * maxSize1;

        particle.setAttribute('d', svgPath(shape));
        particle.setAttribute('fill', `hsl(${Math.random() * 360}, 100%, 50%)`);
        particle.setAttribute('fillRule', `evenodd`);
        particle.setAttribute('clipRule', `evenodd`);

        let startX, startY, endX, endY;
        const particleSpeed =
          animationSpeed1 * (1 + (Math.random() - 0.5) * speedVariation1);
        if (animationOption1 === 1 || animationOption1 === 2) {
          const edge = Math.floor(Math.random() * 4);
          if (animationOption1 === 1) {
            [startX, startY] = [originX1, originY1];
            [endX, endY] =
              edge === 0
                ? [Math.random() * windowSize.width!, windowSize.height!]
                : edge === 1
                ? [Math.random() * windowSize.width!, 0]
                : edge === 2
                ? [0, Math.random() * windowSize.height!]
                : [windowSize.width!, Math.random() * windowSize.height!];
          } else {
            [endX, endY] = [originX1, originY1];
            [startX, startY] =
              edge === 0
                ? [Math.random() * windowSize.width!, windowSize.height!]
                : edge === 1
                ? [Math.random() * windowSize.width!, 0]
                : edge === 2
                ? [0, Math.random() * windowSize.height!]
                : [windowSize.width, Math.random() * windowSize.height!];
          }
        } else if (animationOption1 === 4) {
          startX = Math.random() * windowSize.width!;
          startY = Math.random() * windowSize.height!;
          endX = Math.random() * windowSize.width!;
          endY = Math.random() * windowSize.height!;

          const animationDuration = 10 / animationSpeed1;
          const randomDelay = Math.random() * animationDuration;

          animateMotion.setAttribute(
            'path',
            `M${startX},${startY} L${endX},${endY}`
          );
          animateMotion.setAttribute('dur', `${animationDuration}s`);
          animateMotion.setAttribute('begin', `${randomDelay}s`); 

          
          animateTransform2.setAttribute('attributeName', 'transform');
          animateTransform2.setAttribute('type', 'scale');
          animateTransform2.setAttribute('from', '0');
          animateTransform2.setAttribute('to', `${size / 6}`);
          animateTransform2.setAttribute('dur', `${10 / particleSpeed}s`);
          animateTransform2.setAttribute('begin', `${randomDelay}s`);
          animateTransform2.setAttribute('repeatCount', 'indefinite'); 
          animateTransform2.setAttribute('additive', 'sum'); 
          // animateTransform2.setAttribute('accumulate', 'sum'); 
          // additive="sum" accumulate="sum"
          animateTransform.setAttribute('attributeName', 'transform');
          animateTransform.setAttribute('type', 'rotate');
          animateTransform.setAttribute('from', '0 50 20');
          animateTransform.setAttribute('to', '360 270 360');      
          animateTransform.setAttribute('dur', `${animationDuration}s`);
          animateTransform.setAttribute('begin', `${randomDelay}s`);
          animateTransform.setAttribute('repeatCount', 'indefinite'); 
          animateTransform.setAttribute('additive', 'sum'); 
          // animateTransform.setAttribute('accumulate', 'sum'); 

          animateOpacity.setAttribute('attributeName', 'opacity');
          animateOpacity.setAttribute('values', '0;1;1;0');
          animateOpacity.setAttribute('keyTimes', '0;0.1;0.9;1');
          animateOpacity.setAttribute('dur', `${animationDuration}s`);
          animateOpacity.setAttribute('begin', `${randomDelay}s`);
          animateOpacity.setAttribute('repeatCount', 'indefinite');

          animateColor.setAttribute('attributeName', 'fill');
          animateColor.setAttribute('dur', '5s');
          animateColor.setAttribute('begin', `${randomDelay}s`);
          animateColor.setAttribute('repeatCount', 'indefinite');
          animateColor.setAttribute(
            'values',
            'hsl(0, 100%, 50%); hsl(60, 100%, 50%); hsl(120, 100%, 50%); hsl(180, 100%, 50%); hsl(240, 100%, 50%); hsl(300, 100%, 50%); hsl(24, 80%, 50%)'
          );
          animateColor.setAttribute('calcMode', 'discrete');
          particle.appendChild(animateTransform2);
          particle.appendChild(animateOpacity); 
        } else if (animationOption1 === 3) {
          const angle = (rainAngle1 * Math.PI) / 180;
          startX = Math.random() * windowSize.width!;
          startY = Math.random() * windowSize.height!;
          endX = startX + Math.cos(angle) * windowSize.height!;
          endY = startY + Math.sin(angle) * windowSize.height!;
          animateTransform.setAttribute('attributeName', 'transform');
          animateTransform.setAttribute('type', 'scale');
          animateTransform.setAttribute('from', '0');
          animateTransform.setAttribute('to', `${size / 6}`);
          animateTransform.setAttribute('dur', `${10 / particleSpeed}s`);
          animateTransform.setAttribute('repeatCount', 'indefinite');
        }

        if (animationOption1 !== 4) {
          animateMotion.setAttribute(
            'path',
            `M${startX},${startY} L${endX},${endY}`
          );

         }
        if (animationOption1 === 1) {
          animateTransform.setAttribute('attributeName', 'transform');
          animateTransform.setAttribute('type', 'scale');
          animateTransform.setAttribute('from', '0');
          animateTransform.setAttribute('to', `${size / 6}`);
          animateTransform.setAttribute('dur', `${10 / particleSpeed}s`);
          animateTransform.setAttribute('repeatCount', 'indefinite');
        } else if (animationOption1 === 2) {
          animateTransform.setAttribute('attributeName', 'transform');
          animateTransform.setAttribute('type', 'scale');
          animateTransform.setAttribute('from', `${size / 6}`);
          animateTransform.setAttribute('to', '0');
          animateTransform.setAttribute('dur', `${10 / particleSpeed}s`);
          animateTransform.setAttribute('repeatCount', 'indefinite');
        }

        animateColor.setAttribute('attributeName', 'fill');
        animateColor.setAttribute('dur', `${10 / particleSpeed}s`);
        animateColor.setAttribute('repeatCount', 'indefinite');
        animateColor.setAttribute(
          'values',
          'hsl(0, 100%, 50%); hsl(60, 100%, 50%); hsl(120, 100%, 50%); hsl(180, 100%, 50%); hsl(240, 100%, 50%); hsl(300, 100%, 50%); hsl(360, 100%, 50%)'
        );

        particle.appendChild(animateMotion);
        particle.appendChild(animateTransform);
        
        particle.appendChild(animateColor);

        // Calculate individual particle speed

        animateMotion.setAttribute('dur', `${10 / particleSpeed}s`);
        animateMotion.setAttribute('repeatCount', 'indefinite');

        return particle;
      };

      const init = () => {
        while (svg.firstChild) {
          svg.removeChild(svg.firstChild);
        }

        for (let i = 0; i < particleCount1; i++) {
          svg.appendChild(createParticle());
        }
      };

      init();
      // Background color transition
      let bgColorIndex = 0;
      // const bgRect = document.createElementNS(svgNS, "rect");
      // bgRect.setAttribute('width', '100%');
      // bgRect.setAttribute('height', '100%');
      // svg.insertBefore(bgRect, svg.firstChild);

      // const animateBgColor = document.createElementNS(svgNS, "animate");
      // animateBgColor.setAttribute('attributeName', 'fill');
      // animateBgColor.setAttribute('dur', '20s');
      // animateBgColor.setAttribute('repeatCount', 'indefinite');
      // animateBgColor.setAttribute('values', backgroundColor.join(';') + ';' + backgroundColor[0]);
      // bgRect.appendChild(animateBgColor);
    }
  }, [
    particleCount1,
    maxSize1,
    animationOption1,
    animationSpeed1,
    speedVariation1,
    originX1,
    originY1,
    rainAngle1,
    particleTypes1,
  ]);
  return (
    <div
      className={`flex justify-center items-center w-[100vw] h-[100vh] absolute top-0 z-[2000] left-0 ${
        !vis ? 'hidden' : ''
      }`}
      style={gradientStyle}
    >
      <div className="relative w-full h-full">
        <div className="w-full h-full flex justify-start items-center">
          {mode === 'Video' && (
            <VideoPlayingComponent
              videoUri={videoUri.link}
              text1={videoUri.name}
              titleBarHider={titleBarHider}
              seconds={seconds}
            />
          )}
          {mode === 'Auto' && (
            <AutoImages
              picsArray={displayedPicturesAuto.map((pic) => pic.link)}
              seconds={seconds}
              videoBG={videoUri.link}
              text1={manualPicture.name}
              compLogo={compLogo.link}
              titleBarHider={titleBarHider}
              onRenewInterval={() => {
                setRefreshVar(!refreshVar);
                onRenewInterval();
              }}
            />
          )}
          {mode === 'Auto Full' &&
            picArrAutoMode.length > 0 &&
            videoArrAutoMode.length > 0 && (
              <FullAutoMode
                picsArray={picArrAutoMode}
                vidsArray={videoArrAutoMode}
                seconds={seconds}
                videoBG={videoUri.link}
                text1={manualPicture.name}
                message={message}
                compLogo={compLogo.link}
                titleBarHider={titleBarHider}
                onRenewInterval={() => {
                  setRefreshVar(!refreshVar);
                  onRenewInterval();
                }}
              />
            )}
          {mode === 'Manual' && (
            <ManualImage
              image1={manualPicture.link}
              text1={manualPicture.name}
              compLogo={compLogo.link}
              titleBarHider={titleBarHider}
              videoBG={videoUri.link}
              seconds={seconds}
            />
          )}
          {mode === 'Default' && (
            <div className="w-full h-full flex justify-center items-center">
              <div className="h-[900px] w-[900px] rounded-md flex justify-center items-center">
                <ImgFromDb
                  url={image}
                  stylings="object-cover w-full h-full rounded-md"
                  alt="Event Picture"
                />
              </div>
            </div>
          )}
          {showSVGAnimation1 && (
            <div className="absolute inset-0 flex justify-center items-center">
              <svg
                ref={svgRef}
                width={windowSize.width}
                height={windowSize.height}
                fill={'tranparent'}
              />
            </div>
          )}
          {showUrgentMessage && (
            <div
              className="absolute inset-0 flex justify-center items-center cursor-pointer animate-pulse"
              onClick={(e) => handleSubmit(e, button1)}
              style={{
                color: textColor,
                fontSize: `${fontSize}px`,
                textShadow: '5px 5px #C9AB78',
              }}
            >
              <p className="font-bold m-0">{message}</p>
            </div>
          )}
          <div
            onClick={(e) => handleSubmit(e, button1)}
            className="absolute top-0 left-1 cursor-pointer"
            style={{ color: textColor }}
          >
            <p
              className="font-bold text-3xl m-0"
              style={{ textShadow: '5px 5px #C9AB78' }}
            >
              {heatNum}
            </p>
          </div>
          <div
            onClick={(e) => handleSubmit(e, button1)}
            className="absolute top-0 right-1 cursor-pointer"
            style={{ color: textColor, fontSize: `${fontSizeTime}px` }}
          >
            <p className="font-bold m-0">{showHeatNumber?heat+" "+timeNow:timeNow}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShowPlayingModal;
