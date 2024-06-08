'use client';
import ImgFromDb from '@/components/ImgFromDb';
import SharePost from '@/components/SharePost';
import { PageWrapper } from '@/components/page-wrapper'; 
import { TPost } from '@/types/screen-settings';
import { Metadata, ResolvingMetadata } from 'next';
import {  useEffect, useState } from 'react';
 // set dynamic metadata

type Props = {
  params: { slug: string } 
}

 

export default function Page(params: { params: { slug: string } }) {
  const slug = params.params.slug; 
    const [post, setPost] = useState<TPost>(null);

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
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center ">
      <div className="border-0 rounded-md p-2 mt-6 shadow-2xl w-[95%] h-[70svh] md:h-[85svh] max-w-5xl md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md">
        <div className="border rounded-md border-lightMainColor dark:border-darkMainColor w-full h-full   p-2 flex flex-col justify-start items-center relative">
          <div className="w-full h-full relative overflow-auto  ">
            <div
              className={` absolute top-0 left-0 w-full flex justify-center items-center`}
            >
              {post && (
                <div className="flex flex-col justify-start items-start">
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
                  <div className="flex flex-col justify-around items-center ">
                    {post.img && (
                      <ImgFromDb
                        url={post.img}
                        stylings="h-auto w-80 float-left m-2 rounded-md"
                        alt="Post Picture"
                      />
                    )}
                    <div className="">
                      <div className="">
                        Category: <span className="">{post.catSlug}</span>
                      </div>
                      <h1 className="text-4xl italic font-semibold text-red-600">
                        {post.title}
                      </h1>
                      <div
                        className="w-full  "
                        dangerouslySetInnerHTML={{
                          __html: post.desc,
                        }}
                      />
                      <p>Views: {post.views}</p>
                    </div>
                  </div>
                   <SharePost title={post.title} url={process.env.NEXT_PUBLIC_URL+"/posts/"+slug } quote={`Category: ${post.catSlug} \n Author: ${post.user.name} \n Click on the link below. \n`}
                    hashtag={'#DanceAtLePari #BallroomDanceStudio'}  />
                </div>
              )}
            </div>

            {/* <Comments postSlug={slug}/> */}

            {/* <Menu /> */}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}