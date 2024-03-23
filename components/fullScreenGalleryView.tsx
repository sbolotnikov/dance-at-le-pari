'use client';
import Gallery from './gallery';
import { galeryPictures } from '../utils/galeryPictures';
import AnimateModalLayout from './AnimateModalLayout';
import { TPictureWithCapture } from '@/types/screen-settings';

type Props = {
  pictures: TPictureWithCapture[] | null;
  index?: number | undefined;
  onReturn: () => void;
};

const FullScreenGalleryView = async (props: Props) => {
  
  return (
    <AnimateModalLayout
      visibility={true}
      onReturn={() => {
        props.onReturn();
      }}
    >
      {(props.index != undefined) ? (
        <Gallery
          pictures={ props.pictures! }
          auto={false}
          seconds={5}
          width={'100vw'}
          height={'100svh'}
          particles
        />
      ) : (
        <Gallery
          pictures={galeryPictures}
          auto={false}
          seconds={5}
          width={'100vw'}
          height={'100svh'}
          particles
        />
      )}
    </AnimateModalLayout>
  );
};

export default FullScreenGalleryView;
