
import ImageUploader from 'react-images-upload';
import Resizer from 'react-image-file-resizer'; 
const UploadPicture  = () => {
    

    const onDrop =  (picture:any)=> {
        console.log(picture.name)
        Resizer.imageFileResizer(
            picture,
            300,
            300,
            'JPEG',
            85,
            0,
            (uri: any) => {

       
            fetch('/api/img_upload', {
                method: 'POST',
                headers: {
                  Accept: 'application/json, text/plain, */*',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    file:picture.name,
                     file_name:'profile'
                }),
              }).then(async(res) => {
                const data = await res.json();
                console.log(data);
      });
            },
            'base64'
          );

    
      } 
return <div className='m-auto w-[500px]' >
    
    <ImageUploader
          withIcon={false}
          withPreview={false}
          buttonText="Choose images"
          onChange={(image) => onDrop(image[0])}
          singleImage={true}
          imgExtension={['.jpg', '.gif', '.png', '.gif']}
          maxFileSize={5242880}
        />
    
</div>

}
export default UploadPicture