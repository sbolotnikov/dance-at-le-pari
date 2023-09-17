'use client';
import { FC } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import Schedule from '@/components/Schedule';
interface pageProps {}

const page: FC<pageProps> = ({}) => {

  const eventsSet=[{color:"#612326",date:'2023-09-29T19:00:00',tag:"Party", id:0},{color:"#612326",date:'2023-09-29T19:00:00',tag:"Group", id:1},{color:"#9c15e4",date:'2023-09-29T14:00:00',tag:"early Party", id:2}]
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {/* {revealAlert && <AlertMenu onReturn={onReturn} styling={alertStyle} />} */}
      <div
        className="border-0 rounded-md p-4  shadow-2xl w-[95%] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md"
        // style={{ boxShadow: '0 0 150px rgb(113, 113, 109 / 50%),inset 0 0 20px #242422' }}
      >
        {/* <h2
          className="text-center font-bold uppercase"
          style={{ letterSpacing: '1px' }}
        >
          Calendar
        </h2> */}

        <Schedule eventsSet={eventsSet}/>
      </div>
    </PageWrapper>
  );
};

export default page;