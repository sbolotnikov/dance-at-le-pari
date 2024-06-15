import { useState } from 'react';
import AnimateModalLayout from './AnimateModalLayout';
import ShowIcon from './svg/showIcon';
import { slugify } from '@/utils/functions';
import { useRouter } from 'next/navigation';

type Props = {
  visibility: boolean;
  categories: { id: string; slug: string; title: string }[];
  onReturn: () => void;
};

export default function EditCategoriesModal({
  visibility,
  categories,
  onReturn,
}: Props) {
    const router = useRouter(); 
  const [selectedSlug, setSelectedSlug] = useState(categories[0].slug);
  const [selectedTitle, setSelectedTitle] = useState(categories[0].title);
  const [selectedCategory, setSelectedCategory] = useState(0);
  return (
    <AnimateModalLayout
      visibility={visibility}
      onReturn={() => {
        onReturn();
      }}
    >
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[900px]  flex justify-center items-center flex-col   md:w-[80svw] bg-lightMainBG dark:bg-darkMainBG h-[70svh] md:h-[85svh]
      }`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative  p-1  overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
        >
          <div
            id="containedDiv"
            className={`absolute top-0 left-0 flex flex-col w-full p-1 justify-center items-center`}
          >
            <h2
              className="text-center font-semibold md:text-4xl uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Edit Categories Modal
            </h2>
            <label className="flex flex-row items-center w-full justify-around">
              {' '}
              Category to edit{' '}
              <select
                className="dark:bg-lightMainBG bg-darkMainBG dark:text-lightMainColor text-darkMainColor rounded-md outline-none"
                onChange={(e) => {
                  setSelectedCategory(parseInt(e.target.value));
                  setSelectedTitle(categories[parseInt(e.target.value)].title);
                  setSelectedSlug(categories[parseInt(e.target.value)].slug);
                }}
              >
                {categories.map((category, i) => (
                  <option key={category.slug} value={i}>
                    {category.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-row justify-center items-center relative w-full">
              <div className="flex flex-col justify-start items-start relative">
                <label className="flex flex-row items-center">
                  {' '}
                  Category Title{' '}
                  <input
                    type="text"
                    value={selectedTitle}
                    className="dark:bg-lightMainBG bg-darkMainBG dark:text-lightMainColor text-darkMainColor w-full p-1 rounded-md"
                    onChange={(e) => {
                      setSelectedTitle(e.target.value);
                    }}
                  />
                </label>
                <label className="flex flex-row items-center">
                  {' '}
                  Category Slug{' '}
                  <input
                    type="text"
                    value={selectedSlug}
                    className="dark:bg-lightMainBG bg-darkMainBG dark:text-lightMainColor text-darkMainColor w-full p-1 rounded-md"
                    onChange={(e) => {
                      setSelectedSlug(e.target.value);
                    }}
                  />
                </label>
              </div>
              <div className="flex flex-col justify-between items-center m-1">
                {(selectedSlug !== categories[selectedCategory].slug ||
                  selectedTitle !== categories[selectedCategory].title) && (
                  <button
                    className="shadow-lg pointer outline-none border-none  rounded-md  p-1 w-10 h-10"
                    onClick={async (e) => {
                      e.preventDefault();
                      const res = await fetch('/api/categories', {
                        method: 'PUT',
                        body: JSON.stringify({
                          id: categories[selectedCategory].id, 
                          title: selectedTitle,
                          slug: slugify(selectedSlug),
                        }),
                      });
                  
                      if (res.status === 200) {
                        const data = await res.json();
                        router.push('/blog/0?edit=1');
                        router.refresh()
                      }
                    }}
                  >
                    <ShowIcon icon={'Save'} stroke={'2'} />
                  </button>
                )}
                <button
                  className="shadow-lg pointer outline-none border-none fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor p-1 w-10 h-10"
                  onClick={async(e) => {
                    e.preventDefault(); 
                    fetch('/api/admin/categories/del', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          id:  categories[selectedCategory].id,
                        }),
                      }).then((res) => {
                       router.push('/blog/0?edit=1');
                       router.refresh()
                      });
                  }}
                >
                  <ShowIcon icon={'Close'} stroke={'2'} />
                </button>
              </div>
            </div>

            <button
              className="shadow-lg pointer border-0 outline-none rounded"
              onClick={async(e) => {
                e.preventDefault();
                const res = await fetch('/api/categories', {
                    method: 'POST',
                    body: JSON.stringify({
                      title: selectedTitle,
                      slug: slugify(selectedSlug),
                    }),
                  });
              
                  if (res.status === 200) {
                    const data = await res.json();
                    router.push('/blog/0?edit=1');
                    router.refresh()
                  }
              }}
              style={{ padding: '5px 5px', margin: '5px 5px' }}
            >
              Add as a new category
            </button>
          </div>
        </div>
      </div>
    </AnimateModalLayout>
  );
}
