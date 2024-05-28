'use client';

import Image from 'next/image';
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
type Props = {
  visibility: boolean;
  post: TBlogPost | null;
  onReturn: () => void;
};
const CreatePostModal = ({ visibility, post, onReturn }: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file1, setFile] = useState(post?.img || '');
  const [value, setValue] = useState(post?.desc || '');
  const [title, setTitle] = useState(post?.title || '');
  const [revealCloud, setRevealCloud] = useState(false);
  const [catSlug, setCatSlug] = useState(post?.catSlug || 'welcome');

  if (status === 'unauthenticated') {
    router.push('/');
  }

  const slugify = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  const handleSubmit = async () => {
    console.log(
      title,
      value,
      file1,
      catSlug,
      session?.user?.id,
      slugify(title)
    );
    const res = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        title,
        desc: value,
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
        className={`border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-md  flex justify-center items-center flex-col   md:w-full bg-lightMainBG dark:bg-darkMainBG backdrop-blur-md  h-[70svh] md:h-[85svh]
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
            <label className="flex flex-col items-center">
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

            <label className="flex flex-col items-center text-lightMainColor dark:text-darkMainColor">
              {' '}
              Blog Category
              <select
                className="dark:bg-lightMainBG bg-darkMainBG dark:text-lightMainColor text-darkMainColor"
                onChange={(e) => setCatSlug(e.target.value)}
              >
                <option value="welcome">welcome</option>
                <option value="weddings">for wedding couples</option>
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
