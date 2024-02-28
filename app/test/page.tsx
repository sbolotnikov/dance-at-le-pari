'use client';
import { FC, useEffect, useState } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import { PageWrapper } from '../../components/page-wrapper';
import QRCode from 'react-qr-code';
import * as htmlToImage from 'html-to-image';
import { toBlob } from 'html-to-image';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const [img, setImage] = useState("");
  const fileToBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
     resolve(reader.result as string);
    };

    reader.readAsDataURL(file);
    reader.onerror = reject;
  });
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {loading && <LoadingScreen />}
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
        <div id="code1" className="h-auto w-full max-w-24 my-1 mx-auto">
          <QRCode
            size={256}
            style={{
              height: 'auto',
              maxWidth: '100%',
              width: '100%',
            }}
            value={JSON.stringify({
              invoice: 'asdhfnfdh34t564',
              seat: 1,
              table: 4,
              event: 56,
            })}
            viewBox={`0 0 256 256`}
          />
        </div>
        <button onClick={()=>{
// htmlToImage.toBlob(document.getElementById('code1')!)
// .then(async (blob)=> {
//   setImage(await fileToBase64(blob!));
 
// });
htmlToImage.toJpeg(document.getElementById('code1')!, { quality: 0.95 })
  .then( (blob)=> {
    setImage(blob);
   
  });
        }}>Get Blob</button>
        {(img>"")&&<img src={img} className='h-24 w-24 m-3' alt="qr" />}
      </div>
    </PageWrapper>
  );
};

export default page;
