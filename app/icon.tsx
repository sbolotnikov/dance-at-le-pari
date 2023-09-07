import Logo from '@/components/svg/logo';
import Image from 'next/image';
import { ImageResponse } from 'next/server';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      // <div  className="bg-transparent bg-contain bg-no-repeat bg-center w-full h-full flex flex-col justify-center items-center"
      // style={{backgroundImage:"url('/logo.svg')"}}
      //    />  
         <div className="  w-full h-full flex flex-col items-center justify-center "> 
         <Logo shadow={'0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'} />           
     </div> 
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
