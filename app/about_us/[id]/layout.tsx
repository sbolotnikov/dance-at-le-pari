import { Metadata, ResolvingMetadata } from 'next';


type Props = {
  params: { id: string };
}; 
 
export const generateMetadata = async (
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  // read route params
  const slug = params.id;
  const slugArray=[
    'welcome',
    'our-team',
   'studio-tour',
    'location',
    'hours',
  ];
  const selectedIndex = slugArray.indexOf(params.id) || null;
    const index1 =
    selectedIndex !== null &&
      selectedIndex >= 0 &&
      selectedIndex < 5
      ? selectedIndex
      : 0

  // fetch data
  const pageArray = [{title: "Welcome to the studio", description: "Welcome message to dancers or people who wants to learn how to dance"},
                     {title: "Our Professional Team", description: "Our world-awarded dance instructors specialize in teaching from beginner to advanced levels, adults and kids on all types of dancing: ballroom, latin, argentine tango, hustle, west coast swing, salsa. etc. Specialist of wedding dance instructions. Biography of ballroom, latin, argentine tango, hustle, west coast swing instructors, teachers, manager and owner of dance studio" },
                     {title: "Studio Interior/Exterior tour", description: "Dance Studio pictures: Inside or Outside tour. Explore our dance studio via pictures & video! Le Pari Dance Center -the place to visit, the place to dance at, the place to learn!"},
                     {title: "Our Location", description: "Close to major roads, free parking. Easy to get to: 34 South Avenue, Fanwood, NJ 07023. Location, directions, address, contact information of the Le Pari Dance Fitness Center"},
                     {title: "Hours Of Operation", description: "hours of operation, opening and closing time of the dance center, contact information" }];  
  // optionally access and extend (rather than replace) parent metadata
//   const previousImages = (await parent).openGraph?.images || [];
 
   return {  
    openGraph: { title: "Post: "+pageArray[index1].title +" | Dance at Le Pari Studio", url: `${process.env.NEXTAUTH_URL}/about_us/${slug}` },
    description: pageArray[index1].description  ,
    title: "Post: "+pageArray[index1].title +" | Dance at Le Pari Studio"
    
  };
};

export default function PageLayout({
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