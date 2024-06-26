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
  post: TBlogPost | null;
  categories:{slug: string,title: string}[];
  onReturn: () => void;
};
const CreatePostModal = ({ visibility, post,categories, onReturn }: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file1, setFile] = useState(post?.img || '');
  const [value, setValue] = useState(post?.desc || '');
  const [keywords, setKeywords] = useState(post?.keywords || '');
  const [title, setTitle] = useState(post?.title || '');
  const [revealCloud, setRevealCloud] = useState(false);
  const [catSlug, setCatSlug] = useState(post?.catSlug || 'welcome');

  if (status === 'unauthenticated') {
    router.push('/');
  }


  const handleSubmit = async () => {
    console.log(
      title,
      value,
      file1,
      catSlug,
      session?.user?.id,
      slugify(title)
    );
    if (post == null){
    const res = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        title,
        desc: value,
        keywords,
        img: file1,
        slug: slugify(title),
        userID: session?.user?.id,
        catSlug: catSlug, //If not selected, choose the general category
      }),
    });

    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      router.push(`/posts/${data.post.slug}`);
    }
  } else {
    const res = await fetch('/api/posts', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: post.id,
        title,
        desc: value,
        keywords,
        img: file1,
        slug: post.slug,
        userID: session?.user?.id,
        catSlug: catSlug, //If not selected, choose the general category
      }),
    });
    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      router.push(`/posts/${data.post.slug}`);
    }
  }
  };
  const onReturnPicture = (decision1: string, fileLink: string) => {
    if (decision1 == 'Close') {
      setRevealCloud(false);
    }
    if (decision1 == 'Upload') {
      console.log('file link', fileLink);
      if (revealCloud == true) {
        setRevealCloud(false);
        setFile(fileLink);
      }
    }
  }; 
  return (
    <AnimateModalLayout
      visibility={visibility}
      onReturn={() => {
        onReturn();
      }}
    >
      {revealCloud && <ChoosePicture onReturn={onReturnPicture} />}
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
            Create/Edit Posts Modal
          </h2>
            <label className="flex flex-col items-center w-full">
              {' '}
              Blog Title{' '}
              <input
                type="text"
                placeholder="Title"
                value={title}
                className="dark:bg-lightMainBG bg-darkMainBG dark:text-lightMainColor text-darkMainColor w-full p-1 rounded-md"
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="flex flex-col items-center w-full">
              {' '}
              Blog Keywords{' '}
              <input
                type="text"
                placeholder="Keywords"
                value={keywords}
                className="dark:bg-lightMainBG bg-darkMainBG dark:text-lightMainColor text-darkMainColor w-full p-1 rounded-md"
                onChange={(e) => setKeywords(e.target.value)}
              />
            </label>
            <label className="flex flex-col items-center text-lightMainColor dark:text-darkMainColor">
              {' '}
              Blog Category
               
              <select
                className="dark:bg-lightMainBG bg-darkMainBG dark:text-lightMainColor text-darkMainColor rounded-md outline-none"
                onChange={(e) => setCatSlug(e.target.value)}
                value={ catSlug }
              >
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="w-full h-40 flex  justify-center items-center">
              <div className="relative flex  justify-center items-center outline-none border border-lightMainColor dark:border-darkMainColor  rounded-md w-24 my-2 mx-auto">
                {file1 !== '' ? (
                  <ImgFromDb
                    url={file1}
                    stylings="object-contain rounded-md"
                    alt="Event Picture"
                  />
                ) : (
                  <div className=" h-8 w-8 md:h-10 md:w-10 m-2 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                    <ShowIcon icon={'Image'} stroke={'0.75'} />
                  </div>
                )}

                <button
                  className=" outline-none border-none fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor rounded-md  absolute p-1 -top-3 -right-3 w-8 h-8"
                  onClick={(e) => {
                    e.preventDefault();
                    setRevealCloud(!revealCloud);
                    return;
                  }}
                >
                  <ShowIcon icon={'Exchange'} stroke={''} />
                </button>
              </div>
            </div>

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
                  ['link', 'image', 'video'],
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

export default CreatePostModal;
