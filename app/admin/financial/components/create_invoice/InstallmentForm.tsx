import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import ShowIcon from '@/components/svg/showIcon';

const InstallmentForm = ({ className }: { className?: string }) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'installments',
  });

  return (
    <div className={className}>
      <h2 className="text-xl font-bold mb-2">Installments</h2>
      {fields.map((item, index) => (
        <div key={item.id} className="flex items-center space-x-4 mb-2 text-lightMainColor dark:text-darkMainColor">
          <div className="flex-1">
            <label className="block text-sm font-medium ">
              Date
            </label>
            <input
              type="date"
              {...register(`installments.${index}.date`, { valueAsDate: true })}
              className="border rounded p-1 w-full dark:bg-darkMainBG"
            />
            {(errors.installments as any)?.[index]?.date && (
              <p className="text-red-500 text-xs mt-1">
                {(errors.installments as any)[index].date.message}
              </p>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium ">
              Amount
            </label>
            <input
              type="number"
              {...register(`installments.${index}.amount`, {
                valueAsNumber: true,
              })}
              placeholder="Amount"
              className="border rounded p-1 w-full dark:bg-darkMainBG"
            />
            {(errors.installments as any)?.[index]?.amount && (
              <p className="text-red-500 text-xs mt-1">
                {(errors.installments as any)[index].amount.message}
              </p>
            )}
          </div>
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register(`installments.${index}.isPaid`)}
                className="mr-2 dark:bg-darkMainBG"
              />
              Paid
            </label>
          </div>
          <button type="button" onClick={() => remove(index)} className="flex items-center justify-center">
            <div className="mr-2 h-10 w-10 md:h-12 md:w-12 hover:md:h-14 hover:md:w-14 stroke-alertcolor fill-alertcolor">
              <ShowIcon icon={'Close'} stroke={'2'} />
            </div>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ date: new Date(), amount: 0, isPaid: false })}
        className="btnFancy px-4 py-2 rounded flex items-center  h-12 w-52 md:h-14 md:w-60 cursor-pointer relative "
      >
          <ShowIcon icon={'Plus'} stroke={'2'} />
        <span className="">Add_Payment</span>
      </button>
      
    </div>
  );
};

export default InstallmentForm;
