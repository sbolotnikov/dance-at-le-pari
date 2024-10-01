import React, { useEffect } from 'react'

type Props = {
    messages: string[]
}

const MessagesBox = ({messages}: Props) => {
    useEffect(() => {
        let goToTop = document.getElementById("messagesBox");
        goToTop!.scrollIntoView({ behavior: "instant", block: "end" });
    },[messages])
  return (
    <div id="messagesBox" className='absolute top-0 left-0 w-full flex flex-col' >
        {messages.map((msg, i) => (
            <div key={i} className={`w-[70%] py-2 my-2 ${(i % 2==0)?"ml-2 pr-2 text-right self-end":"mr-2 pl-2 text-left self-start"} bg-lightMainBG dark:bg-darkMainBG flex-wrap  rounded-md`}>
            {msg}
            </div>
        ))}
    </div>
  )
}

export default MessagesBox