 
import ShowIcon from '@/components/svg/showIcon';
import { ImageResponse } from 'next/og';
import { title } from 'process';
export const alt = 'My Blog Post';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  // fetch data
   
  
    
  return new ImageResponse(
    (
      <div
        style={{
          background: 'blue',
          width: '100%',
          opacity:"70%",
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '45px',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontStyle: 'italic',
            letterSpacing: '-0.025em',
            color: 'red',
            textAlign: 'justify',
            lineHeight: 1.4,
            textDecoration: 'underline',
            width: '100%',
            fontWeight: 500,
          }}
        >
          {"Wedding Dance Lessons in studio"}
        </div>
        <div style={{ width: '400px', height: '400px', display: 'flex'}}>
        <ShowIcon icon={'Activities'} stroke={'0.1'} widthSvg={400} heightSvg={400} fillSvg={'white'}/>
        </div>

       
      </div>
    ),
    {
      ...size,
    }
  );
}