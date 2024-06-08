import { prisma } from '@/lib/prisma';
import { TPost } from '@/types/screen-settings';
import { Metadata, ResolvingMetadata } from 'next';
import { cache } from 'react';

type Props = {
  params: { slug: string };
}; 
const getPost = async (slug: string) => {


    try {
        const post = await prisma.post.update({
          where: { slug },
          data: { views: { increment: 1 } },
          include: { user: true },
        });
        await prisma.$disconnect()
        return post;
      } catch (err) {
        return null

      }


   
    
};
export const generateMetadata = async (
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  // read route params
  const slug = params.slug;

  // fetch data
  const post = await getPost(slug);  
  // optionally access and extend (rather than replace) parent metadata
//   const previousImages = (await parent).openGraph?.images || [];

  return {
    title: 'Blog Post', 
    openGraph: { title: post!.title, url: `${process.env.NEXTAUTH_URL}/posts/${slug}`, images:['http://localhost:3000/api/og?title=My Blog Post&mainTopics=nodejs,javascript,react'] },
    description: post ? post.title : 'default post title',

    // openGraph: {
    //   images: ['/some-specific-page-image.jpg', ...previousImages],
    // },
  };
};

export default function PostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}) {
  return <section>{children}</section>;
}
