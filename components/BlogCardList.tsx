import Link from 'next/link';
import ImgFromDb from './ImgFromDb';
import { useDimensions } from '@/hooks/useDimensions';

type Props = {
  posts:{
    img: string;
    createdAt: string;
    catSlug: string;
    slug: string;
    title: string;
    desc: string;
    id: string;
    views: number;
    user: { name: string; image: string };
  }[];
};
const BlogCardList = ({ posts }: Props) => {
 
  const windowSize = useDimensions();
  return ( 
      
      <div className="w-full h-full relative overflow-auto border rounded-md border-lightMainColor dark:border-darkMainColor">
        {/* <h1 className="">Recent Posts</h1> */}
        <div className={` absolute top-0 left-0`}>
          {posts.length > 0 &&
            posts?.map(
              (item) => (
                <div key={item.id} className="flex flex-col justify-start items-start">
                  <div className="flex flex-row justify-around items-center">
                    <ImgFromDb
                      url={item.user.image}
                      stylings="h-12 w-12 float-left m-2 rounded-md"
                      alt="Author Picture"
                    />
                    <div className="flex flex-col ">
                      <span>{item.user.name}</span>
                      <span>
                        {new Date(item.createdAt).toLocaleDateString('en-us', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row justify-around items-center">
                  {item.img && (windowSize.height!>500)  && (windowSize.width!>500) && ( 
                      <ImgFromDb
                        url={item.img}
                        stylings="h-auto w-72 float-left m-2 rounded-md"
                        alt="Post Picture"
                      /> 
                  )}
                  <div className="">
                    <div className="">
                      Category: <span className="">{item.catSlug}</span>
                    </div>
                    <Link href={`/posts/${item.slug}`}>
                      <h1 className="text-4xl italic font-semibold text-red-600">Title:{item.title}</h1>
                    </Link>
                    
                    <div
                      className="w-full  "
                      dangerouslySetInnerHTML={{
                        __html: item?.desc.substring(0, 60),
                      }}
                    />
                    <p>Views: {item.views}</p>
                    <Link href={`/posts/${item.slug}`} className="">
                      Read More
                    </Link>

                  </div>
                  </div>
                </div>
              )
            )}
        
      </div>
 
    </div>
  );
};

export default BlogCardList;
