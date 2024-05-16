import { TPriceOption } from '@/types/screen-settings';
import { useEffect, useState } from 'react';

type Props = {
  options: TPriceOption[] | null;
  onChange: (opt: TPriceOption) => void;
};

const PriceOptionSelect = ({ options, onChange }: Props) => {
  const [choosenOption, setChoosenOption] = useState(0);
  const [priceOptions, setPriceOptions] = useState<TPriceOption[] | null>(null);
  useEffect(() => {
    setPriceOptions(options);
    console.log(options)
  }, [options]);
  return (
    <select
      id="priceOptions"
      className="bg-main-bg mb-2 rounded-md text-ellipsis bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor p-1 w-[95%]"
      onChange={(e) => {
        e.preventDefault;
        setChoosenOption(parseInt(e.target.value));
        onChange(priceOptions![parseInt(e.target.value)]);
      }}
    >
      {priceOptions && priceOptions!.map((option, index) => (
        <option key={index} value={index}>
          {option.tag + ' $' + option.price}
        </option>
      ))}
    </select>
  );
};

export default PriceOptionSelect;
