import React from 'react';
import { useFormContext } from 'react-hook-form';

interface Session {
  price: number;
  discount: number;
  numberOfSessions: number;
}

const InvoicePreview = () => {
  const { watch } = useFormContext();
  const sessions = watch("sessions") as Session[] || [];
  const discount = watch("discount") as number || 0;

  const calculateTotal = () => {
    const sessionTotal = sessions.reduce((acc, session) => {
      if (!session) return acc;
      return acc + (session.price * (100 - session.discount) / 100 * session.numberOfSessions);
    }, 0);
    return (sessionTotal * (100 - discount) / 100).toFixed(2);
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