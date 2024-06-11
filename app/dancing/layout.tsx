import { Metadata } from 'next';
export const metadata: Metadata = {
 
 
  // optionally access and extend (rather than replace) parent metadata
//   const previousImages = (await parent).openGraph?.images || [];
   
    openGraph: { title: "Page: Activities | Dance at Le Pari Studio", url: `${process.env.NEXTAUTH_URL}/dancing` },
    description: "All studio activities. Can pay for all services online as contactless method of payment: online &amp; in studio groups &amp; privates, dance social party admission, dance host cost, online &amp; in studio wedding dance lessons, floor fee. You can find Privacy Policy of Le Pari Dance Center. " ,
    title: "Page: Activities | Dance at Le Pari Studio" 
};

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;   
}) {
  return <section>{children}</section>;
}
