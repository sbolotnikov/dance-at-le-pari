'use client';
import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import NavItem from './navItem';
import Burger from './burger';
import { useSession } from 'next-auth/react';
import ShowIcon from '../svg/showIcon';
import { signIn, signOut } from 'next-auth/react';
import ImgFromDb from '../ImgFromDb';
import { SettingsContext } from '@/hooks/useSettings';
import { ScreenSettingsContextType } from '@/types/screen-settings';
import Logo from '../svg/logo';
import { useDimensions } from '@/hooks/useDimensions';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';

type Props = {
  path: string;
  locale?: string | undefined;
  children?: React.ReactNode;
};
type CartItem = {
  id: number;
  image: string;
  eventtype: string;
  tag: string;
  price: number;
  amount: number;
};

const Navbar = ({ path, locale, children }: Props) => {
  const [style1, setStyle1] = useState({ display: 'none' });
  const [burgerState, setBurgerState] = useState(false);
  const [cartState, setCartState] = useState(false);
  const { changeTheme, darkMode } = useContext(
    SettingsContext
  ) as ScreenSettingsContextType;
  const { data: session } = useSession();
  const windowSize = useDimensions();
  const { items } = useSelector((state: RootState) => state.cart);
  useEffect(() => {
    if (windowSize.width !== undefined) {
      if (windowSize.width! < 768) {
        let items = document.querySelectorAll('.navbar__item');
        for (let i = 0; i < items.length; i++) {
          items[i].classList.add('translate-x-80');
        }
        document.getElementById('theme-toggle')?.classList.add('hidden');
        document.getElementById('locale-toggle')?.classList.add('hidden');
        document.getElementById('profile-toggle')?.classList.add('hidden');
      }
      changeMenu(true);
    }
  }, [windowSize.width]);
  const [navbarLinks, setNavbarLinks] = useState([
    {
      url: '/',
      title: 'Home',
      icon: 'Home',
    },
    {
      url: '/calendar',
      title: 'Calendar',
      icon: 'Calendar',
    },
    {
      url: '/dancing',
      title: 'Activities',
      icon: 'Activities',
    },
    {
      url: '/about_us/0',
      title: 'Studio',
      icon: 'Home2',
    },
  ]);
  useEffect(() => {
    let linksArray = [];
    if (!session) {
      linksArray = [
        {
          url: '/',
          title: 'Home',
          icon: 'Home',
        },
        {
          url: '/calendar',
          title: 'Calendar',
          icon: 'Calendar',
        },
        {
          url: '/dancing',
          title: 'Activities',
          icon: 'Activities',
        },
        {
          url: '/about_us/0',
          title: 'Studio',
          icon: 'Home2',
        },
        {
          url: '/blog/0',
          title: 'Blog',
          icon: 'Blog',
        },
      ];
    } else if (session.user.role == 'Admin') {
      linksArray = [
        {
          url: '/',
          title: 'Home',
          icon: 'Home',
        },
        {
          url: '/calendar',
          title: 'Calendar',
          icon: 'Calendar',
        },
        {
          url: '/dancing',
          title: 'Activities',
          icon: 'Activities',
        },
        {
          url: '/about_us/0',
          title: 'Studio',
          icon: 'Home2',
        },
        {
          url: '/schedule/0',
          title: 'Schedule Tool',
          icon: 'Schedule',
        },
        {
          url: '/blog/0',
          title: 'Blog',
          icon: 'Blog',
        },
        {
          url: '/admin/usersscreen',
          title: 'Users Screen',
          icon: 'Users',
        },
       
      ];
    } else {
      linksArray = [
        {
          url: '/',
          title: 'Home',
          icon: 'Home',
        },
        {
          url: '/calendar',
          title: 'Calendar',
          icon: 'Calendar',
        },
        {
          url: '/dancing',
          title: 'Activities',
          icon: 'Activities',
        },
        {
          url: '/about_us/0',
          title: 'Studio',
          icon: 'Home2',
        },
        {
          url: '/schedule/0',
          title: 'Schedule Tool',
          icon: 'Schedule',
        },
        {
          url: '/blog/0',
          title: 'Blog',
          icon: 'Blog',
        },
      ];
    }
    setNavbarLinks(linksArray);
  }, [session]);
  const changeMenu = (isChangeOrientation: boolean) => {
    let items = document.querySelectorAll('.navbar__item');
    if (windowSize.width! < 768 && !isChangeOrientation) {
      if (burgerState) {
        document
          .getElementById('navBarContainer')
          ?.classList.add('translate-x-80');
        document.getElementById('navBarContainer')?.classList.add('delay-600');
      } else {
        document
          .getElementById('navBarContainer')
          ?.classList.remove('translate-x-80');
        document
          .getElementById('navBarContainer')
          ?.classList.remove('delay-600');
      }

      for (let i = 0; i < items.length; i++) {
        if (burgerState) {
          items[i].classList.add('translate-x-80');
        } else {
          items[i].classList.remove('translate-x-80');
        }
      }
      burgerState
        ? document.getElementById('theme-toggle')?.classList.add('hidden')
        : document.getElementById('theme-toggle')?.classList.remove('hidden');
      burgerState
        ? document.getElementById('profile-toggle')?.classList.add('hidden')
        : document.getElementById('profile-toggle')?.classList.remove('hidden');
      setBurgerState(!burgerState);
    }
    if (windowSize.height! < 760 && !isChangeOrientation) {
      // document
      //     .getElementsByClassName('navbar__list')[0]
      //     .classList.remove('translate-x-80');
      //   document
      //     .getElementsByClassName('navbar__list')[0]
      //     .classList.remove('delay-600');
      for (let i = 0; i < items.length; i++) {
        if (burgerState) {
          items[i].classList.add('-translate-y-80');
        } else {
          items[i].classList.remove('-translate-y-80');
        }
      }

      burgerState
        ? document.getElementById('theme-toggle')?.classList.add('hidden')
        : document.getElementById('theme-toggle')?.classList.remove('hidden');
      burgerState
        ? document.getElementById('profile-toggle')?.classList.add('hidden')
        : document.getElementById('profile-toggle')?.classList.remove('hidden'); 
      setBurgerState(!burgerState);
    }
    if (
      isChangeOrientation &&
      (windowSize.height! < 680 || windowSize.width! < 768)
    ) {
      for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('-translate-y-80');
        items[i].classList.remove('translate-x-80');
        if (windowSize.height! < 760) items[i].classList.add('-translate-y-80');
        if (windowSize.width! < 768)
          document
            .getElementsByClassName('navbar__list')[0]
            .classList.add('translate-x-80');
        document
          .getElementsByClassName('navbar__list')[0]
          .classList.add('delay-600');
      }

      document.getElementById('theme-toggle')?.classList.add('hidden');
      document.getElementById('profile-toggle')?.classList.add('hidden');
      setBurgerState(false);
    }
  };
  useEffect(() => {
  (items.length>0)?setCartState(true): setCartState(false)
  }, [items]);
  let barArray = [
    {
      additionalStyle: '',
      icon: 'GMaps',
      stroke: '1',
      text: '34 South Ave., Fanwood, NJ 07023',
      link: 'https://www.google.com/maps/place/Le+Pari+Dance+Fitness+Center/@40.6355598,-74.3933059,17z/data=!3m1!4b1!4m5!3m4!1s0x89c3b097b4d07caf:0x3c77409024a4ea95!8m2!3d40.6355598!4d-74.3911172',
    },
    {
      link: 'https://www.facebook.com/LEPARIDANCENTER',
      additionalStyle: 'fill-darkMainColor',
      icon: 'Facebook',
      stroke: '5',
      text: '',
    },
    {
      link: 'https://www.instagram.com/lepari34/',
      additionalStyle: '',
      icon: 'Instagram',
      stroke: '1.5',
      text: '',
    },
    {
      link: 'https://www.youtube.com/channel/UCPC1HL3l6zTTScOZ3qkC8cw',
      additionalStyle: '',
      icon: 'Youtube',
      stroke: '1.5',
      text: '',
    },
    {
      link: 'https://www.tiktok.com/@dance_at_lepari',
      additionalStyle: 'fill-darkMainColor',
      icon: 'Tiktok',
      stroke: '1.5',
      text: '',
    },
    {
      link: '/mail_page',
      additionalStyle: 'fill-darkMainColor',
      icon: 'Email',
      stroke: '0.5',
      text: 'lepari34@gmail.com',
    },
    {
      link: 'tel:1-8482440512',
      additionalStyle: '',
      icon: 'Phone',
      stroke: '2',
      text: '(848)244-0512',
    }
  ];
  return (
    <nav className="navbar w-screen h-[100svh] overflow-hidden">
      <div className=" absolute inset-0 flex flex-col items-center justify-end z-[-5] pb-14">
        <Logo
          shadow={
            darkMode
              ? '0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'
              : '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'
          }
        />
      </div>
      {children}

      <div
        className=" w-full  flex-row justify-end md:justify-between"
        style={{ height: '100%' }}
      >
        <div className={`fixed bottom-0 right-0 w-screen bg-franceBlue  flex justify-between px-3 items-center md:relative md:flex-1 md:justify-around ${burgerState?"md:h-0 md:-translate-y-8 md:transition  md:duration-1000 md:ease-in-out":"md:h-8"} h-12  `
        // md:-translate-y-8 md:transition  md:duration-1000 md:ease-in-out
        }>
          {barArray.map((item, index) => {
            return (
              <Link
                href={item.link}
                key={'link' + index}
                className="flex-row flex items-center"
              >
                <button
                  type="button"
                  className={`cursor-pointer h-8 w-8 md:h-6 md:w-6 hover:animate-bounce hover:scale-110 stroke-darkMainColor ${item.additionalStyle}`}
                >
                  <ShowIcon icon={item.icon} stroke={item.stroke} />
                </button>
                <h3 className=" text-darkMainColor hidden md:block ml-1">
                  {item.text}
                </h3>
              </Link>
            );
          })}
        </div>
        <ul
          id="navBarContainer"
          className="navbar__list bg-darkMainBG/25 translate-x-80 backdrop-blur-md md:dark:bg-transparent md:bg-transparent dark:bg-lightMainBG/25 md:translate-x-0  md:backdrop-filter-none transition  duration-1000 ease-in-out"
        >
          {navbarLinks.map((item, index) => {
            return (
              <li
                className={` navbar__item transition duration-300 ease-in-out`}
                style={{ transitionDelay: `${100 + index * 100}ms` }}
                key={index}
                onClick={() => changeMenu(false)}
              >
                <NavItem title={item.title} icon={item.icon} url={item.url} />
              </li>
            );
          })}
        </ul>

        <div className={`navbar__right_span ${burgerState?"md:top-0":"md:top-7"}`}>
          {!session && (
            <button
              type="button"
              className="  h-6 w-6 mr-3 md:mr-6 md:h-8 md:w-8 rounded-sm outline-none"
              onClick={() => {
                signIn();
              }}
            >
              <div className="group flex  cursor-pointer  hover:scale-110  flex-col items-center ">
                <div className=" h-6 w-6 md:h-8 md:w-8 fill-none rounded-full bg-lightMainBG dark:bg-lightMainColor p-1 group-hover:animate-bounce stroke-lightMainColor dark:stroke-darkMainColor ">
                  <ShowIcon icon={'Login'} stroke={'2'} />
                </div>
                <p className=" tracking-widest mx-3 rounded-md text-lightMainColor darkMainColor md:bg-lightMainBG md:dark:bg-lightMainColor md:dark:text-darkMainColor dark:text-darkMainColor  opacity-100 group-hover:inline-flex md:block  md:group-hover:opacity-100 ">
                  {'LogIn'}
                </p>
              </div>
            </button>
          )}
          {session && (
            <button
              id="profile-toggle"
              type="button"
              className="  rounded-full h-full  mr-3 md:mr-6 outline-none "
              onClick={() => {
                burgerState ? changeMenu(false) : {};
              }}
            >
              <Link href={'/profile'}>
                <div className="group h-6 w-6 md:h-8 md:w-8 flex  cursor-pointer  hover:scale-110  flex-col items-center ">
                  <div className="   group-hover:animate-bounce stroke-lightMainColor dark:stroke-darkMainColor ">
                    {session.user.image ? (
                      <ImgFromDb
                        url={session.user.image ? session.user.image : ''}
                        stylings="object-fill rounded-full h-6 w-6 md:h-9 md:w-9"
                        alt="profile picture"
                      />
                    ) : (
                      <div className=" h-6 w-6 md:h-8 md:w-8 fill-none rounded-full bg-lightMainBG dark:bg-lightMainColor  stroke-lightMainColor dark:stroke-darkMainColor ">
                        <ShowIcon icon={'DefaultUser'} stroke={'2'} />
                      </div>
                    )}
                  </div>
                  <p className="hidden tracking-widest mx-3 transition duration-300 ease-in-out opacity-100 rounded-md text-darkMainColor md:bg-lightMainBG md:dark:bg-lightMainColor md:dark:text-darkMainColor md:text-lightMainColor group-hover:inline-flex md:block md:opacity-0 md:group-hover:opacity-100 ">
                    {'Profile'}
                  </p>
                </div>
              </Link>
            </button>
          )}
          <button
            id="theme-toggle"
            type="button"
            onClick={() => {
              changeTheme(!darkMode);
              !darkMode
                ? document.getElementsByTagName('body')[0].classList.add('dark')
                : document
                    .getElementsByTagName('body')[0]
                    .classList.remove('dark');
                    burgerState ? changeMenu(false) : {};
            }}
            className=" h-6 w-6 md:h-8 md:w-8  mr-3 md:mr-6 rounded-sm outline-none"
          >
            <div className="group flex  cursor-pointer  hover:scale-110  flex-col items-center ">
              <div className="  h-6 w-6 md:h-8 md:w-8  group-hover:animate-bounce stroke-lightMainColor dark:stroke-darkMainColor ">
                <div className=" h-6 w-6 md:h-8 md:w-8 mr-2  fill-none rounded-full bg-lightMainBG dark:bg-lightMainColor p-1 stroke-lightMainColor dark:stroke-darkMainColor ">
                  {darkMode ? (
                    <ShowIcon icon={'LightTheme'} stroke={'2'} />
                  ) : (
                    <ShowIcon icon={'DarkTheme'} stroke={'2'} />
                  )}
                </div>
              </div>
              <p className="hidden tracking-widest mx-3 transition duration-300 ease-in-out rounded-md text-darkMainColor md:bg-lightMainBG md:dark:bg-lightMainColor md:dark:text-darkMainColor md:text-lightMainColor opacity-100 group-hover:inline-flex md:block md:opacity-0 md:group-hover:opacity-100 ">
                {darkMode ? 'Light' : 'Dark'}
              </p>
            </div>
          </button>
          {cartState && <button
            id="cart-toggle"
            type="button"
            onClick={() => {
              burgerState ? changeMenu(false) : {};
            }}
            className=" h-6 w-6 md:h-8 md:w-8  mr-3 md:mr-6 rounded-sm outline-none"
          >
            <Link href={'/shopping'}>
              <div className="group flex  cursor-pointer  hover:scale-110  flex-col items-center ">
                <div className="  h-6 w-6 md:h-8 md:w-8 relative group-hover:animate-bounce stroke-lightMainColor dark:stroke-darkMainColor ">
                  <div className=" h-6 w-6 md:h-8 md:w-8 mr-2  rounded-full bg-lightMainBG dark:bg-lightMainColor p-1 fill-none  stroke-lightMainColor dark:stroke-darkMainColor ">
                    <ShowIcon icon={'ShoppingCart'} stroke={'1'} />
                  </div>
                  <span className="absolute -top-3 -right-3 h-5 w-5 pt-1 bg-yellow-600 text-center text-xs rounded-full  font-bold">
                      {items ? items.map(item=>item.amount).reduce((a, b) => a + b, 0): 0}
                  </span>
                </div>
                <p className="hidden tracking-widest mx-3 transition duration-300 ease-in-out opacity-100 rounded-md text-darkMainColor md:bg-lightMainBG md:dark:bg-lightMainColor md:dark:text-darkMainColor md:text-lightMainColor group-hover:inline-flex md:block md:opacity-0 md:group-hover:opacity-100 ">
                  Cart
                </p>
              </div>
            </Link>
          </button>
          }
          <button
            id="burger-toggle"
            className={`relative m-1 flex cursor-pointer p-1.5  outline-none rounded-md hover:ring-2 hover:ring-lightAccentColor focus:ring-lightAccentColor dark:hover:ring-darkAccentColor dark:focus:ring-darkAccentColor ${
              windowSize.height! < 760 || windowSize.width! < 768
                ? ''
                : 'hidden'
            }`}
            onClick={() => changeMenu(false)}
          >
            <Burger status={burgerState} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
