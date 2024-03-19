import { TEventSchedule } from '@/types/screen-settings';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type PopupContextType ={
  isMoving: boolean;
  item: TEventSchedule | null;
  setIsMoving: (b: boolean) => void;
  setItem: (item: TEventSchedule | null) => void;
}


type Props = {
    children?: React.ReactNode;
  };
  export const PopupContext = createContext<PopupContextType | null>(null);

export const PopupContextProvider = ({ children }: Props) => {
    
    const [isMoving, changeIsMoving] = useState (false);
    const [item, changeItem] = useState<TEventSchedule | null>(null);
   
    const setIsMoving =(b:boolean)=>{
      changeIsMoving (b);
  }
    const setItem =(item: TEventSchedule | null)=>{
      changeItem(item);
    }
     
      return (
        <PopupContext.Provider value={{isMoving, setIsMoving, item, setItem}}>
          { children}
        </PopupContext.Provider>
      );
    };
  