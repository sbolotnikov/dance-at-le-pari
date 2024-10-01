import React from 'react'
import AnimateModalLayout from './AnimateModalLayout';
import ShowIcon from './svg/showIcon';
import MessagesBox from './MessagesBox';

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
    <div className=" blurFilter border-0 rounded-md p-2 shadow-2xl w-[90%] max-w-[1050px] max-h-[85%] overflow-y-auto  md:w-full md:mt-8 bg-lightMainBG dark:bg-darkMainBG">
        <div className="w-full h-[70svh] flex flex-col justify-center items-center border rounded-md border-lightMainColor dark:border-darkMainColor relative p-2">
          <div className="container mx-auto p-2 h-[20%]">
            <h2 className="text-2xl font-bold text-center">Chat with AstaireBot</h2>
          <div className="h-10 w-10 md:h-16 md:w-16 m-auto  p-1 fill-none  stroke-lightMainColor dark:stroke-darkMainColor">
              <ShowIcon icon={'Chatbot'} stroke={'0.2'} />
          </div>
          </div>
          <div className="w-full h-[75%] border rounded-md border-lightMainColor dark:border-darkMainColor relative overflow-y-auto dark:bg-lightMainBG bg-darkMainBG">
            <MessagesBox messages={['Hello, How can I help?', 'I need a lot of things.  ', 'Ooo, let me think about it.. ']} />
             
          </div>
          <textarea   rows={3} className="w-full rounded-md m-2 bg-darkMainBG dark:bg-lightMainBG text-darkMainColor dark:text-lightMainColor border-lightMainColor dark:border-darkMainColor border-2 p-2" placeholder="Type your message here..."></textarea>
        </div>
    </div>      
    </AnimateModalLayout>
  )

}
export default ChatbotModal