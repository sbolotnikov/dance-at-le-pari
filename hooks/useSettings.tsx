import { ScreenSettingsContextType,  TEventArray } from '@/types/screen-settings';
import { createContext, useState, useEffect } from 'react';
type Props = {
    children?: React.ReactNode;
  };
  export const SettingsContext = createContext<ScreenSettingsContextType | null>(null);

export const SettingsProvider = ({ children }: Props) => {
  
    const [darkMode, setDarkMode] = useState (false);
    const [events, setEvents] = useState<TEventArray>([]);
    const [hours, setHours] = useState<string[]>([]);
    const changeTheme =(theme:boolean)=>{
        setDarkMode (theme);
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
        }).catch((error) => {console.log(error);})
    },[])
      return (
        <SettingsContext.Provider value={{darkMode, changeTheme,events, hours}}>
          { children}
        </SettingsContext.Provider>
      );
    };
  