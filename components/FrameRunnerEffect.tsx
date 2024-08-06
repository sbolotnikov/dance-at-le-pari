import React from 'react'

type Props = {
    className: string;
}
const FrameRunnerEffect: React.FC<Props> = ({className}) => {
    let colors=['#bd2424','#7e9114','#75500b', 'black', '#7e9114', '#bd2424','#7e9114','#75500b', 'black', '#7e9114','#bd2424']
    let gradient=`conic-gradient(
              from var(--gradient-angle),
              ${colors.join(',')}
            ) 1`
    return ( 
      <div 
        className={`${className} frameRunner`}
        style={{
          borderImage: gradient,
        }}
      >
        <style>{`
          .frameRunner::before {
            border-image: ${gradient}
          }
        `}</style>
        <style>{`
          .frameRunner::after {
            border-image: ${gradient}
          }
        `}</style>
      </div>   
    )
}

export default FrameRunnerEffect