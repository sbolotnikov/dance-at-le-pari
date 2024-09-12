import { SitemapStream, streamToPromise } from 'sitemap';

export default async function generateSitemap(req, res) {
  // Create a stream to write to
  const smStream = new SitemapStream({
    hostname: 'https://dance-at-le-pari.vercel.app',
  });

  // List of pages to add to the sitemap
  const pages = [
    { url: '/', changefreq: 'daily', priority: 1 },
    { url: '/about_us/hours', changefreq: 'weekly', priority: 0.8 },
    { url: '/calendar', changefreq: 'weekly', priority: 0.8 },
    { url: '/blog/0', changefreq: 'daily', priority: 0.9 },
    { url: '/weddings', changefreq: 'monthly', priority: 0.7 }, 
    // Add more pages as needed
  ];

  // Add each page to the stream
  pages.forEach(page => {
    smStream.write(page);
  });

  // End the stream
  smStream.end();

  // Generate sitemap XML
  const sitemapOutput = await streamToPromise(smStream);

  // Set the content header
  res.setHeader('Content-Type', 'application/xml');

  // Send the XML to the browser
  res.write(sitemapOutput);
  res.end();
}