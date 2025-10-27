'use client';
import { FC, Suspense } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import FinancialTabs from './FinancialTabs';

interface FinancialTabsWrapperProps {
  delInvoice: string;
  onAlert: (invoiceNum: string) => void;
}

const FinancialTabsWrapper: FC<FinancialTabsWrapperProps> = ({ delInvoice, onAlert }) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <FinancialTabs delInvoice={delInvoice} onAlert={onAlert} />
    </Suspense>
  );
};

export default FinancialTabsWrapper;
