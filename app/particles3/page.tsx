'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useDimensions } from '@/hooks/useDimensions';

const ParticleAnimation = () => {
  const [particleCount, setParticleCount] = useState(100);
  const [maxSize, setMaxSize] = useState(20);
  const [animationSpeed, setAnimationSpeed] = useState(2);
  const [backgroundColor, setBackgroundColor] = useState(['#000000', '#1a237e', '#004d40', '#b71c1c']);
  const [particleTypes, setParticleTypes] = useState(['snowflake', 'heart', 'leaf', 'star']);
  const [pattern, setPattern] = useState('random');
  const svgRef = useRef(null);
  const windowSize = useDimensions();

  useEffect(() => {
    const svg = svgRef.current;
    const svgNS = "http://www.w3.org/2000/svg";

    const createParticle = (index) => {
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
        star: `M0,-${size} L${size/4},-${size/4} L${size},0 L${size/4},${size/4} L${size/2},${size} L0,${size/2} L-${size/2},${size} L-${size/4},${size/4} L-${size},0 L-${size/4},-${size/4} Z`,
        snowflake: `M0,0 L${size/2},${size/2} M0,0 L-${size/2},${size/2} M0,0 L${size/2},-${size/2} M0,0 L-${size/2},-${size/2} M0,0 L0,${size} M0,0 L0,-${size} M0,0 L${size},0 M0,0 L-${size},0`
      };

      path.setAttribute('d', paths[shape]);
      path.setAttribute('fill', `hsl(${Math.random() * 360}, 100%, 50%)`);

      let startX, startY, endX, endY;
      const centerX = windowSize.width / 2;
      const centerY = windowSize.height / 2;

      switch (pattern) {
        case 'spiral':
          const angle = (index / particleCount) * Math.PI * 20;
          const radius = (index / particleCount) * Math.min(windowSize.width, windowSize.height) ;
          startX = centerX + radius * Math.cos(angle);
          startY = centerY + radius * Math.sin(angle);
          endX = centerX + radius * Math.cos(angle + Math.PI * 2);
          endY = centerY + radius * Math.sin(angle + Math.PI * 2);
          break;
        case 'circular':
          const circleAngle = (index / particleCount) * Math.PI * 2;
          const circleRadius = Math.min(windowSize.width, windowSize.height) / 2;
          startX = centerX + circleRadius * Math.cos(circleAngle);
          startY = centerY + circleRadius * Math.sin(circleAngle);
          endX = centerX + circleRadius * Math.cos(circleAngle + Math.PI);
          endY = centerY + circleRadius * Math.sin(circleAngle + Math.PI);
          break;
        case 'wave':
          startX = (index / particleCount) * windowSize.width;
          startY = centerY + Math.sin((index / particleCount) * Math.PI * 4) * (windowSize.height / 4);
          endX = startX;
          endY = centerY + Math.sin((index / particleCount) * Math.PI * 4 + Math.PI) * (windowSize.height / 4);
          break;
        default:
          startX = Math.random() * windowSize.width;
          startY = Math.random() * windowSize.height;
          endX = Math.random() * windowSize.width;
          endY = Math.random() * windowSize.height;
      }

      const animationDuration = 10 / animationSpeed;
      const randomDelay = Math.random() * animationDuration;

      animateMotion.setAttribute('path', `M${startX},${startY} Q${(startX + endX) / 2},${(startY + endY) / 2 - 100} ${endX},${endY}`);
      animateMotion.setAttribute('dur', `${animationDuration}s`);
      animateMotion.setAttribute('begin', `${randomDelay}s`);
      animateMotion.setAttribute('repeatCount', 'indefinite');

      animateTransform.setAttribute('attributeName', 'transform');
      animateTransform.setAttribute('type', 'rotate');
      animateTransform.setAttribute('from', '0 0 0');
      animateTransform.setAttribute('to', '360 0 0');
      animateTransform.setAttribute('dur', `${animationDuration / 2}s`);
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
        svg.appendChild(createParticle(i));
      }
    };

    init();

  }, [particleCount, maxSize, animationSpeed, backgroundColor, particleTypes, pattern]);

  const toggleParticleType = (type) => {
    setParticleTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className='absolute inset-0' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
     <svg ref={svgRef} width={windowSize.width} height={windowSize.height} fill={'transparent'} />
      
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
        {['heart', 'leaf', 'star', 'snowflake'].map(type => (
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
      <div style={{ marginTop: '20px' }}>
        <label>Pattern:</label>
        {['random', 'spiral', 'circular', 'wave'].map(p => (
          <button 
            key={p} 
            onClick={() => setPattern(p)}
            style={{ 
              margin: '0 5px', 
              padding: '5px 10px', 
              backgroundColor: pattern === p ? 'lightgreen' : 'white'
            }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ParticleAnimation;