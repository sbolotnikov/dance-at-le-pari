import { getPicture, getPost } from "@/utils/functionsservers";
import { ImageResponse } from "next/og";
export const alt = 'My Blog Post';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
export default async function Image ({params:{slug},}:{params:{slug:string};}){
     

  // fetch data
  const post = await getPost(slug);
  let img:string | null | undefined = null;
  if (post?.img!==null && post?.img!==undefined && (!post?.img!.includes('http'))) img = await getPicture(post?.img) 
    else img = post?.img
   
  const messageDecoded = decodeURIComponent(slug);
  return new ImageResponse(
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
       <img width={300} height={300} alt={'Logo'} src={ (img!=undefined)?img:""}  />  
      <p>{post?.title}</p>
    </div>,
    {
     ...size,
    }
  );
}