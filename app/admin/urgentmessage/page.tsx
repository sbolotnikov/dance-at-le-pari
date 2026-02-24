'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; 
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/page-wrapper';
import ShowIcon from '@/components/svg/showIcon'; 
import { useDimensions } from '@/hooks/useDimensions';
import LoadingScreen from '@/components/LoadingScreen'; 
import HTMLGenerator from '@/components/HTMLGenerator/HTMLGenerator';
import EditPagesModal from '@/components/EditPagesModal';
import { TUrgentMessage } from '@/types/screen-settings';
import AlertMessage from '@/components/alertMessage';
import AlertMessageFull from '@/components/alertMessageFull';
import sleep from '@/utils/functions';



export default function Page() { 
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [visibleAlert, setVisibleAlert] = useState(true);
  const [urgentMessages, setUrgentMessages] = useState<TUrgentMessage[]>([]);
  const [editingMessage, setEditingMessage] = useState<TUrgentMessage | null>(
    null
  );
  const [editingPagesMessage, setEditingPagesMessage] =
    useState<TUrgentMessage | null>(null);
  const [previewMessage, setPreviewMessage] = useState<TUrgentMessage | null>(
    null
  );

  const dimensions = useDimensions();

  const fetchUrgentMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/urgent-messages');
      if (!res.ok) {
        throw new Error('Failed to fetch urgent messages');
      }
      const data: TUrgentMessage[] = await res.json();
      setUrgentMessages(data);
    } catch (error) {
      console.error('Error fetching urgent messages:', error);
      // Optionally, display an error message to the user
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrgentMessages();
  }, []);

  const handleSaveMessage = async (html: string, pages: string[]) => {
    setLoading(true);
    try {
      if (editingMessage) {
        // Update existing message
        const res = await fetch(`/api/admin/urgent-messages/${editingMessage.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ htmlContent: html, pages, enabled: editingMessage.enabled }),
        });
        if (!res.ok) {
          throw new Error('Failed to update urgent message');
        }
        setEditingMessage(null);
      } else {
        // Create new message
        const res = await fetch('/api/admin/urgent-messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ htmlContent: html, pages, enabled: true }), // New messages are enabled by default
        });
        if (!res.ok) {
          throw new Error('Failed to create urgent message');
        }
      }
      setHtmlContent('');
      fetchUrgentMessages(); // Refresh the list
    } catch (error) {
      console.error('Error saving urgent message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMessage = (message: TUrgentMessage) => {
    setEditingMessage(message);
    setHtmlContent(message.htmlContent);
  };

  const handleDeleteMessage = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/urgent-messages/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete urgent message');
      }
      fetchUrgentMessages(); // Refresh the list
    } catch (error) {
      console.error('Error deleting urgent message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePages = async (messageId: number, pages: string[]) => {
    setLoading(true);
    try {
      const messageToUpdate = urgentMessages.find(msg => msg.id === messageId);
      if (!messageToUpdate) {
        throw new Error('Message not found for page update');
      }
      const res = await fetch(`/api/admin/urgent-messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...messageToUpdate, pages }),
      });
      if (!res.ok) {
        throw new Error('Failed to update message pages');
      }
      setEditingPagesMessage(null);
      fetchUrgentMessages(); // Refresh the list
    } catch (error) {
      console.error('Error saving pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnabled = async (message: TUrgentMessage) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/urgent-messages/${message.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...message, enabled: !message.enabled }),
      });
      if (!res.ok) {
        throw new Error('Failed to toggle urgent message status');
      }
      fetchUrgentMessages(); // Refresh the list
    } catch (error) {
      console.error('Error toggling message status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center md:items-end justify-center">
      {loading && <LoadingScreen />}
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[1328px]  flex justify-center items-center flex-col  bg-lightMainBG dark:bg-darkMainBG h-[70svh] md:h-[85svh]
        }`}
      >
        <div
          id="mainPage"
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">
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
                        onClick={() => setEditingPagesMessage(msg)}
                      >
                        Edit Pages
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
                      <button
                        className="btnFancy"
                        onClick={() => handleToggleEnabled(msg)}
                      >
                        {msg.enabled ? 'Disable' : 'Enable'}
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
        <AlertMessageFull
          visibility={!!previewMessage}
          _html={previewMessage.htmlContent}
          onReturn={() =>setPreviewMessage(null)}
        />
      )}
      {editingPagesMessage && (
        <EditPagesModal
          message={editingPagesMessage}
          onClose={() => setEditingPagesMessage(null)}
          onSave={(pages) => {
            handleSavePages(editingPagesMessage.id, pages);
          }}
        />
      )}
    </PageWrapper>
  );
}
