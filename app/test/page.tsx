'use client';
import { FC, useEffect, useState } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import { PageWrapper } from '../../components/page-wrapper';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
        setLoading(true);
        
      }, []);
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
            {loading && 
      <LoadingScreen />
       }
      <div
        className="border-0 rounded-md p-4  shadow-2xl w-[90%]  max-w-[450px] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md"
        // style={{ boxShadow: '0 0 150px rgb(113, 113, 109 / 50%),inset 0 0 20px #242422' }}
      >
        <h2
          className="text-center font-bold uppercase"
          style={{ letterSpacing: '1px' }}
        >
          Test
        </h2>
      </div>
    </PageWrapper>
  );
};

export default page;

