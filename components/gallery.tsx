// import Image from 'next/image';
import { useEffect, useState } from 'react';
import { gsap } from '../utils/gsap';
import ShowIcon from './svg/showIcon';
import { TPicturesArray } from '@/types/screen-settings';
import sleep from '@/utils/functions';

type Props = {
  pictures: TPicturesArray;
  auto: boolean;
  seconds: number;
  width: string;
  height:string;
  particles?:boolean;
};


const Gallery = ({ pictures, auto,particles, seconds, width, height }: Props) => {
 
  class Particle {
    x: number;
    y: number;
    originX: number;
    originY: number;
    color: string;
    size:number;
    vx:number;
    vy:number;
    ease:number;
    effect:Effect;
    constructor (effect:Effect,x:number,y:number, color:string){
      this.effect =effect;
      this.x = Math.random() * this.effect.width * 5*((Math.random()<0.5)?1:-1);
      this.y = Math.random() * this.effect.height * 5*((Math.random()<0.5)?1:-1);
      // this.x = Math.floor(x);
      // this.y = Math.floor(y);
      this.originX = Math.floor(x);
      this.originY = Math.floor(y);
      // this.originX =  Math.random() * this.effect.width * 5;
      // this.originY =   Math.random() * this.effect.height * 5; 
      this.color = color;
      this.size = this.effect.gap;
      this.vx = 0;
      this.vy = 0;
      this.ease = 0.25;
    }
  draw(context: CanvasRenderingContext2D ){
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.size, this.size);
  }
  update(){
    this.x += (this.originX - this.x) * this.ease;
    this.y += (this.originY -this.y) * this.ease;
  }
  }
  class Effect {
    width:number;
    height: number;
    centerX:number;
    centerY:number;
    x:number;
    y:number;
    gap:number;
    particlesArray:Particle[];
    image:HTMLImageElement;
  
    constructor(width:number, height:number, img_source:string){
      this.width = width;
      this.height = height;
      this.particlesArray =[];
      this.image = new Image();
      this.image.src = img_source;
      // this.image = document.getElementById('image0');
      this.centerX = this.width * 0.5;
      this.centerY = this.height * 0.5;
      this.x = this.centerX - this.image!.width * 0.5;
      this.y = this.centerY - this.image!.height *0.5;
      this.gap = 3;
    }
    init(context:CanvasRenderingContext2D ){
      context.drawImage(this.image, this.x, this.y) 
      const pixels = context.getImageData(0, 0, this.width, this.height).data;
      for (let y = 0; y < this.height; y += this.gap){
        for (let x = 0; x < this.width; x += this.gap){
          const index1 = (y*this.width + x) * 4;
          const red = pixels[index1];
          const green = pixels[index1 + 1];
          const blue = pixels[index1 + 2];
          const alpha = pixels[index1 + 3];
          const color = 'rgb(' + red + ',' + green + ',' + blue +')';
          if (alpha > 0) {
            this.particlesArray.push(new Particle(this, x, y, color));
          }
        }
      }
    }
    draw(context:CanvasRenderingContext2D ){
      this.particlesArray.forEach(particle => particle.draw(context));
    }
    update(){
      this.particlesArray.forEach(particle => particle.update());
    }
  } 
  const [firstTime, setFirstTime] = useState(true);
  const [activePic, setActivePic] = useState(0);
  const [nextActivePic, setNextActivePic] = useState(0);
  const nextActive=(num:number)=>{
    let timerInterval = setInterval(function () {
        clearInterval(timerInterval);
        let localPic=num;
    if (localPic < pictures.length - 1) localPic++
          else localPic=0;
          setNextActivePic(localPic) 
          
          nextActive(localPic)      

        }, seconds*1000);
  }
  
  useEffect(() => { 
    if (auto)  nextActive(0)

  }, []);
  let counter=0
  const particlesFunc=()=>{
    const canvas = document.getElementById('canvas1') as HTMLCanvasElement
    let el1 = document.getElementById('particleBGImg');
    const container = document.getElementById('galleryContainer');
    const ctx = canvas.getContext('2d');
    el1!.style.opacity="0";
    console.log("got canva's context")
    function animate(){
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      effect.draw(ctx!);
      effect.update();
      counter++;
      if (counter<40) requestAnimationFrame(animate)
      else { counter=0}
    }
    canvas.width = container!.offsetWidth; 
    canvas.height = container!.offsetHeight; 
    
    
    // gsap.timeline().fromTo(el1, { attr:{opacity: 0}},{ attr:{opacity: 1}, duration: seconds*.05} );
    const effect = new Effect(canvas!.width, canvas!.height, pictures[nextActivePic].urlData );
    effect.init(ctx!);
    animate(); 
    setActivePic(nextActivePic);
    sleep(seconds*500).then(() => {
     
      el1!.style.opacity="1"
  })
  }
  useEffect(() => {
    if((!particles)&&(!firstTime)) {
      let el = document.getElementById('turbulence');
      let imgEl = document.getElementById(`image${activePic}`);
      if (imgEl) {
        imgEl.style.filter = 'url(#noise)';
        imgEl.style.opacity = '1';
      }
      let textEl = document.getElementById(`text_${activePic}`);
      let imgEl1 = document.getElementById(`image${nextActivePic}`);
      let textEl1 = document.getElementById(`text_${nextActivePic}`);
      gsap
        .timeline()
        .fromTo(
          el,
          { attr: { baseFrequency: '0' } },
          { attr: { baseFrequency: '0.1' }, duration: seconds }
        );

      gsap.timeline().to(imgEl, { opacity: 0, duration: seconds*.8, stagger: seconds*.2 });
      gsap.timeline().to(textEl, { opacity: 0, duration: seconds*.8, stagger: seconds*.2 });
      gsap.timeline().to(textEl1, { opacity: 1, duration: seconds*.8, stagger: seconds*.6 });
      gsap
        .timeline()
        .to(imgEl1, { opacity: 1, duration: seconds*.8, stagger: seconds*.6 })
        .then(() => {
          if (imgEl) imgEl.style.filter = '';
          setActivePic(nextActivePic);
        });
    } else setFirstTime(false);





  }, [nextActivePic]);
  return (
    <div id="galleryContainer" className={` relative  h-[${height}] w-[${width}] rounded-md overflow-hidden flex justify-between items-center `} style={{zIndex:300}}>
       
      <button
        id="prevButton"
        className={` absolute top-1/2 left-0 cursor-pointer z-10 hover:scale-125 ${
          auto ? 'hidden' : ''}`} style={{transform: 'translate(0%, -50%)'}}
        onClick={() => {
          if (activePic > 0) setNextActivePic(activePic - 1);
          else setNextActivePic(pictures.length - 1);
        }}
      >
                <div className="ml-1 h-8 w-8 md:h-16 md:w-16  fill-darkMainColor stroke-darkMainColor">
          <ShowIcon icon={'ArrowLeft'} stroke={'.1'} />
        </div>
      </button>
      <canvas id ="canvas1" className='m-auto ' style={{objectFit: "contain"}}></canvas>
      {(particles==true) &&
          <img id="particleBGImg"
            src={pictures[nextActivePic].urlData} 
            style={{objectFit: "contain"}}
            className="absolute inset-0 m-auto opacity-0"
            onLoad={() => {console.log('image loaded'); particlesFunc()}}
          />}
          {(particles==true) &&<h2
            className={`w-full mb-12 text-center absolute bottom-0 right-0 z-100 bg-lightMainBG/70 dark:bg-darkMainBG/70 `}
          >
            {pictures[nextActivePic].capture}
          </h2>}
      

      {(particles!==true) && pictures.map((item, index) => (
        <div key={'img' + index}>
          <img
            id={'image' + index}
            src={item.urlData}
            alt={item.urlData}
            
            style={{objectFit: "contain"}}
            className={`absolute inset-0 m-auto ${
              index !== activePic ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <h2
            id={'text_' + index}
            className={`w-full mb-12 text-center absolute bottom-0 right-0 z-100 bg-lightMainBG/70 dark:bg-darkMainBG/70 ${
              index !== activePic ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {item.capture}
          </h2>
        </div>
      ))}
      <button
        id="nextButton"
        className={` absolute top-1/2 right-0 cursor-pointer z-10 hover:scale-125 ${
          auto ? 'hidden' : ''}`} style={{transform: 'translate(0%, -50%)'}}
        onClick={() => {
          if (activePic < pictures.length - 1) setNextActivePic(activePic + 1);
          else  setNextActivePic(0);
        }}
      >
        <div className="mr-2 h-8 w-8 md:h-16 md:w-16  fill-darkMainColor stroke-darkMainColor">
          <ShowIcon icon={'ArrowRight'} stroke={'.1'} />
        </div>
      </button>
      <svg className="absolute inset-0 h-full w-full">
        <filter id="noise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            result="NOISE"
            baseFrequency="0"
            numOctaves="5"
            seed="2"
            id="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="NOISE"
            scale="20"
          ></feDisplacementMap>
        </filter>
      </svg>
    </div>
  );
};

export default Gallery;
