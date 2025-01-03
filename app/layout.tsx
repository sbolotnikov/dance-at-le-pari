import Navbar from '@/components/Navbar/navbar';
import './navStyle.css';
import './globals.css';
import { Providers } from './providers';
import { Lato } from 'next/font/google';
import localFont from 'next/font/local';
import { Metadata } from 'next';

const dancingScript = localFont({
  src: [
    {
      path: '../public/fonts/static/DancingScript-Bold.ttf',
      weight: '700',
    },
    {
      path: '../public/fonts/static/DancingScript-SemiBold.ttf',
      weight: '600',
    },
    {
      path: '../public/fonts/static/DancingScript-Regular.ttf',
      weight: '400',
    },
    {
      path: '../public/fonts/static/DancingScript-Medium.ttf',
      weight: '500',
    },
  ],
  variable: '--font-DancingScript',
});

const latoFont = Lato({
  weight: ['300', '400', '700'],
  style: ['italic', 'normal'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  manifest: '/site.webmanifest',
  metadataBase: new URL(process.env.NEXTAUTH_URL + ''),
  title: {
    template: '%s',
    default: 'Dance at Le Pari Dance Studio | Fanwood, NJ, USA',
  },
  keywords:"ballroom dance, dance lessons in NJ, argentine tango dance lessons in nj, salsa, group dance classes, rentals, wedding dance lessons",
  description:
    'Looking for dance lessons? Make Dance at Le Pari, the best dance studio located in Fanwood NJ, your destination for all things dance. Private dance lessons, group dance lessons, wedding dance lessons and weekend dance socials.',
  openGraph: {
    title: {
      template: '%s',
      default: 'Dance at Le Pari Dance Studio | United States',
    },
    description:
      'Looking for dance lessons? Make Dance at Le Pari, the best dance studio located in Fanwood NJ, your destination for all things dance. Private dance lessons, group dance lessons, wedding dance lessons and weekend dance socials.',
    url: process.env.NEXTAUTH_URL + '',
    type: 'website',
    images: [
      { url: process.env.NEXTAUTH_URL + '/logo2.jpg', width: 1200, height: 640 },
    ],
  },
};

export default function RootLayoutFC({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`min-h-screen  light antialiased ${latoFont.className} ${dancingScript.variable}`}
    >
      <link
  rel="icon"
  href="/icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
<link
  rel="apple-touch-icon"
  href="/apple-icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/> 

      <body suppressHydrationWarning={true}>
        <Providers>
          <main
            id="mainPage"
            className="fixed w-screen h-[100svh] p-0 m-0 items-center justify-center overflow-hidden text-lightMainColor dark:text-darkMainColor bg-lightMainBG dark:bg-darkMainBG"
          >
            <Navbar path={''} locale={'EN'}>
              {children}
            </Navbar>
          </main>
        </Providers>
      </body>
    </html>
  );
}
