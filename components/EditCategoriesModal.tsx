import { useState } from 'react';
import AnimateModalLayout from './AnimateModalLayout';
import ShowIcon from './svg/showIcon';

type Props = {
  visibility: boolean;
  categories: {id:string, slug: string; title: string }[];
  onReturn: () => void;
};

export default function EditCategoriesModal({
  visibility,
  categories,
  onReturn,
}: Props) {
  const [cats, setCats] = useState< {slug: string; title: string }[]>(categories.map((cat) => ({slug:cat.title, title:cat.slug})));
  return (
    <AnimateModalLayout
      visibility={visibility}
      onReturn={() => {
        onReturn();
      }}
    >
      <div
        className={`border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[900px]  flex justify-center items-center flex-col   md:w-[80svw] bg-lightMainBG dark:bg-darkMainBG backdrop-blur-md  h-[70svh] md:h-[85svh]
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
            {cats.map((item, index) => (
              <div
                key={index}
                className="flex flex-row justify-center items-center relative w-full"
              >
                <div className="flex flex-col justify-start items-start relative">
                  <h2 className="w-full text-center font-semibold">
                    Caterogy #{index + 1}
                  </h2>
                  <label className="flex flex-row items-center">
                    {' '}
                    Category Title{' '}
                    <input
                      type="text"
                      value={item.title}
                      className="dark:bg-lightMainBG bg-darkMainBG dark:text-lightMainColor text-darkMainColor w-full p-1 rounded-md"
                      onChange={(e) => {
                        let temp = cats;
                        temp[index].title = e.target.value;
                        setCats(temp);
                      }}
                    />
                  </label>
                  <label className="flex flex-row items-center">
                    {' '}
                    Category Slug{' '}
                    <input
                      type="text"
                      value={item.slug}
                      className="dark:bg-lightMainBG bg-darkMainBG dark:text-lightMainColor text-darkMainColor w-full p-1 rounded-md"
                      onChange={(e) => {
                        let temp = cats;
                        temp[index].slug = e.target.value;
                        setCats(temp);
                      }}
                    />
                  </label>
                </div>
                <button
              className="shadow-lg pointer outline-none border-none fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor p-1 w-10 h-10"
              onClick={(e) => {
                e.preventDefault();
                let temp = cats; 
                temp.splice(index, 1);
                setCats([...temp]);
              }}
            >
              <ShowIcon icon={'Close'} stroke={'2'} />
            </button>
              </div>
            ))}
            <button
              className="shadow-lg pointer border-0 outline-none rounded"
              onClick={(e) => {
                e.preventDefault();
                let temp = cats;
                temp.push({ title: '', slug: '' });
                setCats([...temp]);
              }}
              style={{ padding: '5px 5px', margin: '5px 5px' }}
            >
              Add a new category
            </button>
          </div>
        </div>
      </div>
    </AnimateModalLayout>
  );
}
