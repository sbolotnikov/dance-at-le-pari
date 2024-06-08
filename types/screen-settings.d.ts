export interface IScreenSettings {
   darkMode: boolean;
  }
  export type ScreenSettingsContextType = {
    darkMode: boolean;
    changeTheme: (a:boolean) => void;
    events:TEventArray;
    hours:string[];
    dances:TDance[];
  };
  export type TPost ={
    img: string;
    createdAt: string;
    catSlug: string;
    slug: string;
    title: string;
    desc: string;
    id: string;
    views: number;
    user: { name: string; image: string };
   } | null
  export type TEvent = {
    date: string;
    tag: string;
    id: number;
    image: string;
    eventtype: string;
  }
  type TEventArray = TEvent[];
  type TBlogPost = {
      img: string;
      createdAt: string;
      catSlug: string;
      slug: string;
      title: string;
      desc: string;
      id: string;
      views: number;
      userID: number;
      user: { name: string; image: string };
  }
  type TDay ={
    value: string,
    event: TEventArray | null;
    isCurrentDay: boolean,
    date: string,
  }
  export type TEventSchedule = {
    date: string;
    tag: string;
    id: number;
    eventtype: string;
    interval:number |null;
    length:number;
    location:string | null;
    repeating: boolean;
    studentid: number[];
    teachersid: number[];
   until: string | null;
  }
  type TEventScheduleArray = TEventSchedule[];
  type TDaySchedule ={
    value: string,
    event: TEventScheduleArray | null;
    isCurrentDay: boolean,
    date: string,
  }
  type TFullEvent = {
    eventtype: EventType;
    length:number;
    color: string | null;
    price: number;
    image: string | null;
    tag: string;
    title: string | null;
    date: datetime;
    location: string | null;
    description: string | null;
    visible:boolean;
    teacher:string | null;
    bio:string | null;
    teacher_img:string | null;
    tables: number[] | null;
    seatmap: string | null;
    tableName: string;
  }
  type TEventAgenda ={
    date: string,
description:string | null,
eventtype:EventType,
id:number,
image:string | null,
length:number,
price:number,
tag:string,
teacher:string | null,

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
  type TTemplateSmall ={
  tag:string;
  eventtype:string,
  id:number;
   image:string;
   length:number;
   price:number;
   teachersid:number[];
   title:string | null;
   location:string | null;
   description:string | null;
   visible:boolean;
  }
  type TTemplateNew ={
    tag:string;
    eventtype:string,
    id:number;
     image:string;
     length:number;
     options:TPriceOption[]; 
     teachersid:number[];
     title:string | null;
     location:string | null;
     description:string | null;
     visible:boolean;
    }
  type TPriceOption = {
    tag: string;
    price: number;
    amount: number;
  }; 
  type TTemplateFront ={
    tag:string;
    eventtype:string,
    templateID:number;
     image:string;
     visibility:boolean;
    }
  type TTeacherInfo = {
    id: number;
    image: string;
    name: string;
  };
  type TableSeat = {
    table: number;
    seat: number;
  };
  type TPaymentType = {
    id:number | null;
    tag: string;
    description: string;    
    amount: number;
    price: number;
    options: TPriceOption[] | null;
    image: string;
    eventtype: string;
 }
 type TDance = {
    name: string;
    img: string;
    videoLink: string;
    short: string;
    poem: string;
    songs: {
        title: string;
        link: string;
    }[];
}