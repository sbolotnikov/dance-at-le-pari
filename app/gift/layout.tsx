import { Metadata } from 'next';
export const metadata: Metadata = { 
    openGraph: { title: "Page: Gift Certificates | Dance at Le Pari Studio", url: `${process.env.NEXTAUTH_URL}/gift` },
    description: "Gift certificates for ballroom dance classes at Dance at le Pari. Perfect for all occasions and skill levels. Choose from group classes, private lessons, or workshops in waltz, tango, foxtrot, and more." ,
    title: "Page: Page: Gift Certificates | Dance at Le Pari Studio" 
  };

export default function PageLayout({
  children, 
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}