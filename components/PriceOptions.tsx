import { useState } from 'react';

type Props = {
    onAdd: (tag: string, price: number, amount: number) => void;
};

export default function PriceOptions({onAdd}: Props) {
  const [amount, setAmount] = useState(1);
  const [price, setPrice] = useState(0.0);
  const [tag, setTag] = useState('');
  const [visible, setVisible] = useState(false);
  const [errorMessage,setErrorMessage] = useState('');
  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setErrorMessage ('');
    document.querySelector('#tag1')!.classList.remove('invalid_input');
    document.querySelector('#price1')!.classList.remove('invalid_input');
    document.querySelector('#amount1')!.classList.remove('invalid_input');
    // submitting profile updated information
    if (price < 0 || price > 10000) {
        setErrorMessage ('Enter price in range $0 to $10000');
      // make name input red
      document.querySelector('#price1')!.classList.add('invalid_input');
    } else if (tag.length > 30 || tag.length < 2) {
        setErrorMessage('Enter tag in range of 3 to 30 symbols');
      // make message input red
      document.querySelector('#tag1')!.classList.add('invalid_input');
    }else if (amount< 1 || amount > 50) {
        setErrorMessage('Enter tag in range of 1 to 50 symbols');
        // make message input red
        document.querySelector('#amount1')!.classList.add('invalid_input');
      }else {
        onAdd(tag, price, amount);
        setVisible(false);
        setTag('');
        setPrice(0.0);
        setAmount(1);
      }
}
  return (
    <div className={`w-full h-[4rem] flex flex-row relative `}>
      <div className="absolute inset-0 w-full h-[4rem] bg-lightMainBG dark:bg-darkMainBG/70 rounded-md p-2 flex flex-row justify-between items-center">
        <h2>Options</h2>
        <button
          className="btnFancy"
          onClick={() => {
            setVisible(true);
          }}
        >
          Add
        </button>
      </div>
      <div
        className={`w-full absolute bottom-0 left-0  rounded-md p-1 bg-lightMainBG dark:bg-darkMainBG ${
          visible ? '' : 'hidden'
        }`}
      >
        <div className="w-full h-full flex flex-col justify-center items-center rounded-md border border-lightMainColor dark:border-darkMainColor p-1">
        <form onSubmit={handleSubmit}> 
            <h2 className="text-center">Add new option</h2>
            <p className="text-center text-red-500">{errorMessage}</p>
          <label className="flex flex-row justify-between items-center mb-1">
            Option tag
            <input
              className=" outline-none border-none rounded-md  w-3/4 text-lightMainColor p-0.5 mx-1"
              id="tag1"
              name="tag1"
              type="text"
              value={tag}
              onChange={(e) => {
                setTag(e.target.value);
              }}
              required
            />
          </label>
          <label className="flex flex-row justify-between items-center mb-1">
            Price
            <input
              className=" outline-none border-none rounded-md w-1/2  text-lightMainColor p-0.5 mx-1"
              id="price1"
              name="price1"
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(parseFloat(e.target.value));
              }}
              required
            />
          </label>
          <label className="flex flex-row justify-between items-center mb-1">
            Amount
            <input
              className=" outline-none border-none rounded-md w-1/2  text-lightMainColor p-0.5 mx-1"
              id="amount1"
              name="amount1"
              type="number"
              value={amount}
              min={1}
              onChange={(e) => {
                setAmount(parseInt(e.target.value));
              }}
              required
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
          </form>
        </div>
      </div>
    </div>
  );
}
