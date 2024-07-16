import dataObject from '@/DataObject';
import { ScreenSettingsContextType,  TDance,  TEventArray, TPriceOption } from '@/types/screen-settings';
import { createContext, useState, useEffect } from 'react'; 
type Props = {
    children?: React.ReactNode;
  };
  export const SettingsContext = createContext<ScreenSettingsContextType | null>(null);

export const SettingsProvider = ({ children }: Props) => {
  
    const [darkMode, setDarkMode] = useState (false);
    const [hideNav, setHideNav] = useState (false);
    const [events, setEvents] = useState<TEventArray>([]);
    const [hours, setHours] = useState<string[]>([]);
    const [dances, setDances] = useState<TDance[]>(dataObject.dances);
    const [giftCertificates, setGiftCertificates] = useState<TPriceOption[]>([]);
    const [gsImage, setGSImage] = useState<string>('');
    const changeTheme =(theme:boolean)=>{
        setDarkMode (theme);
    }
    const changeNav = (nav:boolean) => {
        setHideNav (nav);
    }
    useEffect(() => {
      fetch('/api/settings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data); 
          setEvents(data.events)
          setHours(data.hours)
          console.log(data.giftCertificates.priceOptions)
          setGiftCertificates(data.giftCertificates.priceOptions)
          setGSImage(data.giftCertificates.img)
        }).catch((error) => {console.log(error);})
    },[])
      return (
        <SettingsContext.Provider value={{darkMode, changeTheme,hideNav, changeNav, events, hours, dances, giftCertificates, gsImage }}>
          { children}
        </SettingsContext.Provider>
      );
    };
  