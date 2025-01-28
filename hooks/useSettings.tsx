import dataObject from '@/DataObject';
import {
  ScreenSettingsContextType,
  TDance,
  TEvent,
  TPriceOption,
} from '@/types/screen-settings';
import { createContext, useState, useEffect } from 'react';
type Props = {
  children?: React.ReactNode;
};
export const SettingsContext = createContext<ScreenSettingsContextType | null>(
  null
);

export const SettingsProvider = ({ children }: Props) => {
  const [darkMode, setDarkMode] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const [events, setEvents] = useState<TEvent[]>([]);
  const [hours, setHours] = useState<string[]>([]);
  const [selectedWeddingPackages, setSelectedWeddingPackages] = useState<number[]>([]);
  const [specialWeddingPackage, setSpecialWeddingPackage] = useState<number>(-1);
  const [dances, setDances] = useState<TDance[]>(dataObject.dances);
  const [giftCertificates, setGiftCertificates] = useState<TPriceOption[]>([]);
  const [gsImage, setGSImage] = useState<string>('');
  const changeTheme = (theme: boolean) => {
    setDarkMode(theme);
  };
  const changeNav = (nav: boolean) => {
    setHideNav(nav);
  };
  useEffect(() => {
    fetch('/api/settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents([{
          date: '',
          tag: 'Give a Gift of Dance!',
          id: '/gift',
          image:'/images/giftcertificate.jpg',
          eventtype: '',
        },
        {
          date: '',
          tag: 'Subscribe to our Newsletter!',
          id: '/subscribeemaillist',
          image:'/images/gotmail.jpg',
          eventtype: '',
        },...data.events,]);
        setHours(data.hours);
        setGiftCertificates(data.giftCertificates.priceOptions);
        setGSImage(data.giftCertificates.img);
        console.log(data);
        setSelectedWeddingPackages([...data.wedding.packages]); 
        setSpecialWeddingPackage(data.wedding.special)
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <SettingsContext.Provider
      value={{
        darkMode,
        changeTheme,
        hideNav,
        changeNav,
        events,
        hours,
        selectedWeddingPackages,
        specialWeddingPackage,
        dances,
        giftCertificates,
        gsImage,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
