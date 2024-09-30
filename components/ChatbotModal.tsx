import React from 'react'
import AnimateModalLayout from './AnimateModalLayout';
import ShowIcon from './svg/showIcon';

type Props = {
    visibility: boolean;
  onReturn: () => void;
}

const ChatbotModal = ({visibility, onReturn}: Props) => {
    console.log("visibility:",visibility)
  return (
    <AnimateModalLayout
    visibility={visibility}
    onReturn={() => {
      onReturn();
    }}
  >
    <div className=" blurFilter border-0 rounded-md p-2 shadow-2xl w-[90%] max-w-[1050px] max-h-[85%] overflow-y-auto md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70">
        <div className="w-full h-[70svh] flex flex-col justify-center items-center border rounded-md border-lightMainColor dark:border-darkMainColor relative p-2">
          <div className="container mx-auto p-2 h-[20%]">
            <h2 className="text-2xl font-bold text-center">Chat with us</h2>
          <div className="h-10 w-10 md:h-16 md:w-16 m-auto">
              <ShowIcon icon={'Chatbot'} stroke={'0.1'} />
          </div>
          </div>
          <div className="w-full h-[75%] border rounded-md border-lightMainColor dark:border-darkMainColor">
             Lorem ...
          </div>
          <input type="text" className="w-full rounded-md m-2 bg-lightMainBG" />
        </div>
    </div>      
    </AnimateModalLayout>
  )
}

export default ChatbotModal