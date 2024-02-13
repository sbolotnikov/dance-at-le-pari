/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    appDir: true,
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
};
// const nextTranslate = require('next-translate');
const withTM = require('next-transpile-modules')([
  '@square/web-sdk',
  'react-square-web-payments-sdk',
]);
module.exports = withTM({
  // ...nextTranslate(),
  reactStrictMode: true,
  experimental: {
    esmExternal: 'loose',
  },
  images: {
    domains: [
      'localhost',
      'dance-at-le-pari.vercel.app',
      'lh3.googleusercontent.com',
    ],
  },
});

module.exports = nextConfig;
