import Link from 'next/link';
import ImgFromDb from './ImgFromDb';
import { useDimensions } from '@/hooks/useDimensions';
import ShowIcon from './svg/showIcon';
import { TBlogPost } from '@/types/screen-settings';

type Props = {
  posts:TBlogPost[];
  user:{role:string; id:number}
  category:string;
  onReturn:(val1:string, val2:string)=>void;
};
const BlogCardList = ({ posts,user,category, onReturn }: Props) => {
 
  const windowSize = useDimensions();
  return ( 
      
      <div className="w-full h-full relative overflow-auto border rounded-md border-lightMainColor dark:border-darkMainColor">
        {/* <h1 className="">Recent Posts</h1> */}
        <div className={` absolute top-0 left-0 w-full`}>
          {posts.length > 0 &&
            posts?.map(
              (item) => (
                <div key={item.id} className="flex flex-col justify-start items-start relative w-full border-b-2 border-dashed border-lightMainColor/50 dark:border-darkMainColor/50">
                  <Link href={`/posts/${item.slug}`} className="">
                  <div className="w-full flex flex-row justify-start items-center">
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
                  {((user.role == 'Admin') ||(user.id == item.userID)) && (
                    <button
                      className=" outline-none border-none fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor mt-2  w-8 h-8 absolute top-5 right-0"
                      onClick={(e) => {
                        e.preventDefault();
                        onReturn(item.id, "Delete");                 
                      }}
                    >
                      <ShowIcon icon={'Close'} stroke={'2'} />
                    </button>
                  )}
                  {((user.role == 'Admin') ||(user.id == item.userID)) && (
                    <button
                      className=" outline-none border-none fill-editcolor  stroke-editcolor  rounded-md border-editcolor p-1 w-10 h-10 absolute top-5 right-8"
                      onClick={(e) => {
                        e.preventDefault();
                        onReturn(item.id, "Edit");  
                        return;
                      }}
                    >
                      <ShowIcon icon={'Edit'} stroke={'.5'} />
                    </button>
                  )}
                  <div className="flex flex-col md:flex-row justify-around items-center">
                  {item.img && (windowSize.height!>500)  && (windowSize.width!>500) && ( 
                      <ImgFromDb
                        url={item.img}
                        stylings="h-auto w-72 float-left m-2 rounded-md"
                        alt="Post Picture"
                      /> 
                  )}
                  <div className="">
                    {category=="0" &&<div className="">
                      Category: <span className="">{item.catSlug}</span>
                    </div> }
                      <h1 className="text-4xl italic font-semibold text-red-600">{item.title}</h1>                    
                    <div
                      className="w-full  "
                      dangerouslySetInnerHTML={{
                        __html: item?.desc.substring(0, 120)+'...',
                      }}
                    />      
                    
                      Read More
                    
                    <p className="text-lg font-semibold text-alertcolor">Keywords: {item.keywords}</p>
                    <p>Views: {item.views}</p>
                  </div>
                  </div>
                  </Link>
                </div>
              )
            )}
        
      </div>
 
    </div>
  );
};

export default BlogCardList;
