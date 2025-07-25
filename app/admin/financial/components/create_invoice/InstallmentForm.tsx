import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import ShowIcon from '@/components/svg/showIcon';

const InstallmentForm = ({ className }: { className?: string }) => {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'installments',
  });

  return (
    <div className={className}>
      <h2 className="text-xl font-bold mb-2">Installments</h2>
      {fields.map((item, index) => (
        <div key={item.id} className="flex items-center space-x-4 mb-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              {...register(`installments.${index}.date`, { valueAsDate: true })}
              className="border rounded p-1 w-full"
            />
            {(errors.installments as any)?.[index]?.date && <p className="text-red-500 text-xs mt-1">{(errors.installments as any)[index].date.message}</p>}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              {...register(`installments.${index}.amount`, { valueAsNumber: true })}
              placeholder="Amount"
              className="border rounded p-1 w-full"
            />
            {(errors.installments as any)?.[index]?.amount && <p className="text-red-500 text-xs mt-1">{(errors.installments as any)[index].amount.message}</p>}
          </div>
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register(`installments.${index}.isPaid`)}
                className="mr-2"
              />
              Paid
            </label>
          </div>
          <button type="button" onClick={() => remove(index)} className="text-red-500 stroke-white">
            <ShowIcon icon={'Delete'} stroke={"2"}/> Delete
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ date: new Date(), amount: 0, isPaid: false })}
        className="bg-blue-500 text-white stroke-white px-4 py-2 rounded flex items-center"
      >
        <ShowIcon icon={'Add'} stroke={"2"}/>
        Add Installment
      </button>
    </div>
  );
};

export default InstallmentForm;