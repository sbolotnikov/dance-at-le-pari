import { TPriceOption } from '@/types/screen-settings';
import { useEffect, useState } from 'react';

type Props = {
  options: TPriceOption[] | null;
  onChange: (opt:TPriceOption[] | null) => void;
};

export default function PriceOptions({options, onChange }: Props) {
  
  const [amount, setAmount] = useState(1);
  const [price, setPrice] = useState(0.0);
  const [tag, setTag] = useState('');
  const [choosenOption, setChoosenOption] = useState(0);
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [priceOptions, setPriceOptions] = useState<TPriceOption[] | null>(null);
  const handleSubmit = () => {
    setErrorMessage('');
    document.querySelector('#tag1')!.classList.remove('invalid_input');
    document.querySelector('#price1')!.classList.remove('invalid_input');
    document.querySelector('#amount1')!.classList.remove('invalid_input');
    // submitting profile updated information
    if (price < 0 || price > 10000) {
      setErrorMessage('Enter price in range $0 to $10000');
      // make name input red
      document.querySelector('#price1')!.classList.add('invalid_input');
    } else if (tag.length > 30 || tag.length < 2) {
      setErrorMessage('Enter tag in range of 3 to 30 symbols');
      // make message input red
      document.querySelector('#tag1')!.classList.add('invalid_input');
    } else if (amount < 1 || amount > 50) {
      setErrorMessage('Enter tag in range of 1 to 50 symbols');
      // make message input red
      document.querySelector('#amount1')!.classList.add('invalid_input');
    } else {
      onChange( (priceOptions !== null)
        ? [...priceOptions!, { tag, price, amount }]
        : [{ tag, price, amount }]);
      priceOptions !== null
        ? setPriceOptions([...priceOptions!, { tag, price, amount }])
        : setPriceOptions([{ tag, price, amount }]);
      setVisible(false);
      setTag('');
      setPrice(0.0);
      setAmount(1);
    }
  };
 useEffect(() => {
    setPriceOptions(options);
 }, [options]);
  return (
    <div id='priceOptions' className={`w-full h-[4rem] flex flex-row relative rounded-md m-1`}>
      <div className="absolute inset-0 w-full h-[4rem] bg-lightMainBG dark:bg-darkMainBG/70 rounded-md p-2 flex flex-row justify-around items-center">
        {priceOptions !== null && (
          <select
            id="priceOptions"
            className="bg-main-bg mb-2 rounded-md text-ellipsis bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor p-1 w-3/4"
            onChange={(e) => {
              e.preventDefault;
              setChoosenOption(parseInt(e.target.value));
            }}
          >
            {priceOptions.map((option, index) => (
              <option key={"PriOp"+index} value={index}>
                {option.tag + ' $' + option.price}
              </option>
            ))}
          </select>
        )}
        <button
          className="btnFancySmall"
          onClick={() => {
            setVisible(true);
          }}
        >
          +
        </button>
        <button
          className="btnFancySmall alertColor"
          onClick={() => {
            setPriceOptions(
              priceOptions!.filter((_, i) => i !== choosenOption)
            );
            onChange(
              priceOptions!.filter((_, i) => i !== choosenOption)
            );
            setChoosenOption(0);
          }}
        >
          -
        </button>
      </div>
      <div
        className={`w-full absolute bottom-0 left-0  rounded-md p-1 bg-lightMainBG dark:bg-darkMainBG ${
          visible ? '' : 'hidden'
        }`}
      >
        <div className="w-full h-full flex flex-col justify-center items-center rounded-md border border-lightMainColor dark:border-darkMainColor p-1">
          <h2 className="text-center">Add new option</h2>
          <p className="text-center text-red-500">{errorMessage}</p>
          <label className="flex flex-row justify-between items-center mb-1">
            Option tag
            <input
              className=" outline-none border-none rounded-md  w-3/4 text-lightMainColor p-0.5 mx-1"
              id="tag1" 
              type="text"
              value={tag}
              onChange={(e) => {
                setTag(e.target.value);
              }} 
            />
          </label>
          <label className="flex flex-row justify-between items-center mb-1">
            Total
            <input
              className=" outline-none border-none rounded-md w-1/2  text-lightMainColor p-0.5 mx-1"
              id="price1" 
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(parseFloat(e.target.value));
              }} 
            />
          </label>
          <label className="flex flex-row justify-between items-center mb-1">
            Units
            <input
              className=" outline-none border-none rounded-md w-1/2  text-lightMainColor p-0.5 mx-1"
              id="amount1" 
              type="number"
              value={amount}
              min={1}
              onChange={(e) => {
                setAmount(parseInt(e.target.value));
              }} 
            />
          </label>
          <button className="btnFancy w-[90%] mb-10" onClick={handleSubmit}>
            {'Add'}
          </button>
          <button
            className="btnFancy w-[90%] mb-10"
            onClick={() => {
              setVisible(false);
            }}
          >
            {'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}
