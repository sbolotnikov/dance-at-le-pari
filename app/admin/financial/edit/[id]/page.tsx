'use client';
import { FC, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import CustomerSelect from '../../components/create_invoice/CustomerSelect';
import SessionForm from '../../components/create_invoice/SessionForm';
import InstallmentForm from '../../components/create_invoice/InstallmentForm';
import InvoicePreview from '../../components/create_invoice/InvoicePreview';
import InvoiceActions from '../../components/create_invoice/InvoiceActions';
import { PageWrapper } from '@/components/page-wrapper';

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
  discount: z.number().min(0).max(100, 'Discount must be between 0 and 100'),
});

const EditInvoicePage: FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [invoiceDetails, setInvoiceDetails] = useState<any>(null);
  const methods = useForm({
    resolver: zodResolver(invoiceSchema),
  });

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
              Edit Invoice
            </h2>
            {invoiceDetails && (
              <div className="text-center text-sm mb-2">
                <p>Manager: {invoiceDetails.manager?.name || 'N/A'}</p>
                <p>Created: {new Date(invoiceDetails.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(invoiceDetails.updatedAt).toLocaleString()}</p>
              </div>
            )}
            <FormProvider {...methods}>
              <div className="container mx-auto p-2">
                <form
                  onSubmit={methods.handleSubmit(onSubmit)}
                  
                >
                  <CustomerSelect />
                  <SessionForm />
                  <InstallmentForm />
                  <div className="flex justify-end">
                    <label className="mr-2">Discount (%):</label>
                    <input
                      type="number"
                      {...methods.register('discount', { valueAsNumber: true })}
                      className="border rounded p-1 w-24"
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
