import React, { useEffect, useRef } from 'react';
import TextToSVGLocal from '@/utils/svgFunction';

interface AnimatedTextProps {
  text: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text }) => {
  const svgRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    
    const svg = svgRef.current;
    TextToSVGLocal(text,'').then((res:any) => {
      if (typeof res === 'string') {
      svg!.innerHTML = res;
      let svg1= svg!.children[0];
      if (svg1) {
        const paths = svg1.querySelectorAll('path');
    const textPath = svg1.querySelector('textPath');
    const path = svg1.querySelector('path');
    paths.forEach((path,j) => {

    const pathLength = path.getTotalLength();
    
    path.setAttribute('startOffset', pathLength.toString());
    path.style.animation = `dash .2s  ease-in-out forwards`;
    path.style.animationDelay = `${j*.2}s`; 
    path.style.strokeDasharray = pathLength.toString();
    path.style.strokeDashoffset = pathLength.toString();
    path.style.stroke = '#fa0b0b';
    path.style.fill='none';	
    setTimeout(() => {
      
      // path.style.strokeDashoffset = '0'; 
      // path.style.transition = `startOffset 2s ease-in-out`;
      // path.setAttribute('startOffset', '0');
    }, 1000);
})
    }}
    });

  }, [text]);

  return (
    <div ref={svgRef} >
       
    </div>
  );
};

export default AnimatedText;