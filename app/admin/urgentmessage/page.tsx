'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import sleep, { isEmailValid } from '@/utils/functions';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/page-wrapper';
import ShowIcon from '@/components/svg/showIcon';
import EditContactsModal from '@/components/EditContactsModal';
import { useDimensions } from '@/hooks/useDimensions';
import LoadingScreen from '@/components/LoadingScreen';
import ShowSendingEmailResultsModal from '@/components/ShowSendingEmailResultsModal';
import HTMLGenerator from '@/components/HTMLGenerator/HTMLGenerator';

type UrgentMessage = {
  id: number;
  htmlContent: string;
  pages: string[];
};

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [urgentMessages, setUrgentMessages] = useState<UrgentMessage[]>([]);
  const [editingMessage, setEditingMessage] = useState<UrgentMessage | null>(
    null
  );
  const [previewMessage, setPreviewMessage] = useState<UrgentMessage | null>(
    null
  );

  const dimensions = useDimensions();

  // Mock data for initial state
  useEffect(() => {
    setUrgentMessages([
      {
        id: 1,
        htmlContent: '<h1>Welcome to our website!</h1>',
        pages: ['home'],
      },
      {
        id: 2,
        htmlContent: '<h2>Special event this weekend!</h2>',
        pages: ['calendar', 'extra'],
      },
    ]);
  }, []);

  const handleSaveMessage = (html: string, pages: string[]) => {
    if (editingMessage) {
      // Update existing message
      setUrgentMessages(
        urgentMessages.map((msg) =>
          msg.id === editingMessage.id ? { ...msg, htmlContent: html, pages } : msg
        )
      );
      setEditingMessage(null);
    } else {
      // Create new message
      const newMessage: UrgentMessage = {
        id: Date.now(),
        htmlContent: html,
        pages: pages,
      };
      setUrgentMessages([...urgentMessages, newMessage]);
    }
    setHtmlContent('');
  };

  const handleEditMessage = (message: UrgentMessage) => {
    setEditingMessage(message);
    setHtmlContent(message.htmlContent);
  };

  const handleDeleteMessage = (id: number) => {
    setUrgentMessages(urgentMessages.filter((msg) => msg.id !== id));
  };

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center md:items-end justify-center">
      {loading && <LoadingScreen />}
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[1328px]  flex justify-center items-center flex-col  bg-lightMainBG dark:bg-darkMainBG h-[70svh] md:h-[85svh]
        }`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative  p-1 overflow-auto border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
        >
          <div
            id="containedDiv"
            className={`absolute top-0 left-0 flex flex-col p-1 justify-center items-center w-full`}
          >
            <h2
              className="text-center font-semibold md:text-4xl uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Urgent Message
            </h2>

            {dimensions.height! > 600 && (
              <div
                id="icon"
                className=" h-20 w-20 md:h-28 md:w-28 fill-lightMainColor stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor m-auto"
              >
                <ShowIcon icon={'UrgentMessage'} stroke={'0.1'} />
              </div>
            )}

            <div className="w-full">
              <HTMLGenerator
                mode="message"
                initialHtml={editingMessage ? editingMessage.htmlContent : ''}
                initialPages={editingMessage ? editingMessage.pages : []}
                onSendEmails={(option, html, pages) => {
                  if (option === 4) {
                    handleSaveMessage(html, pages || []);
                  }
                }}
              />
            </div>

            <div className="w-full mt-4">
              <h3 className="text-2xl font-semibold mb-2">Current Messages</h3>
              <div className="flex flex-col gap-2">
                {urgentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-2 border rounded-md bg-gray-100 dark:bg-gray-800"
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: msg.htmlContent }}
                    />
                    <p className="text-sm text-gray-500">
                      Pages: {msg.pages.join(', ')}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="btnFancy"
                        onClick={() => handleEditMessage(msg)}
                      >
                        Edit
                      </button>
                      <button
                        className="btnFancy"
                        onClick={() => handleDeleteMessage(msg.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btnFancy"
                        onClick={() => setPreviewMessage(msg)}
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {previewMessage && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md">
            <div
              dangerouslySetInnerHTML={{ __html: previewMessage.htmlContent }}
            />
            <button
              className="btnFancy mt-4"
              onClick={() => setPreviewMessage(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
