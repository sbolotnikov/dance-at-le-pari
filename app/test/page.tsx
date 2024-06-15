'use client';
import { FC, useState } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import { PageWrapper } from '../../components/page-wrapper';
import ReceiptModal from '@/components/ReceiptModal';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const [img, setImage] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      
      {visibleModal && <ReceiptModal invoice={"zdxfcghjkl"} visibility={visibleModal} onReturn={(loadStatus, finished)=>{
        console.log("call");
        (loadStatus) ? setLoading(true): setLoading(false);
        if (finished) {setVisibleModal(false); 
          
        }
        
        }}  />}
        {loading && <LoadingScreen />}
      <div
        className="blurFilter border-0 rounded-md p-4  shadow-2xl w-[90%]  max-w-[450px] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70"
        // style={{ boxShadow: '0 0 150px rgb(113, 113, 109 / 50%),inset 0 0 20px #242422' }}
      >
        <h2
          className="text-center font-bold uppercase"
          style={{ letterSpacing: '1px' }}
        >
          Test
        </h2>
        <div id="code1" className="h-auto w-full max-w-24 my-1 mx-auto">
          <button onClick={()=>setVisibleModal(true)}> modal call</button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
