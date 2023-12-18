import { useState } from 'react';

type Props = {
  startValue: number;
  setWidth: number;
  onChange: (n:number) => void;
}

const InputBox = ({startValue, setWidth,onChange}: Props) => {
  const [number, onChangeNumber] = useState(startValue);
  const changeNumber=(e: React.SyntheticEvent<EventTarget>,isAdd:boolean)=>{
      e.preventDefault();
      let increment=isAdd?1:-1;
      if((number==0)&&(!isAdd)) increment=0
      onChangeNumber(number+increment)
      onChange(number+increment)
  }
  return (
    <div className='flex flex-row justify-center items-center ml-2'>
<div className='rounded-full bg-[#3D1152] mr-2' onClick={(e)=>changeNumber(e,false)}>
    <h2 className=' font-extrabold text-white text-xl px-3 mb-1'>-</h2>
</div>
        <input className={` h-8 w-${setWidth} justify-center items-center`} onChange={()=>onChangeNumber}
        value={number}/>
        <div className='rounded-full bg-[#3D1152] ml-2' onClick={(e)=>changeNumber(e,true)}>
    <h2 className='font-extrabold text-white text-xl px-2 mb-1'>+</h2>
</div>
    </div>
  )
}
export default InputBox