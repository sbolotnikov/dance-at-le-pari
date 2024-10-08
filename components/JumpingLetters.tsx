import React from 'react'

type Props = {
    text: string;
}

const JumpingLetters = ({text}: Props) => {
  return (
    <div className="flex flex-row justify-center items-center h-full w-full">
        {text.split('').map((letter, i) => (
            <span key={i} className={` `}
            style={{
                animation: `jump 3s ${i*0.2}s ease-in-out infinite`,
                
              }}
            >{letter}</span>
        ))}
    </div>
  )
}

export default JumpingLetters