import Navbar from '@/components/Navbar/navbar';
import './navStyle.css';
import './globals.css';
import { Providers } from './providers';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import localFont from '@next/font/local'

const dancingScript = localFont({
  src: [
    {
      path: '../public/fonts/static/DancingScript-Bold.ttf',
      weight: '700'
    },
    {
      path: '../public/fonts/static/DancingScript-SemiBold.ttf',
      weight: '600'
    },
    {
      path: '../public/fonts/static/DancingScript-Regular.ttf',
      weight: '400'
    },
    {
      path: '../public/fonts/static/DancingScript-Medium.ttf',
      weight: '500'
    },
  ],
  variable: '--font-DancingScript'
})
const inter = Inter({ subsets: ['latin'] });
let navbarLinks = [
  {
    url: '/',
    title: 'Home',
    icon: 'Home2',
  },
  {
    url: '/admin/usersscreen',
    title: 'Users Screen',
    icon: 'Users',
  },
  {
    url: '/signin',
    title: 'Register',
    icon: 'Register'
  },

];
export const metadata = {
  title: 'Le Pari Dance Center | In-Studio & Online Dance Lessons, Wedding Dance | Fanwood, NJ',
  description: 'Looking for dance lessons? This is the place! Le Pari Dance Fitness Center is the best dance studio in Fanwood, New Jersey that provides ballroom & latin group and private dance lessons, wedding dance lessons as well as online dance classes.  Dance lessons near me. Dance Studio near me.',
icons:{
  icons: {
    icon: [{ url: 'favicon-32x32.png' },  ],
    shortcut: ['favicon-32x32.png'],
    apple: [
      { url: 'apple-touch-icon.png' },
      { url: 'apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome',
        url: 'android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome',
        url: 'android-chrome-512x512.png',
      },
    ],
  },
  
 
},
manifest: 'site.webmanifest',
  "og:description":"Looking for dance lessons? This is the place! Le Pari Dance Fitness Center is the best dance studio in Fanwood, New Jersey that provides ballroom & latin group and private dance lessons, wedding dance lessons as well as online dance classes.  Dance lessons near me. Dance Studio near me.",

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`min-h-screen  light antialiased ${inter.className} ${dancingScript.variable}`}
    >
                    <Head>
          {/* <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
                    <link
            rel="icon"
            type="image/png"
            sizes="72x72"
            href="icons/icon-72x72.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
                   <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href="icons/icon-96x96.png"
          />
         <link
            rel="icon"
            type="image/png"
            sizes="128x128"
            href="icons/icon-128x128.png"
          />
           <link
            rel="icon"
            type="image/png"
            sizes="128x128"
            href="icons/icon-128x128.png"
          />
                     <link
            rel="icon"
            type="image/png"
            sizes="144x144"
            href="icons/icon-144x144.png"
          />
             <link
            rel="icon"
            type="image/png"
            sizes="152x152"
            href="icons/icon-152x152.png"
          />
              <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="icons/icon-192x192.png"
          />
            <link
            rel="icon"
            type="image/png"
            sizes="384x384"
            href="icons/icon-384x384.png"
          />
           <link
            rel="icon"
            type="image/png"
            sizes="512x512"
            href="icons/icon-512x512.png"
          />
   
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
         <link rel="icon" href="/favicon.ico" sizes="any" /> */}
         {/* <link rel="icon" href="/icon?<generated>" type="image/png" sizes="32x32" /> */}
          {/* <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <meta property="og:title" content="Le Pari Dance Fitness Center | United States"/>
          <meta property="og:description" content="Looking for dance lessons? This is the place! Le Pari Dance Fitness Center is the best dance studio in Fanwood, New Jersey that provides ballroom &amp; latin group and private dance lessons, wedding dance lessons as well as online dance classes.  Dance lessons near me. Dance Studio near me."/>
          <meta property="og:url" content="https://www.leparidancenter.com"/>
          <meta property="og:site_name" content="Le Pari Dance Center"/>
          <meta property="og:type" content="website"/>
          <meta name="keywords" content="ballroom dance, dance lessons in NJ, argentine tango dance lessons in nj, salsa, group dance classes, rentals, wedding dance lessons"/>
          <meta property="og:image" content="https://static.wixstatic.com/media/450706_74c29be5586e474992220accb2bedc18.png/v1/fill/w_1277,h_825,al_c/450706_74c29be5586e474992220accb2bedc18.png"/>
          <meta property="og:image:width" content="1277"/>
          <meta property="og:image:height" content="825"/>
  */}
 
        </Head>
      <body suppressHydrationWarning={true}>
        <Providers>
          <main id="mainPage" className="fixed w-screen h-[100vh] p-0 m-0 items-center justify-center overflow-hidden text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG">
            <Navbar navbarLinks={navbarLinks} path={''} locale={'EN'} >
            {children}
            </Navbar>
          </main>
        </Providers>
      </body>
    </html>
  );
}
