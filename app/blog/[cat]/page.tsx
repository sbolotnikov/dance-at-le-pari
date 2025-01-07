'use client';
import { use, useEffect, useState } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import ShowIcon from '@/components/svg/showIcon';
import { useDimensions } from '@/hooks/useDimensions';
import BlogCardList from '@/components/BlogCardList';
// import Pagination from '@/components/Pagination';
import { useSession } from 'next-auth/react';
import CreatePostModal from '@/components/CreatePostModal';
import AlertMenu from '@/components/alertMenu';
import LoadingScreen from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import { TBlogPost } from '@/types/screen-settings';
import EditCategoriesModal from '@/components/EditCategoriesModal';
import sleep from '@/utils/functions';
import SharePostModal from '@/components/SharePostModal';
interface pageProps {}

export default function Page(params: {
  params: { cat: string; page: string };
}) {
  console.log(params);
  const [postsCount, setPostsCount] = useState(0);
  const [revealModal, setRevealModal] = useState(false);
  const [revealModal1, setRevealModal1] = useState(false);
  const [revealAlert, setRevealAlert] = useState(false);
  const [revealSharingModal, setRevealSharingModal] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [categories, setCategories] = useState<{id:string,slug: string,title: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [alertStyle, setAlertStyle] = useState({
    variantHead: '',
    heading: '',
    text: ``,
    color1: '',
    button1: '',
    color2: '',
    button2: '',
    inputField: '',
  });
 
  const { data: session } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<TBlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<TBlogPost|null>(null);
  const windowSize = useDimensions();
  useEffect(() => {
     (windowSize.height!<700)? document.getElementById('icon')!.style.setProperty('display', `none`): document.getElementById('icon')!.style.setProperty('display', `block`);
    
  },[windowSize.height,document]);
  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/posts?cat=${params.params.cat !== '0' ? params.params.cat : ''}`,
      {
        cache: 'no-store',
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPosts(data.posts.sort((a:any, b:any) => (a.createdAt < b.createdAt ? 1 : b.createdAt < a.createdAt ? -1 : 0)));        
        setPostsCount(data.count);
        fetch(
          `/api/categories`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setCategories(data.categories.sort((a:any, b:any) => (a.title < b.title ? 1 : b.title < a.title ? -1 : 0)));        
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

  }, []);
  const onReturnAlert = async (decision1: string) => {
    setRevealAlert(false);
    if (decision1 == 'Cancel') {
    }
    if (decision1 == 'Delete') {
      setLoading(true);
      fetch('/api/post_del', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id:  selectedId,
        }),
      }).then((res) => { 
        window.location.reload();

      });
    }
  };

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center md:items-end justify-center ">
      {categories.length>0 &&<SharePostModal
        title={`${(params.params.cat!='0')?categories.filter((item)=>item.slug==params.params.cat)[0].title:"All"} Categor${(params.params.cat!='0')?'y':"ies"} of Blog | Dance at Le Pari Studio`}
        url={process.env.NEXT_PUBLIC_URL + '/blog/' + params.params.cat}
        quote={`Description: This is a blog about dancing and everything that connects to dancing. Tips, tricks, additional information, experts info on dancing experience and knowledge. \n Click on the link below. \n`}
        hashtag={" DanceAtLePariBlog  DanceBlog  LePariDanceCenterBlog  DanceAtLePari"}
          onReturn={() => setRevealSharingModal(false)}
          visibility={revealSharingModal}
          
        />}
      {revealModal && (
        <CreatePostModal
          visibility={revealModal}
          post={selectedPost}
          categories={categories}
          onReturn={() => {
            sleep(1200).then(() => {
            setRevealModal(false);
            });
          }}
        />
      )}
      {revealModal1 && (
        <EditCategoriesModal
          visibility={revealModal1}
          categories={categories}
          onReturn={() => {
            sleep(1200).then(() => {
              setRevealModal1(false);
            });
          }}
        />
      )
    }
      <AlertMenu visibility={revealAlert}  onReturn={onReturnAlert} styling={alertStyle} />
      {loading && <LoadingScreen />}
      <div className="blurFilter border-0 rounded-md p-2 mt-6 shadow-2xl w-[95%] h-[70svh] md:h-[85svh] max-w-5xl md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 md:mb-3">
        <div className="border rounded-md border-lightMainColor dark:border-darkMainColor w-full h-full   p-2 flex flex-col justify-start items-center relative">
          <h2
            className="text-center font-semibold md:text-4xl uppercase"
            style={{ letterSpacing: '1px' }}
          >
            {params.params.cat !== '0' ? params.params.cat + ' ' : ''}Blog
          </h2>
          <div
            id="icon"
            className=" h-20 w-20 md:h-28 md:w-28 fill-lightMainColor stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor m-auto"
          >
            <ShowIcon icon={'Blog'} stroke={'0.1'} />
          </div>
          <button
            aria-label='Share this blog category page'
            className=" outline-none border-none absolute right-1 top-1  rounded-md  mt-2  w-8 h-8"
            onClick={(e) => {
              e.preventDefault();
              setRevealSharingModal(!revealSharingModal);
              return;
            }}
          >
            <ShowIcon icon={'Share'} stroke={'2'} />
          </button>
          {(session?.user.role === 'Admin' ||
            session?.user.role === 'Teacher') && (
            <div className="group flex  cursor-pointer  flex-col justify-center items-center absolute right-10 top-1 md:top-8">
              <div className="  h-10 w-10 md:h-14 md:w-14 relative hover:scale-110 group-hover:animate-bounce stroke-lightMainColor dark:stroke-darkMainColor ">
                <div
                  className="cursor-pointer h-10 w-10 md:h-14 md:w-14 border-2 rounded-full  bg-editcolor m-auto "
                  onClick={(e) => {
                    e.preventDefault();
                    setRevealModal(true);
                  }}
                >
                  <ShowIcon icon={'Plus'} stroke={'0.1'} />
                </div>
              </div>
              <p className="hidden tracking-widest mx-3 transition duration-300 ease-in-out absolute -right-4 -bottom-1.5 md:-bottom-4 rounded-md text-center text-editcolor text-[6px] md:text-base md:dark:bg-lightMainBG    opacity-100 group-hover:inline-flex md:block md:opacity-0 md:group-hover:opacity-100 ">
                Add.Post
              </p>
            </div>
          )}
          <div className="flex flex-row justify-center items-center w-full">
          <label className="flex flex-col items-center text-lightMainColor dark:text-darkMainColor">
              {' '}
              Blog Category
              <select
                className="dark:bg-lightMainBG bg-darkMainBG dark:text-lightMainColor text-darkMainColor rounded-md outline-none"
                onChange={(e) => router.push(`/blog/${e.target.value}`)}
                value={ params.params.cat }
              >
                <option value="0">All</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.title}
                  </option>
                ))}
              </select>
              total posts : {postsCount}
            </label>
            {session?.user.role=='Admin'&&<button
            className="shadow-lg pointer border-0 outline-none rounded"
            onClick={(e) => {
               e.preventDefault();
               setRevealModal1(true);
            }}
            style={{ padding: '5px 5px', margin: '5px 5px' }}
          >
            Edit
          </button>}
          </div>
          <BlogCardList
            posts={posts}
            category={params.params.cat}
            user={{
              role: session?.user.role ? session?.user.role : '',
              id: session?.user.id ? session?.user.id : 0,
            }}
            onReturn={(idText: string, action:string) => {
              setSelectedId(idText);
              if(action == 'Delete'){
                setAlertStyle({
                  variantHead: 'danger',
                  heading: 'Warning',
                  text: 'You are about to Delete Event!',
                  color1: 'danger',
                  button1: 'Delete',
                  color2: 'secondary',
                  button2: 'Cancel',
                  inputField: '',
                });
                setRevealAlert(!revealAlert);
              }else if(action == 'Edit'){
                let post1 = posts.find((post) => post.id == idText);
                setSelectedPost(post1? post1 : null);
                setRevealModal(true);
              }
              
               
            }}
          />
          {/* <Menu /> */}
        </div>
      </div>
    </PageWrapper>
  );
}
