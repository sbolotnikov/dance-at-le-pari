'use client';
import React, { FC } from 'react';
import { useRef, useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AlertMenu from '../../components/alertMenu';
import ShowIcon from '@/components/svg/showIcon';
import ChooseAvatar from '@/components/chooseAvatar';
import { deleteImage } from '@/utils/picturemanipulation';
import ImgFromDb from '@/components/ImgFromDb';
import { PageWrapper } from '@/components/page-wrapper';
import Link from 'next/link';
import LoadingScreen from '@/components/LoadingScreen';

interface pageProps {}

const page: FC<pageProps> = () => {
  const { data: session } = useSession();
  let user = { image: '', name: '', telephone: '', email: '' };

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const userNameRef = useRef<HTMLInputElement>(null);

  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const [revealAlert, setRevealAlert] = useState(false);
  const [alertStyle, setAlertStyle] = useState({
    variantHead: '',
    heading: '',
    text: ``,
    color1: '',
    button1: '',
    color2: '',
    button2: '',
    inputField: '',
  });
  const [loading, setLoading] = useState(false);
  // const [toRoot, setToRoot] = useState(false);
  const [revealCloud, setRevealCloud] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!session) router.replace('/');
    if (session?.user.name) userNameRef.current!.value = session?.user.name;
    if (session?.user.telephone) setPhone(session?.user.telephone);
    if (session?.user.email) emailRef.current!.value = session?.user.email;
    if (session?.user.role == 'Admin' || session?.user.role == 'Teacher') {
      fetch('/api/user_info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: session?.user.id }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          data.bio == null ? setBio('') : setBio(data.bio);
          data.color == null ? setColor('#e66465') : setColor(data.color);
        });
    }
  }, [session]);
  const [userURL, setUserURL] = useState(session?.user.image);
  const [phone, setPhone] = useState(
    session?.user.telephone ? session?.user.telephone : ''
  );
  const [color, setColor] = useState('');
  const [bio, setBio] = useState('');
  const onReturn = (decision1: string) => {
    setRevealAlert(false);
    if (decision1 == 'Close') {
    }
    if (decision1 == 'Re-enter') {
      setLoading(true);
      signOut();
      setLoading(false);
    }
  };
  const onReturnAvatar = (decision1: string, fileLink: string) => {
    setRevealCloud(false);
    if (decision1 == 'Close') {
      console.log(decision1);
    }
    if (decision1 == 'Upload') {
      console.log('file link', fileLink);
      setUserURL(fileLink);
    }
  };
  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target1 = event.target as typeof event.target & {
      user_name: { value: string };
      user_email: { value: string };
      password: { value: string };
      passwordConfirm: { value: string };
      telephone: { value: string };
    };
    const name = target1.user_name.value; // typechecks!
    const email = target1.user_email.value;
    const password = target1.password.value;
    const passwordConfirm = target1.passwordConfirm.value;
    const telephone = target1.telephone.value;

    let validationError = '';
    document.querySelector('#user_name')!.classList.remove('invalid_input');
    document.querySelector('#user_email')!.classList.remove('invalid_input');
    document.querySelector('#password')!.classList.remove('invalid_input');
    document
      .querySelector('#passwordConfirm')!
      .classList.remove('invalid_input');
    document.querySelector('#telephone')!.classList.remove('invalid_input');
    // submitting profile updated information
    if (name.length < 3) {
      validationError = 'User Name is too short';
      // make name input red
      document.querySelector('#user_name')!.classList.add('invalid_input');
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      validationError = 'Enter a valid email';
      // make email input red
      document.querySelector('#user_email')!.classList.add('invalid_input');
    } else if (password.length < 6 && password.length > 0) {
      validationError = 'Password is too short. 6 or more symbols';
      // make message input red
      document.querySelector('#password')!.classList.add('invalid_input');
    } else if (password !== passwordConfirm) {
      validationError = 'Password did not match';
      // make message input red
      document.querySelector('#password')!.classList.add('invalid_input');
      document
        .querySelector('#passwordConfirm')!
        .classList.add('invalid_input');
    }
    if (validationError > '') {
      setAlertStyle({
        variantHead: 'danger',
        heading: 'Warning',
        text: validationError,
        color1: 'warning',
        button1: 'Close',
        color2: '',
        button2: '',
        inputField: '',
      });
      setRevealAlert(true);
      return;
    }

    setLoading(true);
    console.log(passwordRef.current?.value);
    fetch('/api/profile_update', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userNameRef.current?.value,
        id: session?.user.id,
        image: userURL,
        email: emailRef.current?.value,
        phone,
        password: passwordRef.current?.value,
        color, 
        bio
      }),
    }).then(async (res) => {
      let dbStoragePath =
        process.env.NEXT_PUBLIC_SUPABASE_URL! +
        '/storage/v1/object/public/images/';
      if (session?.user.image && session?.user.image > '') {
        let oldFilename = session?.user.image.replace(dbStoragePath, '');
      }
      if (
        userURL != session?.user.image &&
        session?.user.image != null &&
        !session?.user.image!.includes('http')
      ) {
        const delObj = await deleteImage(session?.user.image!);
        console.log(delObj);
      }
      if (res.status === 200) {
        setLoading(false);
        setAlertStyle({
          variantHead: 'info',
          heading: 'Message',
          text: 'You successfully updated your Profile. Please login to continue.',
          color1: 'secondary',
          button1: 'Re-enter',
          color2: '',
          button2: '',
          inputField: '',
        });

        setRevealAlert(true);
        console.log(res);
      }
    });
  };
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {revealAlert && <AlertMenu onReturn={onReturn} styling={alertStyle} />}
      {revealCloud && (
        <ChooseAvatar onReturn={onReturnAvatar} styling={alertStyle} />
      )}
      {loading && <LoadingScreen />}
      <div className="   shadow-2xl w-[90%]  max-w-[450px] md:w-full h-[70svh] md:h-[90%] bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md border-0 rounded-md  p-2 mt-6">
        <div className="border rounded-md border-lightMainColor dark:border-darkMainColor w-full h-full relative  p-1 flex  overflow-y-scroll">
          <div className="flex flex-col w-full p-1 justify-center items-center absolute top-0 left-0">
            <button
              type="button"
              className="absolute top-0 right-0 mt-2 h-6 w-6 mr-5 md:mr-6 md:h-8 md:w-8 rounded-sm outline-none "
              onClick={() => {
                signOut();
              }}
            >
              <div className="group flex  cursor-pointer  hover:scale-110  flex-col items-center ">
                <div className=" h-6 w-6 md:h-8 md:w-8 fill-none group-hover:animate-bounce stroke-lightMainColor dark:stroke-darkMainColor ">
                  <ShowIcon icon={'Logout'} stroke={'2'} />
                </div>
                <p className=" tracking-widest mx-3  group-hover:inline-flex ">
                  {'Logout'}
                </p>
              </div>
            </button>
            <h2
              className="text-center font-bold uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Your's {session?.user.role} Profile
            </h2>
            <div className="relative flex justify-center items-center outline-none border rounded-md w-24 my-6 mx-auto">
              {userURL !== null && userURL !== undefined ? (
                <ImgFromDb
                  url={userURL}
                  stylings="object-contain"
                  alt="User Picture"
                />
              ) : (
                <div className=" h-8 w-8 md:h-10 md:w-10 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                  <ShowIcon icon={'DefaultUser'} stroke={'2'} />
                </div>
              )}

              <button
                className=" outline-none border-none fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor rounded-md  absolute p-1 -top-3 -right-3 w-8 h-8"
                onClick={(e) => {
                  e.preventDefault();
                  setAlertStyle({
                    variantHead: 'danger',
                    heading: 'Warning',
                    text: 'You are about to Upload New Avatar Image',
                    color1: 'info',
                    button1: 'Upload',
                    color2: 'secondary',
                    button2: 'Cancel',
                    inputField: '',
                  });
                  setRevealCloud(!revealCloud);
                  return;
                }}
              >
                <ShowIcon icon={'Exchange'} stroke={'0.5'} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <Link href={'/purchases'}>
                <button
                  className="btnFancy w-[90%]"
                >
                  Purchases
                </button>
              </Link>
              <Link href={'/schedule'}>
                <button
                  className="btnFancy w-[90%]"
                >
                  Schedule Tool
                </button>
              </Link>
              <label className="flex flex-col items-center p-1 rounded-t-md bottom-0">
                Your Name:
                <input
                  name="user_name"
                  id="user_name"
                  className="flex-1 outline-none bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor border-none rounded-md p-0.5 mx-1 my-1"
                  type="text"
                  placeholder="Enter Name"
                  ref={userNameRef}
                />
              </label>

              <label className="flex flex-col items-center p-1  rounded-t-md bottom-0">
                Email Address
                <input
                  name="user_email"
                  id="user_email"
                  className="flex-1 outline-none bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor border-none rounded-md -bg p-0.5 mx-1 my-1"
                  type="email"
                  ref={emailRef}
                  required
                />
              </label>
              <label className="flex flex-col items-center p-1  rounded-t-md bottom-0">
                Password
                <input
                  className="flex-1 outline-none bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor border-none rounded-md  p-0.5 mx-1 my-1"
                  name="password"
                  id="password"
                  type="password"
                  ref={passwordRef}
                  placeholder="leave blank if not needed to change"
                />
              </label>
              <label className="flex flex-col items-center p-1  rounded-t-md bottom-0">
                Confirm Password
                <input
                  className="flex-1 outline-none bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor border-none rounded-md  p-0.5 mx-1 my-1"
                  name="passwordConfirm"
                  id="passwordConfirm"
                  type="password"
                  ref={passwordConfirmRef}
                  placeholder="leave blank if not needed to change"
                />
              </label>
              <label className="flex flex-col items-center p-1  rounded-t-md bottom-0">
                Telephone:
                <input
                  className="flex-1 outline-none bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor border-none rounded-md bg-main-bg p-0.5 mx-1 my-1"
                  name="telephone"
                  id="telephone"
                  type="tel"
                  placeholder="1234567890"
                  required
                  minLength={13}
                  maxLength={13}
                  onChange={(e) => {
                    setPhone(e.target.value.slice(3));
                  }}
                  value={'+1 ' + phone}
                />
              </label>
              {(session?.user.role == 'Admin' ||
                session?.user.role == 'Teacher') && (
                <label className="flex flex-col items-center justify-center w-full p-1  rounded-t-md bottom-0">
                  Color:
                  <div className="h-8 w-8 rounded-full overflow-hidden border-none relative">
                    <input
                      className=" outline-none h-10 w-10  absolute -top-1 -left-1  border-none "
                      name="color"
                      id="color"
                      type="color"
                      value={color}
                      onChange={(e) => {
                        setColor(e.target.value);
                      }}
                    />
                  </div>
                </label>
              )}
              {(session?.user.role == 'Admin' ||
                session?.user.role == 'Teacher') && (
                <label className="flex flex-col items-center p-1  rounded-t-md bottom-0">
                  Bio:
                  <textarea
                    className="flex-1 outline-none bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor border-none rounded-md bg-main-bg p-0.5 mx-1 my-1"
                    name="bio"
                    id="bio"
                    placeholder="Enter your bio here"
                    rows={5}
                    cols={33}
                    onChange={(e) => {
                      setBio(e.target.value);
                    }}
                    value={bio}
                  />
                </label>
              )}
              <button
                disabled={loading}
                className="btnFancy w-[90%]"
                type="submit"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
export default page;
