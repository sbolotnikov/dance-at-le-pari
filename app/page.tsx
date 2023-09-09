// 'use client';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Head from 'next/head';
import Logo from '@/components/svg/logo';
import Link from 'next/link';
// import { useEffect, useState } from 'react';

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log(session);
 
  let departmentsArray=[ 
    {name:'Wedding Dance', path:"/images/weddingcouple.jpg", link:'/wedding'},
    {name:'Social Dancing', path:"/images/social.jpg", link:'/social'},
    {name:'Competitive Dance', path:"/images/competitive.jpg", link:'/competition'},
    {name:'Studio Rentals', path:"/images/ballroom.webp", link:'/rentals'},
    
  ]
  return (
    <>
      {/* <Head>
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/png"
          sizes="32x32"
        />
      </Head> */}
      <div>
        {/* <Image className="h-1/2" src="/logo.png" 
      width={300}
      height={400}
      alt="Logo" /> */}

        <div className=" absolute inset-0 flex flex-col items-center justify-center ">
          {/* <Logo shadow={shadow} />"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" */}
          <Logo shadow={'0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'} />
        </div>
        <div className="bg-transparent bg-contain bg-no-repeat bg-center  absolute inset-0 flex flex-col justify-start mt-14 items-center">
          <div
            id="text"
            className="text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG p-3 shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2"
          >
            <h1 className="font-bold text-5xl text-franceBlue  text-center font-DancingScript text-shadow  dark:text-shadow-light  ">
              {' '}
              {process.env.SITE_NAME}
            </h1>
            <h2 className="text-center font-bold    text-shadow  dark:text-shadow-light ">
              Welcome to Home Page
            </h2>
          </div>
          <div className="text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG mt-3 p-3 shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2">
            <h1 className="font-bold text-mdv text-alertcolor  text-center  text-shadow  dark:text-shadow-light  ">
              What are you interested in?
            </h1>
          </div> 
          <div className="w-full h-full relative  mb-12 overflow-y-auto ">
           <div className="absolute top-0 left-0 w-full min-h-full flex flex-col justify-center items-center md:flex-row">  
          {departmentsArray.map((item, index) => {
            return (
              <Link key={"Links"+index} href={item.link} >
                <div className="m-3 p-2  flex flex-col justify-center items-center text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG    shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2">
              <h1 className=" text-2xl   text-center   text-shadow  dark:text-shadow-light ">
                {item.name}
              </h1>
              <Image
                className="rounded-md overflow-hidden "
                src={item.path}
                width={300}
                height={300}
                // style={{objectFit: "contain"}}
                alt="Logo"
              />
              </div>
            </Link>
            )})}
           
           </div>

 
          </div>
        </div>
      </div>
    </>
  );
}
