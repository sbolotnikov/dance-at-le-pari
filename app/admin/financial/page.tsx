'use client';
import { FC, useContext, useEffect, useState } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import ShowIcon from '@/components/svg/showIcon';
import { SettingsContext } from '@/hooks/useSettings';
import { ScreenSettingsContextType } from '@/types/screen-settings';
import { useDimensions } from '@/hooks/useDimensions';
import FinancialTabsWrapper from './components/FinancialTabsWrapper';
import AlertMenu from '@/components/alertMenu';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const { darkMode } = useContext(SettingsContext) as ScreenSettingsContextType;
  const windowSize = useDimensions();
  const [loading, setLoading] = useState(false);
  const [revealAlert, setRevealAlert] = useState(false);
    const [delInvoice, setDelInvoice] = useState<string>('');
    const [alertStyle, setAlertStyle] = useState({
      variantHead: '',
      heading: '',
      text: ``,
      color1: '',
      button1: '',
      color2: '',
      button2: '',
      inputField: '',
    });
    const onReturnAlert = (decision1: string, inputValue: string | null) => {
      setRevealAlert(false);
      if (decision1 === 'Confirm') setDelInvoice(alertStyle.text.split('#')[1].slice(0,-1));
      // location.reload();
    };

  useEffect(() => {
    if (typeof document !== 'undefined' && windowSize.width && windowSize.height) {
      const r = document.documentElement;
      if (darkMode) {
        r.style.setProperty('--accent-color', '#93c5fd');
      } else {
        r.style.setProperty('--accent-color', '#504deb');
      }
      const icon = document.getElementById('icon');
      if (icon) {
        if (windowSize.width > 768 && windowSize.height > 768) {
          icon.style.display = 'block';
        } else {
          icon.style.display = 'none';
        }
      }
    }
  }, [darkMode, windowSize.width, windowSize.height]);
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center md:items-end justify-center">
        <AlertMenu
          visibility={revealAlert}
          onReturn={onReturnAlert}
          styling={alertStyle}
        />
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
            className="absolute top-0 left-0 w-full flex flex-col justify-center items-center"
          >
            <h2
              className="text-center font-semibold md:text-4xl uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Studio Finance Dashboard
            </h2>
            <div
              id="icon"
              className="h-20 w-20 md:h-28 md:w-28 fill-lightMainColor stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor"
            >
              <ShowIcon icon={'FinanceLogo'} stroke={'0.05'} />
            </div>
            <FinancialTabsWrapper
              delInvoice={delInvoice}
              onAlert={(invoiceNum) => {
                // Show alert for confirmation
                setAlertStyle({
                  variantHead: 'warning',
                  heading: 'Warning',
                  text: `Would you like to delete invoice #${invoiceNum}!`,
                  color1: 'danger',
                  button1: 'Confirm',
                  color2: 'success',
                  button2: 'Cancel',
                  inputField: '',
                });
                setRevealAlert(true);
              }}
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
