import React from 'react'

type Props = {
    title: string;
    children: React.ReactNode;
}

export const BouncingButton = ({children,title}: Props) => {
  return (
    <div className="group flex    cursor-pointer    items-center   group-hover:scale-125  ml-0  justify-center   w-12  flex-col">
     
        <div className="  ml-2 h-10 w-10 rounded-full bg-lightMainBG dark:bg-lightMainColor p-1 my-1.5 mr-2 fill-none group-hover:animate-bounce  order-none mb-1   stroke-lightMainColor dark:stroke-darkMainColor ">
          {children}
        </div>
        
        <p className=" tracking-widest    flex-wrap  rounded-md      bg-lightMainBG  dark:bg-lightMainColor  dark:text-darkMainColor text-lightMainColor group-hover:block z-10 hidden ">
          {title}
        </p>
      </div>
  )
}