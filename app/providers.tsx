'use client';

import { SettingsProvider } from '@/hooks/useSettings';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { store } from '../app/store';
type Props = {
  children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  return (
    <SessionProvider>
      <Provider store={store}>
        <SettingsProvider>{children}</SettingsProvider>
      </Provider>
    </SessionProvider>
  );
};
