import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import ShowIcon from '@/components/svg/showIcon';

const SessionForm = ({ className }: { className?: string }) => {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sessions',
  });

  return (
    <div className={className}>
      <h2 className="text-xl font-bold mb-2">Sessions</h2>
      {fields.map((item, index) => (
        <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 md:max-h-20 items-start">
          <div>
            <label className="block text-sm font-medium text-gray-700">Session Type</label>
            <select
              {...register(`sessions.${index}.sessionType`)}
              className="border rounded p-1 w-full"
            >
              <option value="Private">Private</option>
              <option value="Group">Group</option>
              <option value="Party">Party</option>
              <option value="Floor_Fee">Floor Fee</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              {...register(`sessions.${index}.price`, { valueAsNumber: true })}
              placeholder="Price"
              className="border rounded p-1 w-full"
            />
            {'sessions' in errors && Array.isArray(errors.sessions) && errors.sessions[index]?.price && (
              <p className="text-red-500 text-xs mt-1">{errors.sessions[index]?.price?.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
            <input
              type="number"
              {...register(`sessions.${index}.discount`, { valueAsNumber: true })}
              placeholder="Discount (%) unleashing"
              className="border rounded p-1 w-full"
            />
            {(errors.sessions as any)?.[index]?.discount && (
              <p className="text-red-500 text-xs mt-1">
                {(errors.sessions as any)[index].discount.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Sessions</label>
            <input
              type="number"
              {...register(`sessions.${index}.numberOfSessions`, { valueAsNumber: true })}
              placeholder="Number of Sessions"
              className="border rounded p-1 w-full"
            />
            {(Array.isArray(errors.sessions) && errors.sessions[index]?.numberOfSessions) && (
              <p className="text-red-500 text-xs mt-1">
                {errors.sessions[index].numberOfSessions.message}
              </p>
            )}
          </div>
          <button type="button" onClick={() => remove(index)} className="text-red-500 mt-6">
            <ShowIcon icon={'Delete'} stroke={"2"}/>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ sessionType: 'private', price: 0, discount: 0, numberOfSessions: 1 })}
        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
      >
        <ShowIcon icon={'Add'} stroke={"2"}/>
        Add Session
      </button>
    </div>
  );
};

export default SessionForm;