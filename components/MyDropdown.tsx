import { Fragment, useState } from 'react';
type Props = {
    dances: string[];
  onChoice: (dance: number) => void;
}
function MyDropdown({dances, onChoice}:Props) {
    const [dropdownValue, setDropdownValue] = useState('');
  return (
    <>
         <select className=" m-2 w-72 h-12 cursor-pointer text-xl  font-DancingScript border-0 outline-0 shadow-xl py-3 px-5 rounded-lg" value={dropdownValue} onChange={(e)=>{
        e.preventDefault();
        setDropdownValue(e.target.value);
        onChoice(parseInt(e.target.value));
    }} >
         {dances &&
            dances.map((item, index) => {
                return (
                  <option key={'option_' + index} value={index} >
                    {item}
                  </option>
                );
              })}
              
          </select>
      
      </>
  );
}
export default MyDropdown;