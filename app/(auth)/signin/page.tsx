'use client'
import {FC} from 'react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react';
interface pageProps {
  
}

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
        let pass="";
        if (passwordRef.current?.value) pass=passwordRef.current?.value 
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
        } catch(error) {
         if (error){

          setError("Fail to create user");
         }
        }
    
        setLoading(false);
      }
    
      return (
        <div
        className="w-full h-screen flex items-center justify-center"
      >
      {/* {revealAlert && <AlertMenu onReturn={onReturn} styling={alertStyle} />} */}
        <div
          className="border-0 rounded-md p-4  shadow-2xl w-[90%]  max-w-[450px] md:w-full"
          // style={{ boxShadow: '0 0 150px rgb(113, 113, 109 / 50%),inset 0 0 20px #242422' }}
        >
          <h2
            className="text-center font-bold uppercase"
            style={{   letterSpacing: '1px' }}
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
            <label className="flex flex-col items-center">Email 
            <input
              className="flex-1 outline-none border-none rounded-md  p-0.5 mx-1"
              id="email"
              type="email"
              ref={emailRef}
              required
            />
            </label>
            <label className="flex flex-col items-center">Password 
            <input
              className="flex-1 outline-none border-none rounded-md  p-0.5 mx-1"
              id="password"
              type="password"
              ref={passwordRef}
              defaultValue={""}
              required
            />
            </label>
            <label className="flex flex-col items-center">Password Confirmation
            <input
              className="flex-1 outline-none border-none rounded-md  p-0.5 mx-1 mb-2"
              id="password-confirm"
              type="password"
              defaultValue={""}
              ref={passwordConfirmRef}
              required
            />
           </label>
            <button
              className="btnBlue1 p-2 max-w-xs"
              disabled={loading}
              type='submit'
            >
              Submit
            </button>
          </form>
          <label className="flex flex-col items-center justify-center  mx-auto"> Already have an account? 
          <button
            className="btnBlue1 p-2 max-w-xs"
            onClick={() => {
              router.replace('/');
            }}
          >
           Login
          </button>
        </label>
        </div>
        </div>
      );
    }


export default page
