
import { getEvent } from '@/utils/functionsservers';
import { Metadata, ResolvingMetadata } from 'next';


type Props = {
  params: { id: string };
}; 
 
export const generateMetadata = async (
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  // read route params
  const id = params.id;

  // fetch data
  const event1 = await getEvent(parseInt(id));  
  // optionally access and extend (rather than replace) parent metadata
//   const previousImages = (await parent).openGraph?.images || [];

  return {
    title:  event1!.template.eventtype +" event on " + new Date(event1?.date!).toLocaleDateString('en-us', {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})+" "+  new Date(event1?.date!).toLocaleTimeString('en-us', { timeStyle: 'short', })+" "+event1!.title!+" | Dance at Le Pari", 
    openGraph: { title: event1!.template.eventtype +" event on " + new Date(event1?.date!).toLocaleDateString('en-us', {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})+" "+  new Date(event1?.date!).toLocaleTimeString('en-us', { timeStyle: 'short', })+" "+event1!.title!+" | Dance at Le Pari", url: `${process.env.NEXTAUTH_URL}/events/${id}`,  },
    description: event1 ? event1.description : 'default event description',

    // openGraph: {
    //   images: ['/some-specific-page-image.jpg', ...previousImages],
    // },
  };
};

export default function PostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}) {
  return <section>{children}</section>;
}
