import {MetadataRoute} from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules:[
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/schedule','/musicplayer','/partymode', '/profile', '/particles4'], 
    },
   ],
    sitemap:`${process.env.NEXTAUTH_URL}/sitemap.xml`  
  };
}

 
 