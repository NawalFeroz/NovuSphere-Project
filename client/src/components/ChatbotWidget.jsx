import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';

import config from '../chatbot/config';
import MessageParser from '../chatbot/MessageParser';
import ActionProvider from '../chatbot/ActionProvider';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end', // ⭐ Keeps everything aligned to the right!
      }}
    >
      {isOpen && (
        <div style={{ width: '350px' }}>
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      )}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#2563eb',
          color: '#fff',
          fontSize: '24px',
          border: 'none',
          cursor: 'pointer',
          marginTop: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        }}
      >
        💬
      </button>
    </div>
  );
};

export default ChatbotWidget;
