'use client';

import { SettingsProvider } from '@/hooks/useSettings';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { PopupProvider } from '@/hooks/usePopupContext';
type Props = {
  children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  return (
    <SessionProvider>
      <Provider store={store}>
        <SettingsProvider>
          <PopupProvider>{children}</PopupProvider>
        </SettingsProvider>
      </Provider>
    </SessionProvider>
  );
};
