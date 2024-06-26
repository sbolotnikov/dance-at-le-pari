import { Metadata } from 'next';
export const metadata: Metadata = {
  // read route params
 
 
  // optionally access and extend (rather than replace) parent metadata
//   const previousImages = (await parent).openGraph?.images || [];
 
    openGraph: { title: "Page: Calendar | Dance at Le Pari Studio", url: `${process.env.NEXTAUTH_URL}/calendar` },
    description: "Dance Events in New Jersey! Best Dance Studio in NJ with many dance options.  You want to have fun, go out dancing or find smth different to do, come to us! We offer dance events running every week as well as many dance classes to join! Dance Events and Dance Classes Calendar."  ,
    title: "Page: Calendar | Dance at Le Pari Studio" 

};

export default function PageLayout({
  children, 
}: {
  children: React.ReactNode;
 
}) {
  return <section>{children}</section>;
}