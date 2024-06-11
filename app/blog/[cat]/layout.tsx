import { getCategory } from '@/utils/functionsservers';
import { Metadata, ResolvingMetadata } from 'next';
type Props = {
    params: { cat: string };
  }; 
export const generateMetadata = async (
    { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  // read route params
  const cat = params.cat;
  let category1: any
  if (cat!='0')  category1 = await getCategory(cat)
  // optionally access and extend (rather than replace) parent metadata
//   const previousImages = (await parent).openGraph?.images || [];
 
   return {  
    openGraph: { title: `${(cat!='0')?category1?.title:"All"} Categor${(cat!='0')?'y':"ies"} of Blog | Dance at Le Pari Studio`, url: `${process.env.NEXTAUTH_URL}/blog/${cat}` },
    description: "This site is blog about dancing and everything that connects to dancing. Tips, tricks, additional information, experts info on dancing experience and knowledge."  ,
    title: `${(cat!='0')?category1?.title:"All"} Categor${(cat!='0')?'y':"ies"} of  Blog | Dance at Le Pari Studio` 
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