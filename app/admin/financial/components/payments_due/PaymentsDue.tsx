import ShowIcon from '@/components/svg/showIcon';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { is } from 'zod/v4/locales';

type Props = {onAlert: (invoiceNum: string) => void; };

type Customer = {
  _id: number;
  name: string;
  email: string;
};
interface ApiInstallment {
  id: string;
  date: string;
  amount: number;
  isPaid: boolean;
}
interface Invoice {
  id: string;
  studentName: string;
  studentId: string;
  date: string;
  totalCost: number;
  totalPaid: number;
  totalDue: number;
  payments: ApiInstallment[];
}
export const PaymentsDue = (props: Props) => {
  const { onAlert } = props;
  const [invoices, setInvoices] = useState<Invoice[]>([]);
 
  const [loading, setLoading] = useState(true);
 
  const lessonLength = 45; // in minutes
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/admin/invoices');
        if (response.ok) {
          const invoicesData = await response.json();
          console.log('Fetched invoices data:', invoicesData);
          const mappedInvoices = invoicesData.map((invoice: any) => {
            interface ApiCustomer {
              id: string;
              name?: string;
            }

            interface ApiInvoice {
              id: string;
              customer?: ApiCustomer;
              effectiveDate: string;
              installments?: ApiInstallment[];
            }

            interface Payment {
              id: string;
              date: string;
              amount: number;
            }

            const inv = invoice as ApiInvoice;
            const sessionTotal = invoice.sessions.reduce(
              (sum: number, session: any) => {
                return (
                  sum +
                  session.price *
                    session.numberOfSessions *
                    (1 - session.discount / 100)
                );
              },
              0
            );
            const totalAmount =
              sessionTotal * (1 - (invoice.discount || 0) / 100);
            const totalPayments = (inv.installments || [])
              .filter((inst: ApiInstallment) => inst.isPaid === true)
              .reduce((sum: number, inst: ApiInstallment) => sum + inst.amount, 0);
            return {
              id: inv.id,
              studentName: inv.customer?.name || 'N/A',
              studentId: inv.customer?.id || 'N/A',
              date: new Date(inv.effectiveDate).toLocaleString('sv-SE', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }),
              totalCost: totalAmount,
              totalPaid: totalPayments,
              totalDue: totalAmount - totalPayments,
              payments: (inv.installments || [])
                .filter((inst: ApiInstallment) => inst.isPaid === true)
                .map((inst: ApiInstallment): Payment => {
                  return {
                    id: inst.id,
                    date: new Date(inst.date.split('T')[0]+"T08:00:00.000Z").toLocaleString('sv-SE', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                    }),
                    amount: inst.amount,
                  };
                }),
            };
          });
          setInvoices(mappedInvoices);
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };
    fetchInvoices().then(() => {
      setLoading(false);
    });
  }, []);
   
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-lightMainColor dark:text-darkMainColor">
          Lessons Left
        </h2>
      </div>
      {loading ? (
        <p>Loading invoices...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-lightMainBG dark:bg-darkMainBG">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                  Student Name
                </th>
                <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                  Total Invoice Cost
                </th>
                <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                  Payments Received
                </th>
                <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                  Total Received
                </th>
                <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                  Balance Due
                </th>
                <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                  Actions
                </th>
                 
              </tr>
            </thead>
            <tbody>
              {invoices &&
                invoices.sort((a, b) => b.totalDue - a.totalDue).map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-200 dark:hover:bg-gray-500 border-b border-lightMainColor dark:border-darkMainColor"
                  >
                    <td className="py-2 px-4  text-lightMainColor dark:text-darkMainColor text-left">
                      {row.studentName}
                    </td>
                    <td className="py-2 px-4   text-lightMainColor dark:text-darkMainColor text-left">
                     ${row.totalCost.toFixed(2)}
                    </td>
                    <td className="py-2 px-4  text-lightMainColor dark:text-darkMainColor text-left">
                      {row.payments.sort((a, b) => a.date.localeCompare(b.date)).map((payment, index) => (
                        <div key={payment.id} className="flex flex-row ">
                          <div className={`p-1 border border-blue-500 ${index%2===0 ? `text-blue-500 bg-darkMainColor`:`bg-blue-500 text-darkMainColor`}`}>{payment.date}</div>
                          <div className={`p-1 border border-blue-500 ${index%2===1 ? `text-blue-500 bg-darkMainColor`:`bg-blue-500 text-darkMainColor`}`}>${payment.amount.toFixed(2)}</div>
                        </div>
                      ))}
                    </td>
                    <td className="py-2 px-4  text-lightMainColor dark:text-darkMainColor text-left">
                      ${row.totalPaid || 0}
                    </td>
                    <td
                      className={`py-2 px-4   ${
                        row.totalDue > 0 ? 'text-alertcolor' : 'text-lightMainColor dark:text-darkMainColor'
                      }  text-left`}
                    >
                      ${row.totalDue || 0}
                    </td>
                    <td className="py-2 px-4  flex space-x-2">
                    <Link href={`/admin/financial/edit/${row.id}`}>
                      <button className="text-lightMainColor dark:text-darkMainColor hover:text-green-600 dark:hover:text-editcolor">
                        <div className="  h-10 w-10 md:h-12 md:w-12 fill-editcolor m-auto stroke-editcolor dark:fill-editcolor cursor-pointer ">
                          <ShowIcon icon={'Edit'} stroke={'0.5'} />
                          <span className="sr-only">Edit</span>
                        </div>
                      </button>
                    </Link>
                    <button
                      className="text-red-500"
                      onClick={() => {
                       onAlert(row.id);
                      }
                    }
                    >
                      <div className="mr-2 h-10 w-10 md:h-12 md:w-12 stroke-alertcolor fill-alertcolor">
                        <ShowIcon icon={'Close'} stroke={'2'} />
                      </div>
                    </button>
                  </td> 
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
