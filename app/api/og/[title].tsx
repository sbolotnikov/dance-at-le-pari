 
 
import { ImageResponse } from 'next/og';

// Route segment config
// export const runtime = 'edge';

// Image metadata
export const size = {
  width: 640,
  height: 640,
};
export const contentType = 'image/png';

// Image generation
export default   function  GET (req: Request) {
  return new ImageResponse(
    (
    //   ImageResponse JSX element
    <div
    style={{ 
      background: 'green',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
       
    }}
  >
    <div style={{ width: '300px', height: '300px', display: 'flex' }}>
      <img width={132} height={132} alt={'Logo'} src={ 'https://dance-at-le-pari.vercel.app/favicon-32x32.png'}  />
      </div>
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