import {  getPicture, getPost } from '@/utils/functionsservers';
import { ImageResponse } from 'next/og';
export const alt = 'My Blog Post';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({
  params: { slug },
}: {
  params: { slug: string };
}) {
  // fetch data
  const post = await getPost(slug);
  let img: string | null | undefined = null;
  if (
    post?.img !== null &&
    post?.img !== undefined &&
    !post?.img!.includes('http')
  )
    img = await getPicture(post?.img);
  else img = post?.img;

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
          {post?.title}
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
              color: 'transparent',
              backgroundImage: 'linear-gradient(to right, #ec4899, #8b5cf6)',
              fontWeight: 700,
              fontSize: 30,
              marginLeft: '20px',
            }}
          >
            {'Posted by : ' + post?.user.name}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              justifyItems: 'center',
              width: '50%',
              flexWrap: 'wrap',
              marginRight: '20px',
              marginTop: '10px',
            }}
          >
            {['keyword1', 'keyword2', 'keyword3'].map((topic, i) => (
              <div
                key={i}
                style={{
                  color: 'black',
                  fontSize: 20,
                  padding: '5px',
                  margin: '3px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                }}
              >
                {topic}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
