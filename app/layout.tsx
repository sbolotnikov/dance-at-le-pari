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
    'Looking for dance lessons? This is the place! Dance at Le Pari is the best dance studio in Fanwood, New Jersey that provides ballroom &amp; latin group and private dance lessons, wedding dance lessons as well as online dance classes.  Dance lessons near me. Dance Studio near me.',
  openGraph: {
    title: {
      template: '%s',
      default: 'Dance at Le Pari Dance Studio | United States',
    },
    description:
      'Looking for dance lessons? This is the place! Dance at Le Pari is the best dance studio in Fanwood, New Jersey that provides ballroom &amp; latin group and private dance lessons, wedding dance lessons as well as online dance classes.  Dance lessons near me. Dance Studio near me.',
    url: process.env.NEXTAUTH_URL + '',
    type: 'website',
    images: [
      { url: process.env.NEXTAUTH_URL + '/logo2.jpg', width: 750, height: 750 },
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
      {/* <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" /> */}
      {/* <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <meta property="og:title" content="Dance at Le Pari Dance Studio | United States"/>
          <meta property="og:description" content="Looking for dance lessons? This is the place! Dance at Le Pari is the best dance studio in Fanwood, New Jersey that provides ballroom &amp; latin group and private dance lessons, wedding dance lessons as well as online dance classes.  Dance lessons near me. Dance Studio near me."/>
          <meta property="og:url" content="https://www.leparidancenter.com"/>
          <meta property="og:site_name" content="Le Pari Dance Center"/>
          <meta property="og:type" content="website"/>
          <meta name="keywords" content="ballroom dance, dance lessons in NJ, argentine tango dance lessons in nj, salsa, group dance classes, rentals, wedding dance lessons"/>
          <meta property="og:image" content={process.env.NEXTAUTH_URL+'/logo2.jpg'}/>
          <meta property="og:image:width" content="750"/>
          <meta property="og:image:height" content="750"/> */}

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
