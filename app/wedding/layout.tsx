import { Metadata, ResolvingMetadata } from 'next';
export const generateMetadata = async (
  
  parent: ResolvingMetadata
): Promise<Metadata> => {
  // read route params
 
 
  // optionally access and extend (rather than replace) parent metadata
//   const previousImages = (await parent).openGraph?.images || [];
 
   return {  
    openGraph: { title: "Page: Wedding Dance Lessons in studio | Dance at Le Pari Studio", url: `${process.env.NEXTAUTH_URL}/wedding` },
    description: "Weddings are very stressful! We are ready to help! Your wedding dance should be very beautiful, recorded for many years! We offer wedding dance lessons inside of the studio: bachelorette dance lessons, group dance classes, father daughter dance lessons and many more!" ,
    title: "Page: Wedding Dance Lessons in studio | Dance at Le Pari Studio" 
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