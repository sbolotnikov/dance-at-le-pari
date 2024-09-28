import React from 'react'
import AnimateModalLayout from './AnimateModalLayout';

type Props = {
    visibility: boolean;
  onReturn: () => void;
}

const ChatbotModal = ({visibility, onReturn}: Props) => {
  return (
    <AnimateModalLayout
    visibility={visibility}
    onReturn={() => {
      onReturn();
    }}
  >
    <div>ChatbotModal</div>
    </AnimateModalLayout>
  )
}

export default ChatbotModal