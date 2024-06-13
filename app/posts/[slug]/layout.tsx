
import { getPost } from '@/utils/functionsservers';
import { Metadata, ResolvingMetadata } from 'next';


type Props = {
  params: { slug: string };
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
    openGraph: { title: "Post: "+post!.title +" | Dance at Le Pari Blog", url: `${process.env.NEXTAUTH_URL}/posts/${slug}` },
    description: post ? post.title : 'default post title',
    keywords: post?.keywords,
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
