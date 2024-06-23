
import ShowIcon from '@/components/svg/showIcon';
import { ImageResponse } from 'next/og';  
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
    'private-lessons',
    'group_classes',
    'floor_fees',
    'parties',
    // 'special_events',
  ];
  const selectedIndex = slugArray.indexOf(id) || null;
    const index1 =
    selectedIndex !== null &&
      selectedIndex >= 0 &&
      selectedIndex < 5
      ? selectedIndex
      : 0
    const titleArray=[
      'Private Lessons Packages | Activities ',
      'Group Classes| Activities',
      'Floor Fees | Activities',
      'Parties or Socials | Activities',
      // 'Special Dance Socials | Activities',
    ];
    // const imgArray=[
    //   'Activities',
    //   'Users',
    //   'Home2',
    //   'Location',
    //   'ClockBallroom',
    // ];
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
          {'Dance at Le Pari Studio'}
        </div>
        <div style={{ width: '400px', height: '400px', display: 'flex'}}>
        <ShowIcon icon={"Activities"} stroke={'0.05'} widthSvg={400} heightSvg={400} fillSvg={'red'}/>
        </div>

       
      </div>
    ),
    {
      ...size,
    }
  );
}