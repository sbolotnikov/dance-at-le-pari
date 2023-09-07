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
            <h1 className="font-bold text-5xl text-alertcolor  text-center font-DancingScript text-shadow  dark:text-shadow-light  ">
              What are you interested in?
            </h1>
          </div> 
          <div className="w-full  flex flex-col overflow-y-auto md:flex-row justify-center items-center">
            <div className="m-1 text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG mt-3 p-3 shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2">
              <h1 className="font-bold text-5xl text-franceBlue text-center font-DancingScript text-shadow  dark:text-shadow-light mt-12 ">
                Wedding Dance
              </h1>
              <Image
                className="rounded-md  "
                src="/images/wedding.jpg"
                width={300}
                height={300}
                alt="Logo"
              />
            </div>
            <div className="m-1 text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG mt-3 p-3 shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2">
              <h1 className="font-bold text-5xl text-franceBlue  text-center font-DancingScript text-shadow  dark:text-shadow-light  ">
                Social Dance
              </h1>
              <Image
                className="rounded-md  "
                src="/images/social.webp"
                width={300}
                height={300}
                alt="Logo"
              />
            </div>
            <div className="m-1 text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG mt-3 p-3 shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2">
              <h1 className="font-bold text-5xl text-franceBlue  text-center font-DancingScript text-shadow  dark:text-shadow-light  ">
                {`Competitive \n Dance`}
              </h1>
              <Image
                className="rounded-md  "
                src="/images/competitive.webp"
                width={300}
                height={300}
                alt="Logo"
              />
            </div>
            <div className="m-1 text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG mt-3 p-3 shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2">
              <h1 className="font-bold text-5xl text-franceBlue  text-center font-DancingScript text-shadow  dark:text-shadow-light  ">
                Rentals
              </h1>
              <Image
                className="rounded-md  "
                src="/images/ballroom.webp"
                width={300}
                height={400}
                alt="Logo"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
