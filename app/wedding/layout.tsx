import { Metadata } from 'next';
export const metadata: Metadata = { 
    openGraph: { title: "Page: Wedding Dance Lessons in studio | Dance at Le Pari Studio", url: `${process.env.NEXTAUTH_URL}/wedding` },
    description: "Weddings are very stressful! We are ready to help! Your wedding dance should be very beautiful, recorded for many years! We offer wedding dance lessons inside of the studio: bachelorette dance lessons, group dance classes, father daughter dance lessons and many more!" ,
    title: "Page: Wedding Dance Lessons in studio | Dance at Le Pari Studio" 
  };

export default function PageLayout({
  children, 
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}