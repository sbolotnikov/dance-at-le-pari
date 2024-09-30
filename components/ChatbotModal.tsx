import React from 'react'
import AnimateModalLayout from './AnimateModalLayout';

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
    <div className=" blurFilter border-0 rounded-md p-2 shadow-2xl w-[90%] max-w-[450px] max-h-[85%] overflow-y-auto md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70">
        <div className="w-full h-full flex flex-col justify-center items-center border rounded-md border-lightMainColor dark:border-darkMainColor relative p-2">
          <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold">Chat with us</h2>
          </div>
        </div>
    </div>      
    </AnimateModalLayout>
  )
}

export default ChatbotModal