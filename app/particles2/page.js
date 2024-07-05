'use client';
import React, { useState, useEffect, useRef } from 'react';

const ParticleAnimation = () => {
  const [particleCount, setParticleCount] = useState(100);
  const [maxSize, setMaxSize] = useState(20);
  const [animationSpeed, setAnimationSpeed] = useState(2);
  const [backgroundColor, setBackgroundColor] = useState(['#000000', '#1a237e', '#004d40', '#b71c1c']);
  const [particleTypes, setParticleTypes] = useState(['snowflake', 'heart', 'leaf', 'star']);
  const svgRef = useRef(null);

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
        snowflake: `M11.2247 0.985922C3.52686 1.49069 -1.27966 9.70661 2.01218 16.7332C5.49182 24.1605 15.8436 25.2758 20.7515 18.752C26.4948 11.1179 20.7275 0.362794 11.2247 0.985922ZM13.4097 2.04627C22.0032 3.33321 25.0751 14.1278 18.4377 19.7145C11.9431 25.181 1.9694 20.5155 1.9694 12.011C1.9694 5.92034 7.44287 1.15275 13.4097 2.04627ZM11.535 5.01552C9.2833 5.75419 9.74756 9.03403 12.1038 9.03403C14.8067 9.03403 14.8829 5.05981 12.1813 4.9871C11.8969 4.97941 11.6061 4.99226 11.535 5.01552ZM12.5012 6.00842C13.0343 6.2098 13.3283 6.91703 13.0916 7.4291C12.6206 8.4476 11.1501 8.1847 11.0791 7.06926C11.0298 6.2941 11.7784 5.73569 12.5012 6.00842ZM10.1925 9.8455C9.67096 9.99539 9.51844 10.2991 9.51844 11.188C9.51844 12.0997 9.72997 12.4703 10.3029 12.562L10.5008 12.5937V14.3215V16.0492H10.3432C9.7844 16.0492 9.51844 16.485 9.51844 17.4004C9.51844 18.7714 9.56141 18.7933 12.2447 18.7933C14.4953 18.7933 14.4477 18.8006 14.7653 18.4076L14.9217 18.2141V17.4256C14.9217 16.4284 14.7026 16.0492 14.1262 16.0492H13.9652L13.9649 13.37C13.9645 9.58143 14.0904 9.78194 11.7159 9.78973C10.9766 9.79206 10.291 9.81717 10.1925 9.8455ZM12.9424 13.7442L12.9569 16.7201L13.0986 16.8619C13.2202 16.9836 13.2913 17.0065 13.6027 17.0241L13.9652 17.0447V17.4271V17.8095H12.2331H10.5008V17.4271V17.0447L10.8633 17.0241C11.1748 17.0065 11.2458 16.9836 11.3675 16.8619L11.5092 16.7201L11.5245 14.4561C11.5444 11.5245 11.5611 11.5968 10.8652 11.5968H10.5008V11.1826V10.7684H11.7144H12.9278L12.9424 13.7442 Z`,
        heart: `M ${size/2},0 A ${size/4},${size/4} 0 0,1 ${size},${size/2} A ${size/4},${size/4} 0 0,1 ${size/2},${size} A ${size/4},${size/4} 0 0,1 0,${size/2} A ${size/4},${size/4} 0 0,1 ${size/2},0 Z`,
        leaf: `M0,0 Q${size/2},${size/4} ${size},0 T${size},${size} ${size/2},${size} 0,${size} -${size/2},${size} -${size},${size} -${size},0 0,0 Z`,
        star: `M0,-${size} L${size/4},-${size/4} L${size},0 L${size/4},${size/4} L${size/2},${size} L0,${size/2} L-${size/2},${size} L-${size/4},${size/4} L-${size},0 L-${size/4},-${size/4} Z`
      };

      path.setAttribute('d', paths[shape]);
      path.setAttribute('fill', `hsl(${Math.random() * 360}, 100%, 50%)`);

      const startX = Math.random() * 800;
      const startY = Math.random() * 600;
      const endX = Math.random() * 800;
      const endY = Math.random() * 600;

      const animationDuration = 10 / animationSpeed;
      const randomDelay = Math.random() * animationDuration;

      animateMotion.setAttribute('path', `M${startX},${startY} L${endX},${endY}`);
      animateMotion.setAttribute('dur', `${animationDuration}s`);
      animateMotion.setAttribute('begin', `${randomDelay}s`);
      animateMotion.setAttribute('repeatCount', 'indefinite');

      animateTransform.setAttribute('attributeName', 'transform');
      animateTransform.setAttribute('type', 'rotate');
      animateTransform.setAttribute('from', '0 0 0');
      animateTransform.setAttribute('to', '360 0 0');
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <svg ref={svgRef} width="800" height="600" style={{ border: '1px solid black', marginBottom: '20px' }} />
      
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
        {['snowflake', 'heart', 'leaf', 'star'].map(type => (
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
  );
};

export default ParticleAnimation;