'use client';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="absolute inset-0">
      <div className="w-full h-full relative overflow-y-auto ">
        <div className="absolute top-0 left-0 w-full min-h-full flex flex-col justify-center items-center ">
          <div className="border-0 rounded-md p-4  shadow-2xl w-[90%]  max-w-[450px] md:w-full  m-12 bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md">
            <h2
              className="text-center font-bold uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Register New User
            </h2>

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
    </div>
  );
};

export default page;
