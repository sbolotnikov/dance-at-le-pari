'use client';
import { FC, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SessionForm from '../../components/create_invoice/SessionForm';
import InstallmentForm from '../../components/create_invoice/InstallmentForm';
import InvoicePreview from '../../components/create_invoice/InvoicePreview';
import InvoiceActions from '../../components/create_invoice/InvoiceActions';
import { PageWrapper } from '@/components/page-wrapper';
import ShowIcon from '@/components/svg/showIcon';
import { useDimensions } from '@/hooks/useDimensions';

const invoiceSchema = z.object({
  customerId: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().int().positive('Please select a student')
  ),
  installments: z.array(
    z.object({
      date: z.preprocess((arg) => {
        if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
      }, z.date()),
      paymentMethod: z
              .string()
              .refine(
                (val) => ['Cash', 'Check', 'Zelle', 'Credit Card'].includes(val),
                { message: 'Invalid payment method' }
              ),
      amount: z.number().positive('Amount must be a positive number'),
      isPaid: z.boolean(),
    })
  ),
  sessions: z.array(
    z.object({
      sessionType: z.enum(['Private', 'Group', 'Party', 'Floor_Fee']),
      price: z.number().positive('Price must be a positive number'),
      discount: z
        .number()
        .min(0)
        .max(100, 'Discount must be between 0 and 100'),
      numberOfSessions: z
        .number()
        .positive('Number of sessions must be a positive number'),
    })
  ),
   effectiveDate: z.preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date()),
    discount: z.number().min(0).max(100, 'Discount must be between 0 and 100'),
    packageType: z.string(),
});

const EditInvoicePage: FC = () => {
  const router = useRouter();
  const windowSize = useDimensions();
  const { id } = useParams();
  const [invoiceDetails, setInvoiceDetails] = useState<any>(null);
  const methods = useForm({
    resolver: zodResolver(invoiceSchema),
  });
 useEffect(() => {
    windowSize.width! > 768 && windowSize.height! > 768
      ? (document.getElementById('icon')!.style.display = 'block')
      : (document.getElementById('icon')!.style.display = 'none');
  }, [windowSize.height]);
  useEffect(() => {
    const fetchInvoice = async () => {
      if (id) {
        const response = await fetch(`/api/admin/invoices/${id}`);
        if (response.ok) {
          const invoiceData = await response.json();
          setInvoiceDetails(invoiceData);
          // Format dates for installment forms
          const formattedInvoiceData = {
            ...invoiceData,
            effectiveDate: new Date(invoiceData.effectiveDate).toISOString().split('T')[0], // YYYY-MM-DD
            installments: invoiceData.installments.map((inst: any) => ({
              ...inst,
              date: new Date(inst.date).toISOString().split('T')[0], // YYYY-MM-DD
              
            })),
          };
          methods.reset(formattedInvoiceData);
        } else {
          console.log('No such document!');
        }
      }
    };
    fetchInvoice();
  }, [id, methods]);

  const onSubmit = async (data: any) => {
    if (id) {
      const response = await fetch(`/api/admin/invoices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/admin/financial');
      } else {
        const errorData = await response.json();
        alert(`Failed to update invoice: ${errorData.error}`);
      }
    }
  };

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center md:items-end justify-center">
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95%] md:h-[85svh] max-w-[1400px] md:w-full flex justify-center items-center flex-col bg-lightMainBG dark:bg-darkMainBG h-[70svh]
          }`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative p-1 border border-lightMainColor dark:border-darkMainColor rounded-md overflow-y-auto"
        >
          <div
            id="containedDiv"
            className="absolute top-0 left-0 w-full flex flex-col items-center"
          >
            <h2
              className="text-center font-semibold md:text-4xl uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Studio Finance Dashboard
            </h2>
            <div
              id="icon"
              className="h-20 w-20 md:h-28 md:w-28 fill-lightMainColor stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor"
            >
              <ShowIcon icon={'FinanceLogo'} stroke={'0.05'} />
            </div>
            <div className="w-full">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  className={`px-4 py-2 text-lg font-medium text-gray-500 dark:text-gray-400'}`}
                  onClick={() => router.push('/admin/financial?tab=create')}
                >
                  Create Invoice
                </button>
                <button
                  className={`px-4 py-2 text-lg font-medium text-gray-500 dark:text-gray-400'}`}
                  onClick={() => router.push('/admin/financial?tab=view')}
                >
                  View Invoices
                </button>
                <div
                  className={`px-4 py-2 text-lg font-medium border-b-2 border-blue-500 text-blue-500`}
                >
                  Edit Invoice
                </div>
              </div>
            </div>

            <h2
              className="text-center font-semibold md:text-xl uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Invoice # {id}
            </h2>
            {invoiceDetails && (
              <div className="text-center text-sm mb-2">
                <p>{`Customer: ${invoiceDetails.customer?.name || 'N/A'} <${
                  invoiceDetails.customer?.email || 'N/A'
                }>`}</p>
                <p>Manager: {invoiceDetails.manager?.name || 'N/A'}</p>
                <p>
                  Created: {new Date(invoiceDetails.createdAt).toLocaleString()}
                </p>
                <p>
                  Last Updated:{' '}
                  {new Date(invoiceDetails.updatedAt).toLocaleString()}
                </p> 
              </div>
            )}
            {/* <div className="w-full text-center mb-4 flex justify-center space-x-4">
              
            </div> */}
            <FormProvider {...methods}>
              <div className="container mx-auto p-2">
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                  <div>
            <label className="block text-sm font-medium text-gray-700">
              Package Type
            </label>
            <select
              {...methods.register(`packageType`)}
              className="border rounded p-1 w-full dark:bg-darkMainBG"
            >
              <option value="1package">1 package</option>
              <option value="10package">10 packages</option>
              <option value="25package">25 packages</option>
              <option value="other">other</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium ">Effective Date</label>
            <input
              type="date"
              {...methods.register(`effectiveDate`, { valueAsDate: true })}
              className="border rounded p-1 w-full dark:bg-darkMainBG"
            />
            {/* {errors.effectiveDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.effectiveDate.message as string}
              </p>
            )} */}
          </div>
                  <SessionForm />
                  <InstallmentForm />
                  <div className="flex justify-end">
                    <label className="mr-2">Discount (%):</label>
                    <input
                      type="number"
                      {...methods.register('discount', { valueAsNumber: true })}
                      className="border rounded p-1 w-24 dark:bg-darkMainBG"
                    />
                  </div>
                  <InvoicePreview />
                  <InvoiceActions />
                </form>
              </div>
            </FormProvider>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default EditInvoicePage;
