'use client';
import { FC, useContext, useEffect, useState } from 'react';
import { PageWrapper } from '@/components/page-wrapper';

import ShowIcon from '@/components/svg/showIcon';
import { SettingsContext } from '@/hooks/useSettings';
import { ScreenSettingsContextType } from '@/types/screen-settings';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [email1, setEmail1] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [error1, setError1] = useState(false);
  const [message, setMessage] = useState('');
  const { darkMode } = useContext(SettingsContext) as ScreenSettingsContextType;
  const isEmailValid = (st: string) => {
    const emailRegex = new RegExp(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'gm'
    );
    return emailRegex.test(st);
  };
  useEffect(() => {
    const r = document.querySelector(':root') as HTMLElement;
    const pr = r.style.getPropertyValue('--accent-color');
    console.log('darkMode:', darkMode, pr);
    if (darkMode) r.style.setProperty('--accent-color', '#93c5fd;');
    else r.style.setProperty('--accent-color', '#504deb;');
  }, [darkMode]);
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center md:items-end justify-center">
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[800px]  flex justify-center items-center flex-col bg-lightMainBG dark:bg-darkMainBG h-[70svh]
      }`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative  p-1  border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
        >
          <div id="containedDiv" className=" w-full h-full flex flex-col justify-center items-center">
            <h2
              className="text-center font-semibold md:text-4xl uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Please subscribe to our newsletter
            </h2>
            <div className=" h-20 w-20 md:h-28 md:w-28 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor">
              <ShowIcon icon={'Subscribe'} stroke={'0.1'} />
            </div>
            {/* <h1 className="text-center font-DancingScript text-franceBlue dark:text-blue-300" style={{ fontSize: `45px`, lineHeight: '1' }}>Please subscribe to our newsletter</h1> */}
            <p
              className={`text-center text-lg text-${
                error1 ? 'alertcolor' : 'editcolor'
              }`}
            >
              {message}
            </p>
            <label className=" w-full m-2 flex justify-center items-center">
              {' '}
              Enter First Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setError1(false);
                setMessage('');
                setName(e.target.value);
              }}
              className="w-[90%] dark:bg-lightMainBG bg-darkMainBG dark:text-lightMainColor text-darkMainColor rounded-md outline-none "
            />
            <label className=" w-full m-2 flex justify-center items-center">
              {' '}
              Enter Last Name
            </label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => {
                setError1(false);
                setMessage('');
                setLastname(e.target.value);
              }}
              className="w-[90%] dark:bg-lightMainBG bg-darkMainBG dark:text-lightMainColor text-darkMainColor rounded-md outline-none"
            />
            <label className=" w-full m-2 flex justify-center items-center">
              {' '}
              Enter Email
            </label>
            <input
              type="email"
              value={email1}
              onChange={(e) => {
                setError1(false);
                setMessage('');
                setEmail1(e.target.value);
              }}
              className="w-[90%] dark:bg-lightMainBG bg-darkMainBG dark:text-lightMainColor text-darkMainColor rounded-md outline-none"
            />

            <div
              className={`btnFancy dark:text-[#93c5fd] dark:border-blue-300 dark:hover:text-white`}
              onClick={async () => {
                if (isEmailValid(email1)) {
                  const res = await fetch('/api/subscriber_add', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email: email1,
                      name: name,
                      lastname: lastname,
                    }),
                  });
                  if (res.status === 200) {
                    setError1(false);
                    const data = await res.json();
                    setMessage(data.message);
                  } else {
                    setError1(true);
                    const data = await res.json();
                    setMessage(data.message);
                  }
                } else {
                  setError1(true);
                  setMessage('Please enter a valid email address');
                }
              }}
            >
              Subscribe
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
