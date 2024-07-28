'use client';
import React, { useState, useEffect, useRef } from 'react';

const ParticleAnimation = () => {
  // const [particleCount, setParticleCount] = useState(100);
  // const [maxSize, setMaxSize] = useState(20);
  // const [animationSpeed, setAnimationSpeed] = useState(2);
  // const [particleTypes, setParticleTypes] = useState(['heart', 'leaf', 'star']);
  // const svgRef = useRef(null);
  // const particlesRef = useRef([]);
  // const animationFrameRef = useRef(null);
  // const lastBurstTimeRef = useRef(0);
  // const windowSize = { width: 1400, height: 1000 };

  // useEffect(() => {
  //   const svg = svgRef.current;
  //   const svgNS = "http://www.w3.org/2000/svg";

  //   const createParticle = (startX, startY) => {
  //     const particle = document.createElementNS(svgNS, "g");
  //     const path = document.createElementNS(svgNS, "path");
      
  //     particle.appendChild(path);
  //     svg.appendChild(particle);

  //     const resetParticle = () => {
  //       const shape = particleTypes[Math.floor(Math.random() * particleTypes.length)];
  //       const size = Math.random() * maxSize;

  //       const paths = {
  //         heart: `M ${size/2},0 A ${size/4},${size/4} 0 0,1 ${size},${size/2} A ${size/4},${size/4} 0 0,1 ${size/2},${size} A ${size/4},${size/4} 0 0,1 0,${size/2} A ${size/4},${size/4} 0 0,1 ${size/2},0 Z`,
  //         leaf: `M0,0 Q${size/2},${size/4} ${size},0 T${size},${size} ${size/2},${size} 0,${size} -${size/2},${size} -${size},${size} -${size},0 0,0 Z`,
  //         star: `M0,-${size} L${size/4},-${size/4} L${size},0 L${size/4},${size/4} L${size/2},${size} L0,${size/2} L-${size/2},${size} L-${size/4},${size/4} L-${size},0 L-${size/4},-${size/4} Z`
  //       };

  //       path.setAttribute('d', paths[shape]);
  //       path.setAttribute('fill', `hsl(${Math.random() * 360}, 100%, 50%)`);

  //       const distance = (Math.random() * 5/6 + 1/6) * Math.min(windowSize.width, windowSize.height);
  //       const angle = Math.random() * 2 * Math.PI;
  //       const endX = startX + distance * Math.cos(angle);
  //       const endY = startY + distance * Math.sin(angle);

  //       const animationDuration = 5 / animationSpeed;

  //       particle.innerHTML = ''; // Clear previous animations
  //       particle.appendChild(path);

  //       const animateMotion = document.createElementNS(svgNS, "animateMotion");
  //       animateMotion.setAttribute('path', `M${startX},${startY} L${endX},${endY}`);
  //       animateMotion.setAttribute('dur', `${animationDuration}s`);
  //       animateMotion.setAttribute('begin', '0s');
  //       animateMotion.setAttribute('fill', 'freeze');
  //       particle.appendChild(animateMotion);

  //       const animateTransform = document.createElementNS(svgNS, "animateTransform");
  //       animateTransform.setAttribute('attributeName', 'transform');
  //       animateTransform.setAttribute('type', 'rotate');
  //       animateTransform.setAttribute('from', '0 0 0');
  //       animateTransform.setAttribute('to', '360 0 0');
  //       animateTransform.setAttribute('dur', `${animationDuration}s`);
  //       animateTransform.setAttribute('begin', '0s');
  //       animateTransform.setAttribute('fill', 'freeze');
  //       particle.appendChild(animateTransform);

  //       const animateOpacity = document.createElementNS(svgNS, "animate");
  //       animateOpacity.setAttribute('attributeName', 'opacity');
  //       animateOpacity.setAttribute('values', '0;1;1;0');
  //       animateOpacity.setAttribute('keyTimes', '0;0.1;0.9;1');
  //       animateOpacity.setAttribute('dur', `${animationDuration}s`);
  //       animateOpacity.setAttribute('begin', '0s');
  //       animateOpacity.setAttribute('fill', 'freeze');
  //       particle.appendChild(animateOpacity);

  //       const animateColor = document.createElementNS(svgNS, "animate");
  //       animateColor.setAttribute('attributeName', 'fill');
  //       animateColor.setAttribute('dur', `${animationDuration}s`);
  //       animateColor.setAttribute('begin', '0s');
  //       animateColor.setAttribute('values', 'hsl(0, 100%, 50%); hsl(60, 100%, 50%); hsl(120, 100%, 50%); hsl(180, 100%, 50%); hsl(240, 100%, 50%); hsl(300, 100%, 50%); hsl(360, 100%, 50%)');
  //       animateColor.setAttribute('fill', 'freeze');
  //       path.appendChild(animateColor);

  //       const animateScale = document.createElementNS(svgNS, "animateTransform");
  //       animateScale.setAttribute('attributeName', 'transform');
  //       animateScale.setAttribute('type', 'scale');
  //       animateScale.setAttribute('from', '1');
  //       animateScale.setAttribute('to', '1.5');
  //       animateScale.setAttribute('dur', `${animationDuration}s`);
  //       animateScale.setAttribute('begin', '0s');
  //       animateScale.setAttribute('fill', 'freeze');
  //       particle.appendChild(animateScale);

  //       setTimeout(resetParticle, animationDuration * 1000);
  //     };

  //     resetParticle();
  //     return particle;
  //   };

  //   const createParticleBurst = () => {
  //     const startX = Math.random() * windowSize.width;
  //     const startY = Math.random() * windowSize.height;

  //     if (particlesRef.current.length < particleCount) {
  //       const newParticles = particleCount - particlesRef.current.length;
  //       for (let i = 0; i < newParticles; i++) {
  //         const particle = createParticle(startX, startY);
  //         particlesRef.current.push(particle);
  //       }
  //     } else if (particlesRef.current.length > particleCount) {
  //       const excessParticles = particlesRef.current.length - particleCount;
  //       for (let i = 0; i < excessParticles; i++) {
  //         const particle = particlesRef.current.pop();
  //         svg.removeChild(particle);
  //       }
  //     }

  //     // particlesRef.current.forEach(particle => {
  //     //   const resetEvent = new Event('reset');
  //     //   particle.dispatchEvent(resetEvent);
  //     // });
  //   };

  //   const animate = (timestamp) => {
  //     if (timestamp - lastBurstTimeRef.current > (Math.random() * 2000 + 1000)) {
  //       createParticleBurst();
  //       lastBurstTimeRef.current = timestamp;
  //     }

  //     animationFrameRef.current = requestAnimationFrame(animate);
  //   };

  //   animationFrameRef.current = requestAnimationFrame(animate);

  //   return () => {
  //     if (animationFrameRef.current) {
  //       cancelAnimationFrame(animationFrameRef.current);
  //     }
  //     particlesRef.current.forEach(particle => {
  //       if (svg.contains(particle)) {
  //         svg.removeChild(particle);
  //       }
  //     });
  //     particlesRef.current = [];
  //   };

  // }, [particleCount, maxSize, animationSpeed, particleTypes]);

  // const toggleParticleType = (type) => {
  //   setParticleTypes(prev => 
  //     prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
  //   );
  // };

  return (
    <div className='absolute inset-0' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      {/* <svg ref={svgRef} width={windowSize.width} height={windowSize.height} fill={'transparent'} />
      
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
        {['heart', 'leaf', 'star'].map(type => (
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
      </div> */}
    </div>
  );
};

export default ParticleAnimation;