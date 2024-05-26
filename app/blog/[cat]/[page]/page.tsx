'use client';
import { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import ShowIcon from '@/components/svg/showIcon';
import { useDimensions } from '@/hooks/useDimensions'; 
import BlogCardList from '@/components/BlogCardList';
interface pageProps {}

export default function Page( params : {params: { cat: string, page: string}} ) {
  const windowSize = useDimensions();
 console.log(params, );
  useEffect(() => {
    // GET request
    // fetch('/api/event/allget', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
           
    //     setEventsSet(data.eventJSON);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, []);

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center ">
      <div className="border-0 rounded-md p-2 mt-6 shadow-2xl w-[95%] h-[70svh] md:h-[85svh] max-w-5xl md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md">
        <div className="border rounded-md border-lightMainColor dark:border-darkMainColor w-full h-full   p-2 flex flex-col">
          <h2
            className="text-center font-semibold md:text-4xl uppercase"
            style={{ letterSpacing: '1px' }}
          >
            {params.params.cat !== '0' ? params.params.cat + ' ' : ''}Blog
          </h2>
          <div
            id="icon"
            className=" h-20 w-20 md:h-28 md:w-28 fill-lightMainColor stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor m-auto"
          >
            <ShowIcon icon={'Blog'} stroke={'0.1'} />
          </div>
          <div className="">
            <BlogCardList page={params.params.page} cat={params.params.cat=="0"?"":params.params.cat} />
            {/* <Menu /> */}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
