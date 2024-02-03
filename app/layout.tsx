import Navbar from '@/components/Navbar/navbar';
import './navStyle.css';
import './globals.css';
import { Providers } from './providers';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

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

export const metadata = {
  title: 'Le Pari Dance Center | In-Studio & Online Dance Lessons, Wedding Dance | Fanwood, NJ',
  description: 'Looking for dance lessons? This is the place! Le Pari Dance Fitness Center is the best dance studio in Fanwood, New Jersey that provides ballroom & latin group and private dance lessons, wedding dance lessons as well as online dance classes.  Dance lessons near me. Dance Studio near me.',
 
manifest: 'site.webmanifest',
  "og:description":"Looking for dance lessons? This is the place! Le Pari Dance Fitness Center is the best dance studio in Fanwood, New Jersey that provides ballroom & latin group and private dance lessons, wedding dance lessons as well as online dance classes.  Dance lessons near me. Dance Studio near me.",

};

export default function RootLayoutFC({
  children,
}: {
  children: React.ReactNode;
})

{
 
  return ( 
    <html
      lang="en"
      className={`min-h-screen  light antialiased ${inter.className} ${dancingScript.variable}`}
    > 
          
          {/* <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" /> */}
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <meta property="og:title" content="Le Pari Dance Fitness Center | United States"/>
          <meta property="og:description" content="Looking for dance lessons? This is the place! Le Pari Dance Fitness Center is the best dance studio in Fanwood, New Jersey that provides ballroom &amp; latin group and private dance lessons, wedding dance lessons as well as online dance classes.  Dance lessons near me. Dance Studio near me."/>
          <meta property="og:url" content="https://www.leparidancenter.com"/>
          <meta property="og:site_name" content="Le Pari Dance Center"/>
          <meta property="og:type" content="website"/>
          <meta name="keywords" content="ballroom dance, dance lessons in NJ, argentine tango dance lessons in nj, salsa, group dance classes, rentals, wedding dance lessons"/>
          <meta property="og:image" content={process.env.NEXTAUTH_URL+'/logo2.jpg'}/>
          <meta property="og:image:width" content="750"/>
          <meta property="og:image:height" content="750"/>
         
      <body suppressHydrationWarning={true}>
        <Providers>
 
          <main id="mainPage" className="fixed w-screen h-[100vh] p-0 m-0 items-center justify-center overflow-hidden text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG">
            <Navbar path={''} locale={'EN'} >
            {children}
            </Navbar>
          </main> 
        </Providers>
      </body>
    </html> 
  );
}
