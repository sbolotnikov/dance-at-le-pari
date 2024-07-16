'use client'; 
import React, { useEffect, useState } from 'react';
// Note: Some imports and components might need to be adjusted or replaced
// for a web-based React application 
import VideoPlayingComponent from './VideoPlayingComponent';
import ManualImage from './ManualImage';
import AutoImages from './AutoImages';

type Props = {
    videoUri: { link: string; name: string }; 
    button1: string;
    compName: string;
    heatNum: string;
    mode: string  ;
    fontSize: number;
    seconds: number;
    manualPicture: { link: string; name: string };
    displayedPicturesAuto: { link: string; name: string }[];
    vis: boolean;
    compLogo: { link: string; name: string };
    message: string;
    titleBarHider: boolean;
    showUrgentMessage: boolean;
    textColor: string;
    onReturn: (submitten: string) => void; 
  }

  const ShowPlayingModal: React.FC<Props> = ({
    videoUri, 
    button1,
    compName,
    heatNum,
    mode,
    fontSize,
    seconds,
    manualPicture,
    displayedPicturesAuto,
    vis,
    compLogo,
    message,
    titleBarHider,
    showUrgentMessage,
    textColor,
    onReturn, 
  }) => {
    const handleSubmit = (e: React.MouseEvent, submitten: string) => {
        e.preventDefault();
        onReturn(submitten);
      };
    
      const [timeNow, setTimeNow] = useState('');
    
      useEffect(() => {
        const timerInterval = setInterval(() => {
          const now = new Date();
          const currentDateTime = now.toLocaleString();
          setTimeNow(currentDateTime.split(',')[1]);
        }, 1000);
    
        return () => clearInterval(timerInterval);
      }, [vis]);
    
      const gradientStyle = {
        background: 'linear-gradient(135deg, yellow, red, brown, red, yellow)',
      };
    
      return (
        <div className="flex justify-center items-center w-full h-full absolute top-0 left-0">
          {vis && (
            <div className="relative w-full h-full">
              <div className="w-full h-full flex justify-start items-center" style={gradientStyle}>
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
                    <img
                      src={compLogo.link}
                      alt="Company Logo"
                      className="h-[750px] w-[760px]"
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
                  <p className="font-bold text-3xl m-0" style={{ textShadow: '5px 5px #C9AB78' }}>
                    {heatNum}
                  </p>
                </div>
                <div
                  onClick={(e) => handleSubmit(e, button1)}
                  className="absolute top-0 right-1 cursor-pointer"
                  style={{ color: textColor }}
                >
                  <p className="font-bold text-3xl m-0">
                    {timeNow}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };
  export default ShowPlayingModal;