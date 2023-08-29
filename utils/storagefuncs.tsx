
import { v4 as uuidv4 } from 'uuid';
import Resizer from 'react-image-file-resizer';
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_KEY!);
  export async function deleteImage(url:string ) {
  const { data, error } = await supabase
  .storage
  .from('images')
  .remove([url])
  return ({data,error})
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
  export async function uploadImage(url:any )
  
  {
    try {
      const image = (await resizeFile(
        url
      )) as any;

      let filename = uuidv4() + '.jpg';
      console.log(image);
      const { error } = await supabase.storage
        .from('images')
        .upload(filename, image);
      if (error) {
        console.log(error);
        return('Error uploading to Supabase');
      }
      return process.env.NEXT_PUBLIC_SUPABASE_URL +
          '/storage/v1/object/public/images/' +
          filename;
    } catch (err) {
      return('Error uploading to Supabase');
    }
  }