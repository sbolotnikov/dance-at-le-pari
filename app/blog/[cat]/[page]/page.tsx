'use client';
import { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import ShowIcon from '@/components/svg/showIcon';
import { useDimensions } from '@/hooks/useDimensions';
import BlogCardList from '@/components/BlogCardList';
import Pagination from '@/components/Pagination';
import { useSession } from 'next-auth/react';
import CreatePostModal from '@/components/CreatePostModal';
import AlertMenu from '@/components/alertMenu';
import LoadingScreen from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import { TBlogPost } from '@/types/screen-settings';
interface pageProps {}

export default function Page(params: {
  params: { cat: string; page: string };
}) {
  console.log(params);
  const [pageCount, setPageCount] = useState(0);
  const POST_PER_PAGE = 2;
  const [hasNext, setHasNext] = useState(false);
  const [revealModal, setRevealModal] = useState(false);
  const [revealAlert, setRevealAlert] = useState(false);
  const [selectedId, setSelectedId] = useState('');
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

  const hasPrev = POST_PER_PAGE * (parseInt(params.params.page) - 1) > 0;
  const { data: session } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<TBlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<TBlogPost|null>(null);
  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/posts?page=${params.params.page}&cat=${
        params.params.cat !== '0' ? params.params.cat : ''
      }`,
      {
        cache: 'no-store',
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPosts(data.posts);
        setHasNext(
          POST_PER_PAGE * (parseInt(params.params.page) - 1) + POST_PER_PAGE <
            data.count
        );
        setPageCount(Math.ceil(data.count / POST_PER_PAGE));
        setLoading(false);
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
       router.push('/blog/0/1');

      });
    }
  };

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center ">
      {revealModal && (
        <CreatePostModal
          visibility={revealModal}
          post={selectedPost}
          onReturn={() => {
            setRevealModal(false);
          }}
        />
      )}
      <AlertMenu visibility={revealAlert}  onReturn={onReturnAlert} styling={alertStyle} />
      {loading && <LoadingScreen />}
      <div className="border-0 rounded-md p-2 mt-6 shadow-2xl w-[95%] h-[70svh] md:h-[85svh] max-w-5xl md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md">
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
          {(session?.user.role === 'Admin' ||
            session?.user.role === 'Teacher') && (
            <div className="group flex  cursor-pointer  flex-col justify-center items-center absolute left-0 top-8 md:top-8">
              <div className="  h-6 w-6 md:h-10 md:w-10 relative hover:scale-110 group-hover:animate-bounce stroke-lightMainColor dark:stroke-darkMainColor ">
                <div
                  className="cursor-pointer h-6 w-6 md:h-10 md:w-10 border-2 rounded-md  bg-editcolor m-auto "
                  onClick={(e) => {
                    e.preventDefault();
                    setRevealModal(true);
                  }}
                >
                  <ShowIcon icon={'Plus'} stroke={'0.1'} />
                </div>
              </div>
              <p className="hidden tracking-widest mx-3 transition duration-300 ease-in-out absolute -right-4 -bottom-1.5 md:-bottom-4 rounded-md text-center text-editcolor text-[6px] md:text-base md:dark:bg-lightMainBG    opacity-100 group-hover:inline-flex md:block md:opacity-0 md:group-hover:opacity-100 ">
                Add_Post
              </p>
            </div>
          )}
          <Pagination
            cat={params.params.cat}
            page={parseInt(params.params.page)}
            hasPrev={hasPrev}
            hasNext={hasNext}
            pageCount={pageCount}
          />
          <BlogCardList
            posts={posts}
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
