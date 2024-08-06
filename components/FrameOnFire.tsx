import React from 'react'

type Props = {
    width: string;
    height: string; 
}

const FrameOnFire = ({width, height}: Props) => {
  return (
    <div>
         <div className={`h-[${height}] w-[${width}] frameAnimate` }>
             
         </div>   
        <svg>
          <filter id="wavy" className='w-0 h-0'>
            <feTurbulence
              x="0"
              y="0"
              baseFrequency="0.02"
              numOctaves="5"
              seed="2"
            >
              <animate
                attributeName="baseFrequency"
                dur="60s"
                values="0.02;0.05;0.02"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="30" />
          </filter>
        </svg>
    </div>
  )
}

export default FrameOnFire