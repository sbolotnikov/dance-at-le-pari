/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
};
// const nextTranslate = require('next-translate');
const withTM = require('next-transpile-modules')([
  '@square/web-sdk',
  'react-square-web-payments-sdk',
]);
module.exports = { crossOrigin: 'anonymous', };
module.exports = withTM({
  // ...nextTranslate(),
  reactStrictMode: true,
  experimental: {
    esmExternal: 'loose',
  },
  images: {
    domains: [
      'localhost',
      'www.leparidancenter.com',
      'dance-at-le-pari.vercel.app',
      'lh3.googleusercontent.com',
      'i3.ytimg.com',
      'drive.google.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i3.ytimg.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com', 
        pathname: '**',
      },

    ],
  },
});

module.exports = nextConfig;
