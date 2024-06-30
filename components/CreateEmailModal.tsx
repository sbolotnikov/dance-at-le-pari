'use client';

import { Lato } from 'next/font/google';
import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ReactQuill from 'react-quill';
import AnimateModalLayout from './AnimateModalLayout';
import ChoosePicture from './ChoosePicture';
import ImgFromDb from './ImgFromDb';
import ShowIcon from './svg/showIcon';
import { TBlogPost } from '@/types/screen-settings';
import { slugify } from '@/utils/functions';
type Props = {
  visibility: boolean;  
  onReturn: () => void;
};
const CreateEmailModal = ({ visibility , onReturn }: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter(); 
  const [value, setValue] = useState( ''); 
  const [title, setTitle] = useState( ''); 

  if (status === 'unauthenticated') {
    router.push('/');
  }


  const handleSubmit = async () => {
    console.log(
      title,
      value, 
      session?.user?.id, 
    );
    fetch('/api/admin/email_mass_send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email:"serge.bolotnikov@gmail.com", name:"Unknown",title, message:'<html><head><link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet" /></head><body>' + value + '</body><script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"></script></html>'
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          console.log(data);
        //   if (data.accepted.length > 0) {
        //     setAlertStyle({
        //       variantHead: 'info',
        //       heading: 'Message',
        //       text: 'Email sent successfully',
        //       color1: 'success',
        //       button1: 'Return',
        //       color2: '',
        //       button2: '',
        //       inputField: '',
        //     });
        //     document
        //       .querySelector('#user_name')!
        //       .classList.remove('invalid_input');
        //     document
        //       .querySelector('#user_email')!
        //       .classList.remove('invalid_input');
        //     document.querySelector('#message')!.classList.remove('invalid_input');
        //     target1.user_name.value = '';
        //     target1.user_email.value = '';
        //     target1.message.value = '';
        //     setRevealAlert(true);
        //   } else {
        //     setAlertStyle({
        //       variantHead: 'danger',
        //       heading: 'Warning',
        //       text: 'Email delivery fails ',
        //       color1: 'warning',
        //       button1: 'Return',
        //       color2: '',
        //       button2: '',
        //       inputField: '',
        //     });
        //     setRevealAlert(true);
        //   }
        })
        .catch(async (err) => {
          console.log(err);
        });
    console.log(value.replace(/<[^>]*>/g, ''))
  };
 
  
  return (
    <AnimateModalLayout
      visibility={visibility}
      onReturn={() => {
        onReturn();
      }}
    > 
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[1170px]  flex justify-center items-center flex-col   md:w-[80svw] bg-lightMainBG dark:bg-darkMainBG h-[70svh] md:h-[85svh]
        }`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative  p-1  overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
        >
          <div
            id="containedDiv"
            className={`absolute top-0 left-0 flex flex-col w-full p-1 justify-center items-center`}
          >
            <h2
            className="text-center font-semibold md:text-4xl uppercase"
            style={{ letterSpacing: '1px' }}
          >
            Create Email Modal
          </h2>
            <label className="flex flex-col items-center w-full">
              {' '}
              Email Title{' '}
              <input
                type="text"
                placeholder="Title"
                value={title}
                className="dark:bg-lightMainBG bg-darkMainBG dark:text-lightMainColor text-darkMainColor w-full p-1 rounded-md"
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <button className="btnFancy  m-2" onClick={handleSubmit}>
              Publish
            </button>
            <ReactQuill
              className="h-52 w-full rounded-md "
              theme="snow"
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, false] }, {'font':['serif','Lato','sans-serif']}],
                  ['bold', 'italic', 'underline','strike', 'blockquote',{'size':['small','','large','huge']},
                    {'background':['#000000','#e60000', '#ff9900', '#ffff00','#008a00','#0066cc','#9933ff','#ffffff','#facccc','#ffebcc','#ffffcc','#cce8cc','#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666','#ffc266','#ffff66','#66b966','#66a3e0','#c285ff','#888888','#a10000','#b26b00','#b2b200','#006100','#0047b2','#6b24b2','#444444','#5c0000','#663d00','#666600','#003700','#002966','#3d1466' ]}, 

                    {'color':['#000000','#e60000', '#ff9900', '#ffff00','#008a00','#0066cc','#9933ff','#ffffff','#facccc','#ffebcc','#ffffcc','#cce8cc','#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666','#ffc266','#ffff66','#66b966','#66a3e0','#c285ff','#888888','#a10000','#b26b00','#b2b200','#006100','#0047b2','#6b24b2','#444444','#5c0000','#663d00','#666600','#003700','#002966','#3d1466' ]}, 
                    {'align':['','right','center','justify']}],
                  [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                  ['link', {'image':['link', 'width','height']}, 'video'],
                  ['clean']
                ],
              }}
              formats={[
                'size',
                'align',
                'color',
                'background',
                'header',
                'bold',
                'italic',
                'underline',
               'strike',
                'blockquote',
                'list',
                'bullet',
                'indent',
                'link',
                'image',
                'video'
              ]}
              value={value}
              onChange={setValue}
              placeholder="Tell your story..."
            />

          </div>
        </div>
      </div>
    </AnimateModalLayout>
  );
};

export default CreateEmailModal;