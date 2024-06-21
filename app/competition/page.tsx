'use client';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/page-wrapper';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const router = useRouter();

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center md:items-end justify-center">
      <div
        className="blurFilter border-0 rounded-md p-2  shadow-2xl w-[90%] h-[70svh] md:h-[85svh]  max-w-[450px] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 md:mb-3"
        // style={{ boxShadow: '0 0 150px rgb(113, 113, 109 / 50%),inset 0 0 20px #242422' }}
      >
        <div className="border rounded-md border-lightMainColor dark:border-darkMainColor w-full h-full   p-2 flex flex-col relative">
          <h2
            className="text-center font-semibold md:text-4xl uppercase"
            style={{ letterSpacing: '1px' }}
          >
            Competitions
          </h2>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
