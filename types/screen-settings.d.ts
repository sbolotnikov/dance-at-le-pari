export interface IScreenSettings {
   darkMode: boolean;
  }
  export type ScreenSettingsContextType = {
    darkMode: boolean;
    changeTheme: (a:boolean) => void;
  };
  export type TEvent = {
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
  type TFullEvent = {
    eventtype: EventType;
    length:number;
    color: string | null;
    price: float;
    image: string | null;
    tag: string;
    title: string | null;
    date: datetime;
    location: string | null;
    description: string | null;
    visible:boolean;
  }
  type TPictureWithCapture ={
    urlData: string;
    capture: string
  }
  type TPicturesArray = TPictureWithCapture[];
  type TImage ={
    file:string;
    id:string;
  }