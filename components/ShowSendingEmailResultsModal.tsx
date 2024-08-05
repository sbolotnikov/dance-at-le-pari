import React from 'react'
import AnimateModalLayout from './AnimateModalLayout';
type Props = {
    visibility: boolean;
    status:string[];
    onReturn: () => void;
}

const ShowSendingEmailResultsModal = ({visibility, status, onReturn}: Props) => {
  return (
    <AnimateModalLayout
    visibility={visibility}
    onReturn={() => {
      onReturn();
    }}
  >
    <div
      className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[900px]  flex justify-center items-center flex-col   md:w-[80svw] bg-lightMainBG dark:bg-darkMainBG h-[70svh] md:h-[85svh]
    }`}
    >
      <div
        id="wrapperDiv"
        className="w-full h-full relative  p-1  overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
      >
        <div
          id="containedDiv"
          className={`absolute top-0 left-0 flex flex-col w-full p-1 justify-center items-center`}
        >
          <h2
            className="text-center font-semibold md:text-4xl uppercase"
            style={{ letterSpacing: '1px' }}
          >
            Status of Emailing:
          </h2>
            <div className="flex flex-col justify-center items-center w-full">
                {status.map((value, index) => (
                <div
                    key={index}
                    className={`w-full p-2  border border-lightMainColor dark:border-darkMainColor rounded-md mt-2`}
                >
                    <p className="text-center">{value}</p>
                </div>
                ))}
            </div>    
        </div>
       </div>
    </div>
   </AnimateModalLayout>       
  )
}

export default ShowSendingEmailResultsModal