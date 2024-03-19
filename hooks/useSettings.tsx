import { ScreenSettingsContextType, IScreenSettings } from '@/types/screen-settings';
import { createContext, useContext, useState, useEffect } from 'react';
type Props = {
    children?: React.ReactNode;
  };
  export const SettingsContext = createContext<ScreenSettingsContextType | null>(null);

export const SettingsProvider = ({ children }: Props) => {
    
    const [darkMode, setDarkMode] = useState (false);
  
    const changeTheme =(theme:boolean)=>{
        setDarkMode (theme);
    }
      return (
        <SettingsContext.Provider value={{darkMode, changeTheme}}>
          { children}
        </SettingsContext.Provider>
      );
    };
  