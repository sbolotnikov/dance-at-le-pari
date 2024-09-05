'use client';
import AnimatedText from '@/components/AnimatedText';
import AnimatedTextMessage from '@/components/AnimatedTextMessage';
import { PageWrapper } from '@/components/page-wrapper';
import React, { useState, useEffect, useRef } from 'react';
// import { useDimensions } from '@/hooks/useDimensions';

const ParticleAnimation = () => {
  const [particleCount, setParticleCount] = useState(0);
  const [maxSize, setMaxSize] = useState(20);
  const [animationSpeed, setAnimationSpeed] = useState(2);
  const [backgroundColor, setBackgroundColor] = useState(['#000000', '#1a237e', '#004d40', '#b71c1c']);
  const [particleTypes, setParticleTypes] = useState(['snowflake', 'heart', 'leaf', 'star']);
  const svgRef = useRef(null);
  // const windowSize = useDimensions();
  const windowSize = { width: 1400, height: 1000 };

  useEffect(() => {
    const svg = svgRef.current;
    const svgNS = "http://www.w3.org/2000/svg";

    const createParticle = () => {
      const particle = document.createElementNS(svgNS, "g");
      const path = document.createElementNS(svgNS, "path");
      const animateMotion = document.createElementNS(svgNS, "animateMotion");
      const animateTransform = document.createElementNS(svgNS, "animateTransform");
      const animateOpacity = document.createElementNS(svgNS, "animate");
      const animateColor = document.createElementNS(svgNS, "animate");

      const shape = particleTypes[Math.floor(Math.random() * particleTypes.length)];
      const size = Math.random() * maxSize; 

      const paths = {
               heart: `M ${size/2},0 A ${size/4},${size/4} 0 0,1 ${size},${size/2} A ${size/4},${size/4} 0 0,1 ${size/2},${size} A ${size/4},${size/4} 0 0,1 0,${size/2} A ${size/4},${size/4} 0 0,1 ${size/2},0 Z`,
        leaf: `M0,0 Q${size/2},${size/4} ${size},0 T${size},${size} ${size/2},${size} 0,${size} -${size/2},${size} -${size},${size} -${size},0 0,0 Z`,
        star: `M0,-${size} L${size/4},-${size/4} L${size},0 L${size/4},${size/4} L${size/2},${size} L0,${size/2} L-${size/2},${size} L-${size/4},${size/4} L-${size},0 L-${size/4},-${size/4} Z`
      };

      path.setAttribute('d', paths[shape]);
      path.setAttribute('fill', `hsl(${Math.random() * 360}, 100%, 50%)`);

      const startX = Math.random() * windowSize.width;
      const startY = Math.random() * windowSize.height;
      const endX = Math.random() * windowSize.width;
      const endY = Math.random() * windowSize.height;

      const animationDuration = 10 / animationSpeed;
      const randomDelay = Math.random() * animationDuration;

      animateMotion.setAttribute('path', `M${startX},${startY} L${endX},${endY}`);
      animateMotion.setAttribute('dur', `${animationDuration}s`);
      animateMotion.setAttribute('begin', `${randomDelay}s`);
      animateMotion.setAttribute('repeatCount', 'indefinite');

      animateTransform.setAttribute('attributeName', 'transform');
      animateTransform.setAttribute('type', 'rotateX');
      animateTransform.setAttribute('from', '0 50 20');
      animateTransform.setAttribute('to', '360 270 360');
      animateTransform.setAttribute('dur', `${animationDuration}s`);
      animateTransform.setAttribute('begin', `${randomDelay}s`);
      animateTransform.setAttribute('repeatCount', 'indefinite');

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
      animateColor.setAttribute('values', 'hsl(0, 100%, 50%); hsl(60, 100%, 50%); hsl(120, 100%, 50%); hsl(180, 100%, 50%); hsl(240, 100%, 50%); hsl(300, 100%, 50%); hsl(360, 100%, 50%)');

      path.appendChild(animateColor);
      particle.appendChild(path);
      particle.appendChild(animateMotion);
      particle.appendChild(animateTransform);
      particle.appendChild(animateOpacity);

      return particle;
    };

    const init = () => {
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }

      const bgRect = document.createElementNS(svgNS, "rect");
      bgRect.setAttribute('width', '100%');
      bgRect.setAttribute('height', '100%');
      svg.appendChild(bgRect);

      const animateBgColor = document.createElementNS(svgNS, "animate");
      animateBgColor.setAttribute('attributeName', 'fill');
      animateBgColor.setAttribute('dur', '20s');
      animateBgColor.setAttribute('repeatCount', 'indefinite');
      animateBgColor.setAttribute('values', backgroundColor.join(';') + ';' + backgroundColor[0]);
      bgRect.appendChild(animateBgColor);

      for (let i = 0; i < particleCount; i++) {
        svg.appendChild(createParticle());
      }
    };

    init();

  }, [particleCount, maxSize, animationSpeed, backgroundColor, particleTypes]);

  const toggleParticleType = (type) => {
    setParticleTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    // <div className='absolute inset-0' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
    <div className="blurFilter border-0 rounded-md p-2 shadow-2xl w-[95%] max-w-[1650px] h-[85%] overflow-y-auto md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70">
        <div className="w-full h-full flex flex-col justify-center items-center border rounded-md border-lightMainColor dark:border-darkMainColor relative p-2 overflow-x-auto">
        
    <div className="w-full h-fit uppercase font-semibold  xs:text-md sm:text-xl md:text-4xl text-center">
              {/* <AnimatedText text={'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789!?@ ,.:'} /> */}
               
              <AnimatedTextMessage  
              text={'Particle Chaos'}
              duration={2}
              delay={0}
              name={'Lato'}
              height={'6rem'}
              width={'100%'}
              color={'red'}
              stroke={1}
              cutdelay={false} /> 
      </div>   
      {/* <h1 className="w-full h-fit m-3 uppercase font-semibold  xs:text-md sm:text-xl md:text-4xl text-center">Particle Chaos</h1>      */}
     <svg ref={svgRef} width={windowSize.width} height={'60vh'} fill={'tranparent'} />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '400px' }}>
        <div>
          <label>Particle Count: {particleCount}</label>
          <input 
            type="range" 
            min="1" 
            max="1000" 
            value={particleCount} 
            onChange={(e) => setParticleCount(Number(e.target.value))} 
          />
        </div>
        <div>
          <label>Max Size: {maxSize}</label>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={maxSize} 
            onChange={(e) => setMaxSize(Number(e.target.value))} 
          />
        </div>
        <div>
          <label>Animation Speed: {animationSpeed}</label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={animationSpeed} 
            onChange={(e) => setAnimationSpeed(Number(e.target.value))} 
          />
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <label>Particle Types:</label>
        {[ 'heart', 'leaf', 'star'].map(type => (
          <button 
            key={type} 
            onClick={() => toggleParticleType(type)}
            style={{ 
              margin: '0 5px', 
              padding: '5px 10px', 
              backgroundColor: particleTypes.includes(type) ? 'lightblue' : 'white'
            }}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
    </div>
    </PageWrapper>
  );
};

export default ParticleAnimation;