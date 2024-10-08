'use client';
import React, { useEffect } from 'react'
import ShowIcon from './svg/showIcon'
import ImgFromDb from './ImgFromDb'
import { useSession } from 'next-auth/react'
import Fredbot from './svg/Fredbot';
import JumpingLetters from './JumpingLetters';

type Props = {
    messages: string[],
    loading: boolean
}

const MessagesBox = ({messages, loading}: Props) => {
    const { data: session } = useSession();
    useEffect(() => {
        let goToTop = document.getElementById("messagesBox");
        goToTop!.scrollIntoView({ behavior: "instant", block: "end" });
    },[messages])
  return (
    <div id="messagesBox" className='absolute top-0 left-0 w-full flex flex-col' >
      {messages.map((msg, i) => (
          <div key={i} className={`w-[70%] py-2 my-2 ${(i % 2==0)?"mr-2 pr-2 text-right self-end":"ml-2 pl-2 text-left self-start"} bg-lightMainBG dark:bg-darkMainBG flex-wrap  rounded-md`}>
              <div className={`${(i % 2==0)?"float-right":"float-left"} m-1 w-14 h-14 rounded-full overflow-hidden relative`}>
                  {(i % 2==0) ? (
                      <div className="w-40 h-40 absolute top-0 -left-14 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                        {/* <ShowIcon icon={'Chatbot'} stroke={'0.05'} /> */}
                        <Fredbot/>
                        </div>
                  ) : (
                      session && session!==null && session.user.image ? (
                          <ImgFromDb
                            url={session.user.image ? session.user.image : ''}
                            stylings="object-fill h-14 w-14"
                            alt="profile picture"
                          />
                        ) : (
                          <div className=" h-14 w-14 fill-none  bg-lightMainBG dark:bg-lightMainColor  stroke-lightMainColor dark:stroke-darkMainColor ">
                            <ShowIcon icon={'DefaultUser'} stroke={'2'} />
                          </div>
                        )
                  )}
              </div>
              {msg}
          </div>
      ))}
      {loading && <div  className={`w-[75%] md:w-[50%] h-16 py-2 my-2 mr-2 pr-2 text-center text-xl md:text-4xl tracking-[.5em] self-center  text-darkMainColor dark:text-lightMainColor flex-wrap  rounded-md`}><JumpingLetters text={'Loading...'} /></div>}
    </div>
  )
}

export default MessagesBox