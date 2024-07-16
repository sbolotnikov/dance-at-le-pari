'use client';
import React, { useEffect, useRef } from 'react';

interface VideoPlayingComponentProps {
  seconds: number;
  videoUri: string;
  text1?: string;
  titleBarHider?: boolean;
}

const VideoPlayingComponent: React.FC<VideoPlayingComponentProps> = ({
  seconds,
  videoUri,
  text1,
  titleBarHider,
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current && overlayRef.current) {
      textRef.current.style.animation = 'none';
      overlayRef.current.style.animation = 'none';
      
      setTimeout(() => {
        if (textRef.current && overlayRef.current) {
          textRef.current.style.animation = `grow ${seconds}s ease-out forwards`;
          overlayRef.current.style.animation = `fadeOut ${seconds}s ease-in-out forwards`;
        }
      }, 10);
    }
  }, [videoUri, seconds]);

  return (
    <div className="w-full h-screen flex justify-start items-center relative">
      <iframe
        className="w-full h-full"
        src={videoUri}
        allow="autoplay; fullscreen"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <div
        ref={overlayRef}
        className="absolute inset-0 w-full h-full flex justify-center items-center"
      >
        {text1 && !titleBarHider && (
          <div
            ref={textRef}
            className="font-bold text-white p-3 rounded text-center bg-black bg-opacity-90"
            style={{
              textShadow: '5px 5px #C9AB78',
              zIndex: 100,
            }}
          >
            {text1}
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes grow {
          from {
            font-size: 0px;
          }
          to {
            font-size: 100px;
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoPlayingComponent;
