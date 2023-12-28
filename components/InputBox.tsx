import { useState } from 'react';

type Props = {
  startValue: number;
  setWidth: number;
  increment: number;
  onChange: (n: number) => void;
};

const InputBox = ({ startValue, setWidth, increment, onChange }: Props) => {
  const [number1, onChangeNumber] = useState(startValue);
  const changeNumber = (
    e: React.SyntheticEvent<EventTarget>,
    isAdd: boolean
  ) => {
    e.preventDefault();
    let increment1 = isAdd ? increment : -1 * increment;
    if (number1 == 0 && !isAdd) increment1 = 0;
    onChangeNumber(number1 + increment1);
    onChange(number1 + increment1);
  };
  return (
    <div className="flex flex-row justify-center items-center ml-2">
      <div
        className="rounded-full bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor dark:border-2 dark:border-menuBGColor mr-2"
        onClick={(e) => changeNumber(e, false)}
      >
        <h2 className=" font-extrabold  text-xl px-3">-</h2>
      </div>
      <input
        className={` h-8 w-${setWidth} justify-center items-center`}
        onChange={() => onChangeNumber}
        value={number1}
      />
      <div
        className="rounded-full bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor dark:border-2 dark:border-menuBGColor ml-2"
        onClick={(e) => changeNumber(e, true)}
      >
        <h2 className="font-extrabold  text-xl px-2">+</h2>
      </div>
    </div>
  );
};
export default InputBox;
