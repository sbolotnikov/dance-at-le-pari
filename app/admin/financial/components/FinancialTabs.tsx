'use client';
import { FC, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CreateInvoice from './create_invoice/CreateInvoice';
import ViewInvoices from './view_invoices/ViewInvoices';
import {Lessonsleft} from './lessons_left/Lessonsleft';

interface FinancialTabsProps {
  onAlert: (invoiceNum: string) => void;
  delInvoice:string
 }

const FinancialTabs: FC<FinancialTabsProps> = ({ delInvoice,onAlert}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
     
  const activeTab = searchParams.get('tab') || 'view'; // Default to 'view'

  const handleTabClick = (tabName: string) => {
    router.push(`/admin/financial?tab=${tabName}`);
  }; 
  return (
    <div className="w-full">
       
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`px-4 py-2 text-lg font-medium ${activeTab === 'create' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => handleTabClick('create')}
        >
          Create Invoice
        </button>
        <button
          className={`px-4 py-2 text-lg font-medium ${activeTab === 'view' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => handleTabClick('view')}
        >
          View Invoices
        </button>
        <button
          className={`px-4 py-2 text-lg font-medium ${activeTab === 'lessons' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => handleTabClick('lessons')}
        >
          Lessons Left
        </button>
      </div>
      <div className="p-4">
        {activeTab === 'create' && <CreateInvoice />}
        {activeTab === 'lessons' && <Lessonsleft />}
        {activeTab === 'view' && <ViewInvoices delInvoice={delInvoice} onAlert={(invoiceNum)=>{
                        onAlert(invoiceNum);
                       
        }}/>}
      </div>
    </div>
  );
};

export default FinancialTabs;