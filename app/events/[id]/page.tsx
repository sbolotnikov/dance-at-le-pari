'use client';
import { PageWrapper } from '@/components/page-wrapper';
import { TFullEvent } from '@/types/screen-settings';
import { useEffect, useState } from 'react';

export default function Page({ params }: { params: { id: string } }) {
    const[eventData, setEventData] =useState<TFullEvent>()
  useEffect(() => {
    fetch('/api/event/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: params.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setEventData(data.event1);
        console.log(data.event1)
      }).catch((error) => {console.log(error);});
  }, []);
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      <div className="border-0 rounded-md p-4  shadow-2xl w-[90%]  max-w-[450px] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md">
      {eventData &&<div className="w-full h-full flex flex-col justify-center items-center">
        <h1>{eventData?.eventtype}{' : '}<span className="text-2xl font-extrabold font-DancingScript">{eventData!.title}</span></h1>
        <h2 className="flex flex-row items-center justify-center">{"Date : "}<span >{new Date(eventData!.date).toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'numeric',day: 'numeric',})}</span> </h2>
        <h2 className="flex flex-row items-center justify-center">{"Starts at : "}<span >{new Date(eventData!.date).toLocaleTimeString('en-US',{timeStyle: 'short'})}</span> </h2>
        <h2 className="flex flex-row items-center justify-center "><span>{"Description: "}</span><span >{eventData!.description}</span></h2>
        <h2 className="flex flex-row items-center justify-center ">{"Price : $"}<span >{eventData!.price}</span></h2>
        </div>}
      </div>
    </PageWrapper>
  );
}
