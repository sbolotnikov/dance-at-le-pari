'use client';
import Comments from '@/components/Comments';
import ImgFromDb from '@/components/ImgFromDb';
// import 'react-quill/dist/quill.snow.css';
import "quill/dist/quill.core.css";

import SharePostModal from '@/components/SharePostModal';
import SharePost from '@/components/SharePostModal';
import { PageWrapper } from '@/components/page-wrapper';
import ShowIcon from '@/components/svg/showIcon';
import { TBlogPost } from '@/types/screen-settings';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
// set dynamic metadata

type Props = {
  params: { slug: string };
};

export default function Page(params: { params: { slug: string } }) {
  const slug = params.params.slug;
  const [post, setPost] = useState<TBlogPost | null>(null);
  const [revealSharingModal, setRevealSharingModal] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${slug}`, {
      cache: 'no-store',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPost(data.post);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center md:items-end justify-center ">
      {post && (
        <SharePostModal
          title={post.title}
          url={process.env.NEXT_PUBLIC_URL + '/posts/' + slug}
          quote={`Category: ${post.catSlug} \n Author: ${post.user.name} \n Click on the link below. \n`}
          hashtag={post.keywords+', '+'DanceAtLePariBlog, BallroomDanceStudioBlog, '+post.user.name}
          onReturn={() => setRevealSharingModal(false)}
          visibility={revealSharingModal}
        />
      )}
      <div className="blurFilter border-0 rounded-md p-2 mt-6 shadow-2xl w-[95%] h-[70svh] md:h-[85svh] max-w-5xl md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 md:mb-3">
        <div className="border rounded-md border-lightMainColor dark:border-darkMainColor w-full h-full   p-2 flex flex-col justify-start items-center relative">
          <div className="w-full h-full relative overflow-auto  ">
            <div
              className={` absolute top-0 left-0 w-full flex justify-center items-center`}
            >
              {post && (
                <div className="flex flex-col justify-start items-start w-full">
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-row justify-around items-center">
                      <ImgFromDb
                        url={post.user.image}
                        stylings=" w-24 float-left m-2 rounded-md"
                        alt="Author Picture"
                      />
                      {/* <img src={ 'http://localhost:3000/api/og?title=MyBlogPost&mainTopics=nodejs,javascript,react'} width={50} height={50} alt="one pic" /> */}
                      <div className="flex flex-col ">
                        <span>{post.user.name}</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString(
                            'en-us',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row items-center justify-center">
                      <button
                        className=" outline-none border-none   rounded-md  mt-2  w-8 h-8"
                        aria-label='Share this blog post'
                        onClick={(e) => {
                          e.preventDefault();
                          setRevealSharingModal(!revealSharingModal);
                          return;
                        }}
                      >
                        <ShowIcon icon={'Share'} stroke={'2'} />
                      </button>
                      <button
                        className="shadow-lg pointer border-0 outline-none rounded"
                        onClick={(e) => {
                          e.preventDefault();
                          window.history.back();
                        }}
                        style={{ padding: '5px 5px', margin: '5px 5px' }}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col justify-around items-center w-full">
                    {post.img && (
                      <ImgFromDb
                        url={post.img}
                        stylings="h-auto w-80 float-left m-2 rounded-md"
                        alt="Post Picture"
                      />
                    )} 
                      <div className="text-blue-500 dark:text-blue-300 text-xl font-semibold">
                        Category: <span className="italic">{post.catSlug}</span>
                      </div>
                      <h1 className="text-4xl italic font-semibold text-red-600">
                        {post.title}
                      </h1>
                      <div className="flex flex-row justify-around items-center w-full italic text-alertcolor">Keywords: {post.keywords}</div>
                      <p>Views: {post.views}</p>
                      {/* <div
                        className="w-full  "
                        dangerouslySetInnerHTML={{
                          __html: post.desc,
                        }}
                      />   */}
                       <ReactQuill
              className=" w-full border-0 rounded-md border-lightMainColor dark:border-darkMainColor"
              theme="snow"
              readOnly={true}
              modules={{
                toolbar: [],
              }}
              
              value={post.desc}  
            />             
                  </div>
                  <Comments postSlug={slug} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
