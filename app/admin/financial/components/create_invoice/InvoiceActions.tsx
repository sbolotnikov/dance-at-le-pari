import React from 'react';
import ShowIcon from '@/components/svg/showIcon';

const InvoiceActions = () => {
  return (
    <div className="flex justify-end space-x-4 mt-4">
      <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded flex items-center ">
        <div className="mr-2 h-10 w-10 md:h-12 md:w-12 stroke-alertcolor fill-alertcolor">
        <ShowIcon icon={'Close'} stroke={"2"} />
        </div>
        Cancel
      </button>
      <button type="submit" className="btnFancy px-4 py-2 rounded flex items-center">
        <ShowIcon icon={'Save'} stroke={"2"} />
        Save Invoice
      </button>
    </div>
  );
};

export default InvoiceActions;