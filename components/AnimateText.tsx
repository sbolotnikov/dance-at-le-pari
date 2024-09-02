import React, { useEffect, useRef } from 'react';

interface AnimatedTextProps {
  text: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text }) => {
  const svgRef = useRef<SVGSVGElement>(null);

//   useEffect(() => {
//     const svg = svgRef.current;
//     if (svg) {
//       const paths = svg.querySelectorAll('path');
//       paths.forEach((path) => {
//         const length = path.getTotalLength();
//         path.style.strokeDasharray = `${length} ${length}`;
//         path.style.strokeDashoffset = `${length}`;
//         path.getBoundingClientRect(); // Trigger a reflow
//         path.style.transition = 'stroke-dashoffset 2s ease';
//         path.style.strokeDashoffset = '0';
//       });
//     }
//   }, [text]);
  useEffect(() => {
    const svg = svgRef.current;
    if (svg) {
        const paths = svg.querySelectorAll('path');
    const textPath = svg.querySelector('textPath');
    const path = svg.querySelector('path');
    paths.forEach((path) => {

    const pathLength = path.getTotalLength();
    
    path.setAttribute('startOffset', pathLength.toString());
    
    path.style.strokeDasharray = pathLength.toString();
    path.style.strokeDashoffset = pathLength.toString();

    setTimeout(() => {
      path.style.transition = `stroke-dashoffset 2s ease-in-out`;
      path.style.strokeDashoffset = '0';
      path.style.transition = `startOffset 2s ease-in-out`;
      path.setAttribute('startOffset', '0');
    }, 100);
})
    }
  }, [text]);

  return (
    <svg ref={svgRef} viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="15" fontSize="15" fill="none" stroke="black">
        {text}
      </text>
    </svg>
  );
};

export default AnimatedText;