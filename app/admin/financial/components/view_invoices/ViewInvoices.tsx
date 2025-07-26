import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import ShowIcon from '@/components/svg/showIcon';

interface Invoice {
  id: string;
  studentName: string;
  date: string;
  total: number;
}

interface ViewInvoicesProps {
  onAlert: (invoiceNum: string) => void;
  delInvoice: string;
}

const ViewInvoices: FC<ViewInvoicesProps> = ({ onAlert, delInvoice }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (delInvoice.length > 0) {

const match = delInvoice.match(/#(.*?)!/);

if (match && match[1]) {
   handleDelete(match[1]);
} else {
  console.log("No match found.");
}
    }
  }, [delInvoice]);
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/admin/invoices');
        if (response.ok) {
          const invoicesData = await response.json();
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

  const filteredInvoices = invoices.filter((invoice) =>
    (invoice.studentName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    console.log('Attempting to delete invoice with ID:', id);
    try {
      const response = await fetch(`/api/admin/invoices/${id}`, {
        method: 'DELETE',
      });
      console.log('Delete API response:', response);
      if (response.ok) {
        setInvoices(invoices.filter((invoice) => invoice.id !== id));
        console.log('Invoice deleted successfully from UI.');
      } else {
        const errorData = await response.json();
        console.error('Error deleting invoice from API:', errorData);
      }
    } catch (error) {
      console.error('Network error during invoice deletion: ', error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-lightMainColor dark:text-darkMainColor">
          View Invoices
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by student name"
            className="border rounded-full py-2 px-4 pl-10 bg-lightMainBG dark:bg-darkMainBG text-lightMainColor dark:text-darkMainColor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <ShowIcon icon={'Search'} />
          </div>
        </div>
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
                  Date
                </th>
                <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                  Total
                </th>
                <th className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor text-lightMainColor dark:text-darkMainColor text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
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
                  <td className="py-2 px-4 border-b border-lightMainColor dark:border-darkMainColor flex space-x-2">
                    <Link href={`/admin/financial/edit/${invoice.id}`}>
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
                       onAlert(invoice.id);
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

export default ViewInvoices;
