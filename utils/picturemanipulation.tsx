'use server'
import { v4 as uuidv4 } from 'uuid';
import Resizer from 'react-image-file-resizer';
import { TPictureWithCapture } from '@/types/screen-settings';
import { prisma } from '@/lib/prisma';
 
  export async function deleteImage(id:string ) {
    fetch('/api/img_del', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id:id,
        }),
      }).then(async(res)=>{
        const data = await res.json();
        console.log(data)
        return (data)
      }).catch(async err => {
        const data = await err.json();
        console.log(data)
        return (data)})
    }

  const resizeFile = (file: any, sizeX:number, sizeY:number) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      sizeX,
      sizeY,
      'JPEG',
      85,
      0,
      (uri: any) => {
        resolve(uri);
      },
      'file'
    );
  });

  
  const fileToBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
     resolve(reader.result as string);
    };

    reader.readAsDataURL(file);
    reader.onerror = reject;
  });
  export async function uploadImage(url:any, sizeX:number, sizeY:number, folder:string)
  
  {
    try {
      const image = (await resizeFile(
        url, sizeX, sizeY
      )) as any;
      
      let filename = folder;
      
      const base64Url=await fileToBase64(image)
      const res= await fetch('/api/img_upload', {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            file:base64Url,
             file_name:filename
        }),
      })
    //   .then(async(res) => {
        const picId = await res.json();
        return picId.id
      

    } catch (err) {
        console.log(err)
      return('Error uploading');
    }
  }
  export async function getTeamImages(
    pictures: { bio: string; urlData: string; name: string; role: string }[]
      | null
  ) {
    let arr=[] as TPictureWithCapture[]
    if (pictures == null) return arr;
    else {
      
      for (let i = 0; i < pictures.length; i++) {
          let urlData=await prisma.picture
          .findUnique({
            where: {
              id: pictures[i]?.urlData,
            },
          })
          arr.push({urlData: urlData!.file!, capture: pictures[i]?.name})
      }
      return arr
    }
  }