import React from 'react';
import { useFormContext } from 'react-hook-form';

const InvoicePreview = () => {
  const { watch } = useFormContext();
  const watchSessions = watch("sessions");
  const watchDiscount = watch("discount");

  const calculateTotal = () => {
    interface Session {
      price: number;
      discount: number;
      numberOfSessions: number;
    }

    const watchSessions: Session[] = watch("sessions") || [];
    const watchDiscount: number = watch("discount");

    let sessionTotal: number = watchSessions.reduce((acc: number, session: Session | undefined) => {
      if (!session) return acc;
      return acc + (session.price * (100 - session.discount) / 100 * session.numberOfSessions);
    }, 0);
    return (sessionTotal * (100 - watchDiscount) / 100).toFixed(2);
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Invoice Preview</h2>
      <div className="flex justify-between">
        <span className="font-bold">Total:</span>
        <span>${calculateTotal()}</span>
      </div>
    </div>
  );
};

export default InvoicePreview;