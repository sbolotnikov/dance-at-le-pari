import { Metadata, ResolvingMetadata } from 'next';
type Props = {
    params: { cat: string };
  }; 
export const generateMetadata = async (
    { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  // read route params
  const slug = params.cat;
 
  // optionally access and extend (rather than replace) parent metadata
//   const previousImages = (await parent).openGraph?.images || [];
 
   return {  
    openGraph: { title: "Page: Blog | Dance at Le Pari Studio", url: `${process.env.NEXTAUTH_URL}/blog/0` },
    description: "This site is blog about dancing and everything that connects to dancing. Tips, tricks, additional information, experts info on dancing experience and knowledge."  ,
    title: "Page: Blog | Dance at Le Pari Studio" 
  };
};

export default function PageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    cat: string;
  };
}) {
  return <section>{children}</section>;
}