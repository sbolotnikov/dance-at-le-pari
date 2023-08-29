
import { v4 as uuidv4 } from 'uuid';
import Resizer from 'react-image-file-resizer';
 
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

  const resizeFile = (file: any) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      'JPEG',
      100,
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
  export async function uploadImage(url:any )
  
  {
    try {
      const image = (await resizeFile(
        url
      )) as any;
      
      let filename = uuidv4() + '.jpg';
      
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