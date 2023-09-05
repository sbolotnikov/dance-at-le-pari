// 'use client';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Head from 'next/head';
import Logo from '@/components/svg/logo';
// import { useEffect, useState } from 'react';

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log(session);
  // const [shadow, setShadow] = useState("0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0");
  // useEffect(() => {
  //    if (shadow=='light') setShadow("0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0")
  //      else setShadow("0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0") 
  // }, []);
  return (
    <>
      <Head>
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/png"
          sizes="32x32"
        />
      </Head>
      <div className="absolute top-0 left-0 w-full h-full p-0 m-0 flex flex-col items-center justify-center ">
        {/* <Image className="h-1/2" src="/logo.png" 
      width={300}
      height={400}
      alt="Logo" /> */}
        <div className="w-full h-full absolute inset-0 flex items-center justify-center ">
          {/* <Logo shadow={shadow} />"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" */}
          <Logo shadow={"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"} />         

        </div>
        <div
          className="bg-transparent bg-contain bg-no-repeat bg-center w-full h-full flex flex-col justify-start mt-14 items-center z-10"
          // style={{ backgroundImage: "url('/logo.svg')" }}
        >
 
          <div id="text" className="text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG p-3 shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2">
            <h1 className="font-bold text-5xl text-franceBlue  text-center font-DancingScript text-shadow  dark:text-shadow-light  ">
              {' '}
              {process.env.SITE_NAME}
            </h1>
            <h2 className="text-center font-bold text-alertcolor text-shadow  dark:text-shadow-light ">
              Welcome to Home Page
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
