/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
          appDir: true,
      },
}
// const nextTranslate = require('next-translate');
module.exports = {
// ...nextTranslate(),
images: {
    domains:['localhost','dance-at-le-pari.vercel.app','lh3.googleusercontent.com']
}
};

module.exports = nextConfig
