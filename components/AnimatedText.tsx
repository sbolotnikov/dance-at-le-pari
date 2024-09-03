
import React, { useEffect, useRef } from 'react';
import TextToSVGLocal from '@/utils/svgFunction';

interface AnimatedTextProps {
  text: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text }) => {
  const svgRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    if (text!=null){
    const svg = svgRef.current;
    TextToSVGLocal(text,'').then((res:any) => {
      if (typeof res === 'string') {
      svg!.innerHTML = res;
      let svg1= svg!.children[0];
      if (svg1) {
        const paths = svg1.querySelectorAll('path');
    
    paths.forEach((path,j) => {

    const pathLength = path.getTotalLength();
    
    path.setAttribute('startOffset', pathLength.toString());
    path.style.animation = `dash .3s ${j*.25}s ease-in-out forwards`;  
    path.style.strokeDasharray = pathLength.toString();
    path.style.strokeDashoffset = pathLength.toString();
    path.style.stroke = '#fa0b0b'; 
    path.style.fill='none';	
       
})
    }}
    });
  }
  }, [text]);

  return (
    <div ref={svgRef} >
       
    </div>
  );
};

export default AnimatedText;