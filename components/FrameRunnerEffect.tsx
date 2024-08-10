import React from 'react'

type Props = {
    className: string;
}
const FrameRunnerEffect: React.FC<Props> = ({className}) => {
    let colors=['#fd0909','#faf601', '#faf601','#fd0909','#faf601','#faf601', ]
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