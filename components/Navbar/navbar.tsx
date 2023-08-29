'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NavItem from './navItem';
import Burger from './burger';
import { useSession } from 'next-auth/react';
import ShowIcon from '../svg/showIcon';
import { signIn, signOut } from 'next-auth/react';
import ImgFromDb from '../ImgFromDb';

type Props = {
  navbarLinks: { url: string; title: string; icon: string }[];
  path: string;
  locale?: string | undefined;
};

const Navbar = ({ navbarLinks, path, locale }: Props) => {
  const [style1, setStyle1] = useState({ display: 'none' });
  const [darkMode, setDarkMode] = useState(false);
  const [burgerState, setBurgerState] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();
  console.log('Client role', session?.user);
  useEffect(() => {
    if (window.innerWidth < 768) {
      document.getElementsByClassName('navbar__list')[0].classList.add('w-0');
      let items = document.querySelectorAll('.nav_img');
      for (let i = 0; i < items.length; i++) {
        items[i].classList.add('w-0');
      }
      document.getElementById('theme-toggle')?.classList.add('hidden');
      document.getElementById('locale-toggle')?.classList.add('hidden');
      document.getElementById('profile-toggle')?.classList.add('hidden');
    }
  }, []);
  return (
    <nav className="navbar">
      <ul className="navbar__list transition duration-1000 ease-in-out">
        {navbarLinks.map((item, index) => {
          return (
            <li
              className=" navbar__item"
              key={index}
            >
              <NavItem title={item.title} icon={item.icon} url={item.url} />
            </li>
          );
        })}
      </ul>

      <div className="navbar__right_span">
        <button
          type="button"
          className="  h-6 w-6 mr-3 md:mr-6 md:h-8 md:w-8 rounded-sm outline-none"
          onClick={() => {
            session ? signOut() : signIn();
          }}
        >
          <div className="group flex  cursor-pointer  hover:scale-110  flex-col items-center ">
            <div className=" h-6 w-6 md:h-8 md:w-8 fill-none group-hover:animate-bounce stroke-lightMainColor dark:stroke-darkMainColor ">
              <ShowIcon icon={session ? 'Logout' : 'Login'}  stroke={'2'} />
            </div>
            <p className="hidden tracking-widest mx-3 transition duration-300 ease-in-out opacity-100 group-hover:inline-flex md:block md:opacity-0 md:group-hover:opacity-100 ">
              {session ? 'Logout' : 'Login'}
            </p>
          </div>
        </button>
        {session && (
          <button
            id="profile-toggle"
            type="button"
            className="  rounded-full h-full  mr-3 md:mr-6 outline-none "
          >
            <Link href={'/profile'}>
              <div className="group h-6 w-6 md:h-8 md:w-8 flex  cursor-pointer  hover:scale-110  flex-col items-center ">
                <div className="   group-hover:animate-bounce stroke-lightMainColor dark:stroke-darkMainColor ">
                  {session.user.image ? (

                    <ImgFromDb url={session.user.image ? session.user.image : ''} stylings="object-fill rounded-full h-6 w-6 md:h-9 md:w-9"  alt="profile picture" />
                  ) : (
                    <div className=" h-6 w-6 md:h-8 md:w-8 fill-none stroke-lightMainColor dark:stroke-darkMainColor ">
                      <ShowIcon icon={'DefaultUser'} stroke={'2'}/>
                    </div>
                  )}
                </div>
                <p className="hidden tracking-widest mx-3 transition duration-300 ease-in-out opacity-100 group-hover:inline-flex md:block md:opacity-0 md:group-hover:opacity-100 ">
              {"Profile"}
            </p>
              </div>
            </Link>
          </button>
        )}
        <button
          id="theme-toggle"
          type="button"
          onClick={() => {
            // setTheme(!darkMode)
            setDarkMode(!darkMode);
            !darkMode
              ? document.getElementsByTagName('body')[0].classList.add('dark')
              : document
                  .getElementsByTagName('body')[0]
                  .classList.remove('dark');
          }}
          className=" h-6 w-6 md:h-8 md:w-8  mr-3 md:mr-6 rounded-sm outline-none"
        >
          <div className="group flex  cursor-pointer  hover:scale-110  flex-col items-center ">
            <div className="  h-6 w-6 md:h-8 md:w-8  group-hover:animate-bounce stroke-lightMainColor dark:stroke-darkMainColor ">
              <div className=" h-6 w-6 md:h-8 md:w-8 mr-2  fill-none stroke-lightMainColor dark:stroke-darkMainColor ">
                {darkMode ? (
                  <ShowIcon icon={'LightTheme'} stroke={'2'}/>
                ) : (
                  <ShowIcon icon={'DarkTheme'} stroke={'2'}/>
                )}
              </div>
            </div>
            <p className="hidden tracking-widest mx-3 transition duration-300 ease-in-out opacity-100 group-hover:inline-flex md:block md:opacity-0 md:group-hover:opacity-100 ">
              {darkMode ? 'Light' : 'Dark'}
            </p>
          </div>
        </button> 

        <button
          className="relative m-1 flex cursor-pointer p-1.5  outline-none rounded-md hover:ring-2 hover:ring-lightAccentColor focus:ring-lightAccentColor dark:hover:ring-darkAccentColor dark:focus:ring-darkAccentColor md:hidden"
          onClick={() => {
            burgerState
              ? document
                  .getElementsByClassName('navbar__list')[0]
                  .classList.add('w-0')
              : document
                  .getElementsByClassName('navbar__list')[0]
                  .classList.remove('w-0');
            let items = document.querySelectorAll('.nav_img');
            for (let i = 0; i < items.length; i++) {
              if (burgerState) {
                items[i].classList.remove('w-8');
                items[i].classList.add('w-0');
              } else {
                items[i].classList.remove('w-0');
                items[i].classList.add('w-8');
              }
            }
            burgerState
              ? document.getElementById('theme-toggle')?.classList.add('hidden')
              : document
                  .getElementById('theme-toggle')
                  ?.classList.remove('hidden');
            burgerState
              ? document
                  .getElementById('profile-toggle')
                  ?.classList.add('hidden')
              : document
                  .getElementById('profile-toggle')
                  ?.classList.remove('hidden');
            burgerState
              ? document
                  .getElementById('locale-toggle')
                  ?.classList.add('hidden')
              : document
                  .getElementById('locale-toggle')
                  ?.classList.remove('hidden');

            setBurgerState(!burgerState);
          }}
        >
          <Burger status={burgerState} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
