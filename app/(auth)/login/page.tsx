'use client';
import { FC, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ShowIcon from '@/components/svg/showIcon';
import { signIn, useSession } from 'next-auth/react';
import { PageWrapper } from '@/components/page-wrapper';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const email2Ref = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (session) return router.replace('/');
  }, [session]);
  const isEmailValid = (st: string) => {
    const emailRegex = new RegExp(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'gm'
    );
    return emailRegex.test(st);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let pass = '';
    if (passwordRef.current?.value) pass = passwordRef.current?.value;
    if (pass.length < 6) {
      return setError('Passwords should be at least 6 symbols long');
    }
    // try {
    setError('');
    setLoading(true);
    signIn('credentials', {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
      redirect: true,
    }).then((response) => {
      if (response?.error !== null) {
        if (response?.error === '401') setError('Incorrect password');
      }
      console.log(response);
    });

    setLoading(false);
  };

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      <div className="border-0 rounded-md p-1 mt-4 shadow-2xl w-[90%]   max-w-[450px] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md h-[70svh] md:h-[85svh] relative overflow-y-auto">
        <div className="w-full h-full border rounded-md border-lightMainColor dark:border-darkMainColor relative overflow-y-auto">
          <div className={`absolute top-0 left-0 flex flex-col items-center justify-between  w-full `}>
            <h2
              className="text-center font-bold uppercase"
              style={{ letterSpacing: '1px' }}
            >
              login
            </h2>
            <div className=" h-20 w-20 md:h-28 md:w-28 mb-6 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor m-auto">
              <ShowIcon icon={'Login'} stroke={'0.1'} />
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

              <button
                className="btnBlue1 p-2 max-w-xs"
                disabled={loading}
                type="submit"
              >
                Submit
              </button>
            </form>
            <label className="flex flex-col items-center    border-t-2">
              Use Google to signin or login
              <button
                type="button"
                className={`cursor-pointer h-12 w-12 mb-1 md:h-10 md:w-10 hover:animate-bounce hover:scale-110 `}
                onClick={() => signIn('google')}
              >
                <ShowIcon icon={'Google'} stroke={'1'} />
              </button>
            </label>
            <label className="flex flex-col items-center justify-center  mx-auto border-t-2">
              {' '}
              Forgot your password
              <label className="flex flex-col items-center ">
                Email
                <input
                  className="flex-1 outline-none border-none rounded-md   text-lightMainColor p-0.5 mx-1"
                  id="email2"
                  type="email"
                  ref={email2Ref}
                  required
                />
                <button
                  className="btnBlue1 p-2 max-w-xs"
                  disabled={loading}
                  onClick={async () => {
                    if (
                      email2Ref.current?.value &&
                      isEmailValid(email2Ref.current?.value)
                    ) {
                      const res = await signIn('email', {
                        email: email2Ref.current?.value,
                        redirect: false,
                      });
                      console.log(res);
                      if (res?.status == 200)
                        setError(
                          'Please check your email. Link was send from Dance At Le Pari'
                        );
                    } else setError('Please enter a valid email address');
                  }}
                >
                  Submit
                </button>
              </label>
            </label>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
