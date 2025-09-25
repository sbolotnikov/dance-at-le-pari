'use client';
import React, { use, useEffect } from 'react';
import ShowIcon from './svg/showIcon';
import sleep from '@/utils/functions';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

type Props = {
  onReturn: (decision: string) => void;
  studentId: string;
  styling: {
    variantHead: string;
    heading: string;
    text: string;
    color1: string;
    button1: string;
    color2: string;
    button2: string;
    inputField: string;
  };
};

export const InvoiceModal = ({ onReturn, studentId, styling }: Props) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [isMultiInvoiceView, setIsMultiInvoiceView] = React.useState(true);
  const [selectedInvoice, setSelectedInvoice] = React.useState<string | null>(
    null
  );
  const [invoices, setInvoices] = React.useState<
    { id: string; studentName: string; date: string; total: number }[]
  >([]);
  const [installments, setInstallments] = React.useState<
    {
      id: string;
      invoiceId: string;
      amount: number;
      date: string;
      isPaid: boolean;
    }[]
  >([]);
  const [sessions, setSessions] = React.useState<
    {
      id: string;
      invoiceId: string;
      sessionType: string;
      price: number;
      discount: number;
      numberOfSessions: number;
    }[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/invoices/' + studentId);
        if (response.ok) {
          const invoicesData = await response.json();
          console.log('Fetched invoices data:', invoicesData);
          let installments1: {
            id: string;
            invoiceId: string;
            amount: number;
            date: string;
            isPaid: boolean;
          }[] = [];
          let sessions1: {
            id: string;
            invoiceId: string;
            sessionType: string;
            price: number;
            discount: number;
            numberOfSessions: number;
          }[] = [];
          invoicesData.forEach((invoice: any) => {
            invoice.installments.forEach((inst: any) => {
              installments1.push({
                id: inst.id,
                invoiceId: inst.invoiceId,
                amount: inst.amount,
                date: inst.date,
                isPaid: inst.isPaid,
              });
              //    invoice.sessions
            });
            invoice.sessions.forEach((sess: any) => {
              sessions1.push({
                id: sess.id,
                invoiceId: sess.invoiceId,
                sessionType: sess.sessionType,
                price: sess.price,
                discount: sess.discount,
                numberOfSessions: sess.numberOfSessions,
              });
              console.log('  Session:', sess);
            });
          });
          setInstallments(installments1);
          setSessions(sessions1);

          const mappedInvoices = invoicesData.map((invoice: any) => {
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

            return {
              id: invoice.id,
              studentName: invoice.customer?.name || 'N/A',
              date: new Date(invoice.createdAt).toLocaleDateString(),
              total: totalAmount,
            };
          });
          setInvoices(mappedInvoices);
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
      setLoading(false);
    };

    fetchInvoices();
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -600 }}
          transition={{
            ease: 'easeOut',
            duration: 1,
            times: [0, 0.2, 0.5, 0.8, 1],
          }}
          animate={{
            opacity: [0, 1, 1, 1, 1],
            rotateX: ['90deg', '89deg', '89deg', '0deg', '0deg'],
            x: ['-100vw', '0vw', '0vw', '0vw', '0vw'],
          }}
          exit={{
            opacity: [1, 1, 1, 1, 0],
            rotateX: ['0deg', '0deg', '89deg', '89deg', '90deg'],
            x: ['0vw', '0vw', '0vw', '0vw', '-100vw'],
          }}
          className="blurFilter animatePageMainDiv w-[100vw] h-[100svh] absolute flex flex-col justify-center items-center bg-slate-500/70 left-0 z-[1001]"
        >
          <div
            className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[1170px]  flex justify-center items-center flex-col   md:w-[80svw] bg-lightMainBG dark:bg-darkMainBG h-[73svh] md:h-[85svh]
            }`}
          >
            <div
              id="wrapperDiv"
              className={`w-full h-full relative  p-1  overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center`}
            >
              <button
                className={` flex flex-col justify-center items-center origin-center cursor-pointer z-10 hover:scale-125 absolute top-3 right-3`}
                onClick={() => {
                  setIsVisible(false);
                  sleep(1200).then(() => onReturn('close'));
                }}
              >
                <div className=" h-8 w-8  fill-lightMainColor stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor">
                  <ShowIcon icon={'Close'} stroke={'2'} />
                </div>
              </button>
              <div
                id="containedDiv"
                className={`absolute top-0 left-0 flex flex-col w-full p-1 justify-center items-center`}
              >
                {isMultiInvoiceView ? (
                  <div className="w-full flex flex-col  items-center">
                    <h2 className="w-full text-center p-2 text-xl font-bold">
                      Invoices for Student{' '}
                      {invoices.length > 0
                        ? `- ${invoices[0].studentName}`
                        : ''}
                    </h2>
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
                                Date
                              </th>
                              <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                                Total
                              </th>
                              <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                                Privates
                              </th>
                              <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                                Unpaid
                              </th>
                              <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                                Details
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoices.map((invoice) => (
                              <tr
                                key={invoice.id}
                                className="hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <td className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                                  {invoice.studentName}
                                </td>
                                <td className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                                  {invoice.date}
                                </td>
                                <td className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                                  ${(invoice.total || 0).toFixed(2)}
                                </td>
                                <td className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                                  {sessions
                                    .filter(
                                      (sess) =>
                                        sess.invoiceId === invoice.id &&
                                        sess.sessionType === 'Private'
                                    )
                                    .reduce(
                                      (acc, curr) =>
                                        acc + curr.numberOfSessions,
                                      0
                                    ) || 0}
                                </td>
                                <td className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                                  {installments
                                    .filter(
                                      (sess) =>
                                        sess.invoiceId === invoice.id &&
                                        sess.isPaid === false
                                    )
                                    .reduce(
                                      (acc, curr) => acc + curr.amount,
                                      0
                                    ) || 0}
                                </td>
                                <td className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor flex space-x-2">
                                  <Link
                                    href={`/admin/financial/edit/${invoice.id}`}
                                  >
                                    <button
                                      className="text-lightMainColor dark:text-darkMainColor hover:text-green-600 dark:hover:text-editcolor"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setIsMultiInvoiceView(false);
                                        setSelectedInvoice(invoice.id);
                                      }}
                                    >
                                      <div className="  h-10 w-10 md:h-12 md:w-12 fill-editcolor m-auto stroke-editcolor dark:fill-editcolor cursor-pointer ">
                                        <ShowIcon
                                          icon={'Edit'}
                                          stroke={'0.5'}
                                        />
                                        <span className="sr-only">Edit</span>
                                      </div>
                                    </button>
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full flex flex-col  items-center">
                    <button
                      className="btnFancy mb-2"
                      onClick={() => setIsMultiInvoiceView(true)}
                    >
                      Back to Invoices
                    </button>
                    <h2 className="w-full p-2 text-xl font-bold text-center">
                      Installments
                    </h2>
                    <div className="overflow-auto">
                      <table className="min-w-full bg-lightMainBG dark:bg-darkMainBG">
                        <thead>
                          <tr>
                            <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                              Invoice ID
                            </th>
                            <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                              Date
                            </th>
                            <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                              Amount
                            </th>
                            <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                              Is Paid
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {installments
                            .sort((a, b) => a.date.localeCompare(b.date))
                            .map((installment) => (
                              <tr
                                key={installment.id}
                                className="hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <td className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                                  {installment.invoiceId}
                                </td>
                                <td className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                                  {installment.date}
                                </td>
                                <td className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                                  ${(installment.amount || 0).toFixed(2)}
                                </td>
                                <td
                                  className={`py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor ${
                                    installment.isPaid
                                      ? 'text-green-600 dark:text-green-400'
                                      : 'text-red-600 dark:text-red-400'
                                  } text-left`}
                                >
                                  {installment.isPaid ? 'Yes' : 'No'}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      <h2 className="w-full p-2 text-xl font-bold text-center">
                        Sessions bought
                      </h2>
                      <table className="min-w-full bg-lightMainBG dark:bg-darkMainBG">
                        <thead>
                          <tr>
                            <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                              Invoice ID
                            </th>
                            <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                              Session Type
                            </th>
                            <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                              Number of Sessions
                            </th>
                            <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                              Price @ Discount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessions
                            .sort((a, b) =>
                              a.sessionType.localeCompare(b.sessionType)
                            )
                            .map((session) => (
                              <tr
                                key={session.id}
                                className="hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <td className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                                  {session.invoiceId}
                                </td>
                                <td className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                                  {session.sessionType}
                                </td>
                                <td className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                                  {session.numberOfSessions || 0}
                                </td>
                                <td
                                  className={`py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left`}
                                >
                                  ${session.price.toFixed(2)} @{' '}
                                  {session.discount}% off
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
