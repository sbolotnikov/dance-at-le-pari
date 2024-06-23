import { Metadata } from 'next';


type Props = {
  params: { id: string };
}; 
 
export const generateMetadata = (
  { params }: Props,
): Metadata => {
  // read route params
  const slug = params.id;
  const slugArray=[
      'private_lessons',
      'group_classes',
      'floor_fees',
      'parties',
      'special_events',
  ];
  const selectedIndex = slugArray.indexOf(params.id) || null;
    const index1 =
    selectedIndex !== null &&
      selectedIndex >= 0 &&
      selectedIndex < 5
      ? selectedIndex
      : 0

  // fetch data
  const pageArray = [{title:'Page: Private Lessons Packages | Activities | Dance at Le Pari Studio',description:'Private Dance Instructions Packages. All studio activities may be paid online. Dance at Le Pari Privacy policy may be found in the link below. ', keywords: 'private lessons, lessons packages, dance lessons packages, wedding dance packages'},
    { title: 'Page: Group Classes| Activities | Dance at Le Pari Studio', description: 'Group classes and group packages. All studio activities may be paid online. Dance at Le Pari Privacy policy may be found in the link below.',keywords: 'group dance lessons, group classes packages, group lessons packages, group classes lessons'},
    { title: 'Page: Floor Fees | Activities | Dance at Le Pari Studio', description:'Floor fees for outside dance instructors. All studio activities may be paid online. Dance at Le Pari Privacy policy may be found in the link below. ', keywords:'floor fees, rent dance space, teach dance lessons, outside dance teachers'},
    { title: 'Page: Parties or Socials | Activities | Dance at Le Pari Studio', description: 'Social Dancing Parties. All studio activities may be paid online. Dance at Le Pari Privacy policy may be found in the link below.', keywords: 'dance party, socials, dance social events, ballroom social'},
    { title: 'Page: Special Dance Socials | Activities | Dance at Le Pari Studio', description: 'Special Dance Events at Dance at Le Pari. All studio activities may be paid online. Dance at Le Pari Privacy policy may be found in the link below.', keywords:'special dance events, dance parties, dance events, ballroom social'}];
  // optionally access and extend (rather than replace) parent metadata
//   const previousImages = (await parent).openGraph?.images || [];
 
   return {  
    openGraph: { title:pageArray[index1].title , url: `${process.env.NEXTAUTH_URL}/dancing/${slug}` },
    description: pageArray[index1].description  , 
    keywords:pageArray[index1].keywords
  };
};

export default function PageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    id: string;
  };
}) {
  return <section>{children}</section>;
}