import { ImageResponse  } from 'next/og';
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';
export default async function  GET (req: Request) {
   
    const { searchParams } = new URL(req.url);
    // code for generating the OG image goes here
    const title = searchParams.has('title')
      ? searchParams.get('title')?.slice(0, 100)
      : 'DevToMars';
    const mainTopics = searchParams.get('mainTopics')?.split(',');
 
    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: 'black',
            backgroundSize: '150px 150px',
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            padding: '65px',
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              color: 'white',
              marginTop: 30,
              padding: '0 100px',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
              height: '75%',
              fontWeight: 700,
              textTransform: 'capitalize',
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <div style={{ width: '70px', height: '70px', display: 'flex' }}>
              <img
                src="https://media.graphassets.com/gncWvSEqRFaBSUPZGoTP"
                width={70}
                height={70}
                alt="devtomars blog"
              />
            </div>

            <div
              style={{
                backgroundClip: 'text',
                color: 'transparent',
                backgroundImage: 'linear-gradient(to right, #ec4899, #8b5cf6)',
                fontWeight: 700,
                fontSize: 30,
              }}
            >
              DevToMars
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                justifyItems: 'center',
                width: '75%',
              }}
            >
              {mainTopics && mainTopics.map((topic, i) => (
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
      ), // ImageResponse options
      {
        // For convenience, we can re-use the exported icons size metadata
        // config to also set the ImageResponse's width and height.
        ...size,
      }
    );
  
}
