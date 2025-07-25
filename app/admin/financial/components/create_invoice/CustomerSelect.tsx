import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import ShowIcon from '@/components/svg/showIcon';

type Customer = {
  _id: number;
  name: string;
  email: string;
};

const CustomerSelect = ({ className }: { className?: string }) => {
  const { register, formState: { errors } } = useFormContext();
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = () => {
      fetch('/api/admin/get_students', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then((response) => response.json())
        .then((data) => {
          const customersData = data.map((item: any) => ({
            _id: item.id,
            name: item.name ? item.name : 'Unknown',
            email: item.email
          })).sort((a: Customer, b: Customer) => a.name.localeCompare(b.name));
          setCustomers(customersData);
        })
        .catch((error) => {
          console.error('Error fetching customers:', error);
        });
    }
    fetchCustomers();
  }, []);

  return (
    <div className={className}>
      <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
       Student
      </label>
      <select
        id="customer"
        {...register('customerId')}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="">Select a student</option>
        {customers.length > 0 && customers.map((customer: Customer) => (
          <option key={customer._id} value={customer._id}>
            {`${customer.name} <${customer.email}>`}
          </option>
        ))}
      </select>
      {errors.customerId?.message && (
        <p className="text-red-500 text-xs mt-1">{String(errors.customerId.message)}</p>
      )}
    </div>
  );
};

export default CustomerSelect;