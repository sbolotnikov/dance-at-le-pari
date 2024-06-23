 
import ShowIcon from '@/components/svg/showIcon';
import { ImageResponse } from 'next/og'; 
export const alt = 'My Blog Post';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image({
  params: { id },
}: {
  params: { id: string };
}) {
  // fetch data
  const slugArray=[
    'welcome',
    'our-team',
   'studio-tour',
    'location',
    'hours',
  ];
  const selectedIndex = slugArray.indexOf(id) || null;
    const index1 =
    selectedIndex !== null &&
      selectedIndex >= 0 &&
      selectedIndex < 5
      ? selectedIndex
      : 0
//   const post = await getPost(slug);
    const titleArray=[
      'Welcome to Dance At Le Pari Studio',
      'Our Professional Team',
      'Studio Interior/Exterior tour',
      'Our Location',
      'Hours Of Operation',
    ];
    const imgArray=[
      'Home',
      'Users',
      'Home2',
      'Location',
      'ClockBallroom',
    ];
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
          {titleArray[index1]}
        </div>
        <div style={{ width: '400px', height: '400px', display: 'flex'}}>
        <ShowIcon icon={imgArray[index1]} stroke={'0.05'} widthSvg={400} heightSvg={400} fillSvg={'red'}/>
        </div>

       
      </div>
    ),
    {
      ...size,
    }
  );
}