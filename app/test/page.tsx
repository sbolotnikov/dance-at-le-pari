'use client';
import { FC, useState } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import { PageWrapper } from '../../components/page-wrapper';
import ReceiptModal from '@/components/ReceiptModal';
import { DragDropListScrollable } from '@/components/DragDropListScrollable';
import DraggableList from '@/components/DraggableList';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const [img, setImage] = useState('');
  const [visibleModal, setVisibleModal] = useState(false);
  const [items, setItems] = useState([
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
    { id: '4', name: 'Item 4' },
    { id: '5', name: 'Item 5' },
    { id: '6', name: 'Item 6' },
    { id: '7', name: 'Item 7' },
    { id: '8', name: 'Item 8' },
    { id: '9', name: 'Item 9' },
    { id: '10', name: 'Item 10' },
    { id: '11', name: 'Item 11' },
    { id: '12', name: 'Item 12' },
    { id: '13', name: 'Item 13' },
    { id: '14', name: 'Item 14' },
    { id: '15', name: 'Item 15' },
    { id: '16', name: 'Item 16' },
    { id: '17', name: 'Item 17' },
    { id: '18', name: 'Item 18' },
    { id: '19', name: 'Item 19' },
    { id: '20', name: 'Item 20' },
    { id: '21', name: 'Item 21' },
    { id: '22', name: 'Item 22' },
    { id: '23', name: 'Item 23' },
    { id: '24', name: 'Item 24' },
    { id: '25', name: 'Item 25' },
    { id: '26', name: 'Item 26' },
    { id: '27', name: 'Item 27' },
  ]);
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {visibleModal && (
        <ReceiptModal
          invoice={'zdxfcghjkl'}
          visibility={visibleModal}
          onReturn={(loadStatus, finished) => {
            console.log('call');
            loadStatus ? setLoading(true) : setLoading(false);
            if (finished) {
              setVisibleModal(false);
            }
          }}
        />
      )}
      {loading && <LoadingScreen />}
      <div
        className="blurFilter border-0 rounded-md p-4  shadow-2xl w-[90%] max-h-[760px]  max-w-[450px] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70"
        // style={{ boxShadow: '0 0 150px rgb(113, 113, 109 / 50%),inset 0 0 20px #242422' }}
      >
        <h2
          className="text-center font-bold uppercase"
          style={{ letterSpacing: '1px' }}
        >
          Test
        </h2> 
          {/* <DragDropListScrollable
            items={items}
            onItemsChange={setItems}
            renderItem={(item) => (
              <div className="p-4 border-b bg-white">{item.name}</div>
            )}
          /> */}
          <DraggableList
            initialItems={items.map((item) => item.name)}
            addItems={items.map((item) => item.name)}
            onListChange={(newItems: string[]) => {
              setItems(
                newItems.map((item, index) => ({
                  id: index.toString(),
                  name: item,
                }))
              );
            }}
            containerClassName={'h-[660px]  w-full '}
            itemHeight={48}
            autoScrollSpeed={15}
          /> 
      </div>
    </PageWrapper>
  );
};

export default page;
