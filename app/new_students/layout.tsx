import { Metadata } from 'next';
export const metadata: Metadata = { 
    openGraph: { title: "Page: Offer to new Students | Dance at Le Pari Studio", url: `${process.env.NEXTAUTH_URL}/new_students` },
    description: "We recognize that it might be confusing to determine how to start Ballroom and Latin dancing and if you like it overall. Our expert instructors will help you! " ,
    title: "Page: Offer to new Students | Dance at Le Pari Studio" 
  };

export default function PageLayout({
  children, 
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}