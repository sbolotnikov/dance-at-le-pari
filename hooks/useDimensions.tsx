'use client'
import {  useState, useEffect } from 'react';



export const useDimensions = () => {
    const [windowSize, setWindowSize] = useState<{width: number | undefined, height: number | undefined}>({
        width: undefined,
        height: undefined,
      });
    
      useEffect(() => {
        const handleResize = () =>{ if (typeof window !== "undefined") setWindowSize({ width: window.innerWidth, height: window.innerHeight });}
        
    
        window.addEventListener('resize', handleResize);
    
        handleResize();
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []); 
   
  
    
  return  windowSize

    }