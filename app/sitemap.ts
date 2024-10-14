
import { TBlogPost, TEvent } from '@/types/screen-settings';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const response = await fetch(`https://leparidancecenter.com/api/posts?cat=`);
  const data   = await response.json();
  const blogPosts: TBlogPost[] = data.posts;
  const postEntries: MetadataRoute.Sitemap = blogPosts.map((item)=>{return {url:`${process.env.NEXTAUTH_URL}/posts/${item.slug}`,lastModified: new Date (item.createdAt)}});
  const response2 = await fetch(`https://leparidancecenter.com/api/event/allagenda`);
  const data2   = await response2.json();
  const events = data2.eventJSON as TEvent[]; 
  const eventEntries: MetadataRoute.Sitemap = events.map((item)=>{return {url:`${process.env.NEXTAUTH_URL}/events/${item.id}`,changeFrequency:'monthly'}});
  return [
    {
      url:`${process.env.NEXTAUTH_URL}/about_us/welcome`,
    },
    {
      url:`${process.env.NEXTAUTH_URL}/about_us/our-team`,
    },
    {
      url:`${process.env.NEXTAUTH_URL}/about_us/location`,
    },
    {
      url:`${process.env.NEXTAUTH_URL}/about_us/studio-tour`,
    },
    {
      url:`${process.env.NEXTAUTH_URL}/about_us/hours`,
    },
    {
      url:`${process.env.NEXTAUTH_URL}/blog/0`,
    },
    {
      url:`${process.env.NEXTAUTH_URL}/calendar`,
    },
    {
      url:`${process.env.NEXTAUTH_URL}/new_students`,
    },
    {
      url:`${process.env.NEXTAUTH_URL}/dancing`,
    },
    {
      url:`${process.env.NEXTAUTH_URL}/gift`,
    },
    {
      url:`${process.env.NEXTAUTH_URL}/mail_page`,
    },
    {
      url:`${process.env.NEXTAUTH_URL}/weddings`,
    },
    {
      url:`${process.env.NEXTAUTH_URL}/subscribeemaillist`,
    },
    ...postEntries,
    ...eventEntries
  ]
}