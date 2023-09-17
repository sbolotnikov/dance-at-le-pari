export interface IScreenSettings {
   darkMode: boolean;
  }
  export type ScreenSettingsContextType = {
    darkMode: boolean;
    changeTheme: (a:boolean) => void;
  };
  export type TEvent = {
    color: string;
    date: string;
    tag: string;
    id: number;
  }
  type TEventArray = TEvent[];
  type TDay ={
    value: string,
    event: TEventArray | null;
    isCurrentDay: boolean,
    date: string,
  }