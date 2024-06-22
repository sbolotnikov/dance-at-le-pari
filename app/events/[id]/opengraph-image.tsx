import {  getEvent, getPicture, getPost } from '@/utils/functionsservers';
import { ImageResponse } from 'next/og';
export const alt = 'My Blog Post';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({
  params: { id },
}: {
  params: { id: string };
}) {
  // fetch data
  const event1 = await getEvent(parseInt(id));
  let img: string | null | undefined = null;
  if (
    event1?.image !== null &&
    event1?.image !== undefined &&
    !event1?.image!.includes('http')
  )
    img = await getPicture(event1?.image);
  else img = event1?.image;

  return new ImageResponse(
    (
      <div
        style={{
          background: 'darkblue',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '25px',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontStyle: 'italic',
            letterSpacing: '-0.025em',
            color: 'red',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1.4,
            textDecoration: 'underline',
            width: '100%',
            fontWeight: 500,
          }}
        >
          {event1?.title}
        </div>
        <div style={{ width: '600px', height: '400px', display: 'flex' }}>
          <img
            width={600}
            height={400}
            src={img != undefined ? img : ''}
            alt={'add'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            alignItems: 'center',
            fontFamily: 'Inter, sans-serif',
          }}
        >  
          <div
            style={{
              backgroundClip: 'text',
              width: '70%',
              color: 'transparent',
              backgroundImage: 'linear-gradient(to right, #ec4899, #8b5cf6)',
              fontWeight: 700,
              fontSize: 40,
              marginLeft: '20px',
            }}
          >
            { new Date(event1?.date!).toLocaleDateString('en-us', {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})+" "+  new Date(event1?.date!).toLocaleTimeString('en-us', { timeStyle: 'short', })} 
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              justifyItems: 'center',
              width: '30%', 
              marginRight: '20px',
              marginTop: '10px',
            }}
          >
            
              <div 
                style={{
                  color: 'black',
                  fontSize: 35,
                  padding: '5px',
                  margin: '3px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                }}
              >
                {event1?.template.eventtype}
              </div> 
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}