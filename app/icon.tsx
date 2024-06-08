import Logo from '@/components/svg/logo';
 
import { ImageResponse } from 'next/og';

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
    //   ImageResponse JSX element
    <div
    style={{ 
      background: 'transparent',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
       
    }}
  >
      <img width={32} height={32} alt={'Logo'} src={ 'https://dance-at-le-pari.vercel.app/favicon-32x32.png'}  />
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
