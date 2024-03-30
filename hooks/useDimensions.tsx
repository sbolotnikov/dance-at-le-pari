'use client'
import { createContext, useContext, useState, useEffect } from 'react';
// possible server side rendering issue


export const useDimensions = () => {
    const [windowSize, setWindowSize] = useState<{width: number | undefined, height: number | undefined}>({
        width: undefined,
        height: undefined,
      });
    
      useEffect(() => {
        const handleResize = () =>
          setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
        window.addEventListener('resize', handleResize);
    
        handleResize();
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []); 
   
  
    
  return  windowSize

    }