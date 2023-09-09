'use client'
import {FC} from 'react'
import { useRouter } from 'next/navigation'
import { useRef  } from 'react';
interface pageProps {
  
}

const page: FC<pageProps> = ({}) => {

      const router = useRouter();
      const emailRef = useRef<HTMLInputElement>(null);
 

    
      return (
        <div
        className="absolute top-0 left-0 w-full h-screen flex items-center justify-center"
      >
      {/* {revealAlert && <AlertMenu onReturn={onReturn} styling={alertStyle} />} */}
        <div
          className="border-0 rounded-md p-4  shadow-2xl w-[90%]  max-w-[450px] md:w-full"
          // style={{ boxShadow: '0 0 150px rgb(113, 113, 109 / 50%),inset 0 0 20px #242422' }}
        >
          <h2
            className="text-center font-bold uppercase"
            style={{   letterSpacing: '1px' }}
          >
           Weddings
          </h2>

        </div>
        </div>
      );
    }


export default page