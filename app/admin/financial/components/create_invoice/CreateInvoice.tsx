'use client';
import { FC } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import CustomerSelect from './CustomerSelect';
import SessionForm from './SessionForm';
import InstallmentForm from './InstallmentForm';
import InvoicePreview from './InvoicePreview';
import InvoiceActions from './InvoiceActions'; 
import { useSession } from 'next-auth/react';


const invoiceSchema = z.object({
  customerId: z.preprocess((val) => parseInt(val as string, 10), z.number().int().positive('Please select a student')),
  installments: z.array(z.object({
    date: z.preprocess((arg) => {
      if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
    }, z.date()),
    amount: z.number().positive('Amount must be a positive number'),
    isPaid: z.boolean(),
  })),
  sessions: z.array(z.object({
    sessionType: z.enum(['Private', 'Group', 'Party', 'Floor_Fee']),
    price: z.number().positive('Price must be a positive number'),
    discount: z.number().min(0).max(100, 'Discount must be between 0 and 100'),
    numberOfSessions: z.number().positive('Number of sessions must be a positive number'),
  })),
  discount: z.number().min(0).max(100, 'Discount must be between 0 and 100'),
});

interface CreateInvoiceProps {}

const CreateInvoice: FC<CreateInvoiceProps> = ({}) => {
  const { data: session } = useSession();
  const methods = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      installments: [],
      sessions: [],
      discount: 0,
    },
  });

  const { handleSubmit, control, formState: { errors } } = methods;

  const onSubmit = async (data: any) => {
    console.log('Submitting data:', data);
    try {
      const response = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          managerId: session?.user?.id ? parseInt(session.user.id as string, 10) : 1 // Provide a default manager ID or handle authentication
        }),
      });

      if (response.ok) {
        alert('Invoice saved successfully!');
        methods.reset();
      } else {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        alert(`Failed to save invoice: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Failed to save invoice. Please try again.');
    }
  };

  return (
    <div className="w-full relative overflow-auto">
    <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <CustomerSelect className="mb-2"/>
          {errors.customerId && <p className="text-red-500 text-xs mt-1">{errors.customerId.message as string}</p>}
          <SessionForm className="mb-2"/>
          {errors.sessions && <p className="text-red-500 text-xs mt-1">{errors.sessions.message as string}</p>}
          <InstallmentForm className="mb-2"/>
          {errors.installments && <p className="text-red-500 text-xs mt-1">{errors.installments.message as string}</p>}
          <div className="flex justify-end items-center mb-2">
            <label className="mr-2 text-lightMainColor dark:text-darkMainColor">Discount (%):</label>
            <input
              type="number"
              {...methods.register('discount', { valueAsNumber: true })}
              className="border rounded p-1 w-24 bg-lightMainBG dark:bg-darkMainBG text-lightMainColor dark:text-darkMainColor"
            />
          </div>
          {errors.discount && <p className="text-red-500 text-xs mt-1">{errors.discount.message as string}</p>}
          <InvoicePreview />
          <InvoiceActions />
        </form>
    </FormProvider>
    </div>
  );
}

export default CreateInvoice;