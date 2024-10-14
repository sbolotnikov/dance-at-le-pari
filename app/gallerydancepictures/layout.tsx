import { Metadata } from 'next';
export const metadata: Metadata = {
  // read route params
 
 
  // optionally access and extend (rather than replace) parent metadata
//   const previousImages = (await parent).openGraph?.images || [];
 
    openGraph: { title: "Page: Picture Gallery | Dance at Le Pari Studio", url: `${process.env.NEXTAUTH_URL}/gallerydancepictures` },
    description: 'Studio Picture Gallery'  ,
    title: "Page: Picture Gallery | Dance at Le Pari Studio" 

};

export default function PageLayout({
  children, 
}: {
  children: React.ReactNode;
 
}) {
  return <section>{children}</section>;
}