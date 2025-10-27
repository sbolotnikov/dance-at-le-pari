import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import ShowIcon from '@/components/svg/showIcon';

const SessionForm = ({ className }: { className?: string }) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sessions',
  });

  return (
    <div className={className}>
      <h2 className="text-xl font-bold mb-2">Sessions</h2>
      {fields.map((item, index) => (
        <div
          key={item.id}
          className="grid grid-cols-1 md:grid-cols-5 gap-4  justify-center items-center"
        >

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Session Type
            </label>
            <select
              {...register(`sessions.${index}.sessionType`)}
              className="border rounded p-1 w-full dark:bg-darkMainBG"
            >
              <option value="Private">Private</option>
              <option value="Group">Group</option>
              <option value="Party">Party</option>
              <option value="Floor_Fee">Floor Fee</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              {...register(`sessions.${index}.price`, { valueAsNumber: true })}
              placeholder="Price"
              className="border rounded p-1 w-full dark:bg-darkMainBG"
            />
            {'sessions' in errors &&
              Array.isArray(errors.sessions) &&
              errors.sessions[index]?.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sessions[index]?.price?.message}
                </p>
              )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Discount (%)
            </label>
            <input
              type="number"
              {...register(`sessions.${index}.discount`, {
                valueAsNumber: true,
              })}
              placeholder="Discount (%) unleashing"
              className="border rounded p-1 w-full dark:bg-darkMainBG"
            />
            {(errors.sessions as any)?.[index]?.discount && (
              <p className="text-red-500 text-xs mt-1">
                {(errors.sessions as any)[index].discount.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Sessions
            </label>
            <input
              type="number"
              {...register(`sessions.${index}.numberOfSessions`, {
                valueAsNumber: true,
              })}
              placeholder="Number of Sessions"
              className="border rounded p-1 w-full dark:bg-darkMainBG"
            />
            {Array.isArray(errors.sessions) &&
              errors.sessions[index]?.numberOfSessions && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sessions[index].numberOfSessions.message}
                </p>
              )}
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
        onClick={() =>
          append({ 
            sessionType: 'Private',
            price: 0,
            discount: 0,
            numberOfSessions: 1,
          })
        }
        className="btnFancy px-4 py-2 rounded flex items-center  h-12 w-52 md:h-14 md:w-60 cursor-pointer relative "
      >
        <ShowIcon icon={'Plus'} stroke={'2'} />
        Add_Session
      </button>
    </div>
  );
};

export default SessionForm;
