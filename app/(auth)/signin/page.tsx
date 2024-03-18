'use client';
import { FC, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import ShowIcon from '@/components/svg/showIcon';
import { useDimensions } from '@/hooks/useDimensions';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [scrolling, setScrolling] = useState(true);
  const windowSize = useDimensions();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
      return setError('Passwords do not match');
    }
    let pass = '';
    if (passwordRef.current?.value) pass = passwordRef.current?.value;
    if (pass.length < 6) {
      return setError('Passwords should be at least 6 symbols long');
    }
    try {
      setError('');
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailRef.current?.value,
          password: passwordRef.current?.value,
        }),
      });
      //Await for data for any desirable next steps
      const data = await res.json();
      setError(data.message);
    } catch (error) {
      if (error) {
        setError('Fail to create user');
      }
    }

    setLoading(false);
  };
  useEffect(() => {
    (document.querySelector('#wrapperDiv')?.clientHeight!-document.querySelector('#containedDiv')?.clientHeight!>0)? setScrolling(true):setScrolling(false);
  }, [windowSize.height]);
  return (
    <PageWrapper className="absolute inset-0  w-full h-screen flex items-center justify-center ">
      <div className="border-0 rounded-md p-1 mt-4 shadow-2xl w-[90%] max-h-[560px]  max-w-[450px] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md h-[70svh] md:h-[85svh] relative overflow-y-auto">
        <div id="wrapperDiv" className="w-full h-full border rounded-md border-lightMainColor dark:border-darkMainColor relative overflow-y-auto flex flex-col justify-center items-center">
          <div id="containedDiv"
            className={`${scrolling?"":"absolute top-0 left-0"} flex flex-col items-center justify-between  w-full `}
          >
            <h2
              className="text-center font-bold uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Register New User
            </h2>
            <div className=" h-20 w-20 md:h-28 md:w-28 mb-6 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor m-auto">
              <ShowIcon icon={'Register'} stroke={'0.1'} />
            </div>
            <form
              className="flex flex-col items-center   p-3 bottom-0"
              onSubmit={handleSubmit}
            >
              {error && (
                <label className="text-center text-red-600 italic font-bold">
                  {error}
                </label>
              )}
              <label className="flex flex-col items-center">
                Email
                <input
                  className="flex-1 outline-none border-none rounded-md   text-lightMainColor p-0.5 mx-1"
                  id="email"
                  type="email"
                  ref={emailRef}
                  required
                />
              </label>
              <label className="flex flex-col items-center">
                Password
                <input
                  className="flex-1 outline-none border-none rounded-md   text-lightMainColor p-0.5 mx-1"
                  id="password"
                  type="password"
                  ref={passwordRef}
                  defaultValue={''}
                  required
                />
              </label>
              <label className="flex flex-col items-center    ">
                Password Confirmation
                <input
                  className="flex-1 outline-none border-none rounded-md  p-0.5 mx-1 mb-2"
                  id="password-confirm"
                  type="password"
                  defaultValue={''}
                  ref={passwordConfirmRef}
                  required
                />
              </label>
              <button
                className="btnBlue1 p-2 max-w-xs"
                disabled={loading}
                type="submit"
              >
                Submit
              </button>
            </form>
            <label className="flex flex-col items-center justify-center  mx-auto">
              {' '}
              Already have an account?
              <button
                className="btnBlue1 p-2 max-w-xs"
                onClick={() => {
                  router.replace('/login');
                }}
              >
                Login
              </button>
            </label>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
