 
import ShowIcon from '@/components/svg/showIcon';
import { getCategory } from '@/utils/functionsservers';
import { ImageResponse } from 'next/og';
import { title } from 'process';
export const alt = 'My Blog Post';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({
    params: { cat },
  }: {
    params: { cat: string };
  }) {
  // fetch data
   
  let category1: any
  if (cat!='0') category1 = await getCategory(cat)
    
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1.4,
            textDecoration: 'underline',
            width: '100%',
            fontWeight: 500,
          }}
        >
          {`${(cat!='0')?category1?.title:"All"} Categor${(cat!='0')?'y':"ies"} of Dance Blog`}
        </div>
        <div style={{ width: '400px', height: '400px', display: 'flex'}}>
        <ShowIcon icon={'Blog'} stroke={'0.1'} widthSvg={400} heightSvg={400} fillSvg={'red'}/>
        </div>

       
      </div>
    ),
    {
      ...size,
    }
  );
}