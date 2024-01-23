import { useState } from 'react'
import Gallery from './gallery';
import {galeryPictures} from '../utils/galeryPictures';
import AnimateModalLayout from './AnimateModalLayout';

type Props = {
    pictures: string[];
    onReturn: () => void
}

const FullScreenGalleryView = ({pictures, onReturn}: Props) => {
    const [isVisible, setIsVisible] = useState(true);
    let el = document.querySelector('#mainPage');
  return (
    
    <AnimateModalLayout visibility={isVisible} onReturn={()=>{onReturn(); }} >
          
      <Gallery
        pictures={galeryPictures}
        auto={false}
        seconds={5}
        width={'100vw'}
        height={'100vh'}
        particles
      />
     </AnimateModalLayout> 
  
  )
}

export default FullScreenGalleryView