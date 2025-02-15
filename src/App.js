import React, { useState, useEffect, useRef, forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';

import Sidebar from './components/Sidebar';
import { sendMessage } from './services/openaiService';
import { getRecommendation } from './services/thradsService';
import InfoModal from './components/InfoModal';
import './App.css';

import { Analytics } from "@vercel/analytics/react";

//TODO: No Adopporunity + No product/product found

function ChatBubble({ role, content }) {
  const renderContent = (contentBlock) => {
    if (contentBlock.type === 'product') {
      return (
        <a 
          href={contentBlock.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block text-decoration-none"
        >
          <div className="mt-2 flex items-center p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg mr-4">
              <img src={contentBlock.imageUrl} alt={contentBlock.productName} className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{contentBlock.productName}</h3>
              <p className="text-blue-600 font-medium">{contentBlock.price}</p>
            </div>
          </div>
        </a>
      );
    }
  
    return (
      <div className="prose prose-sm max-w-none leading-tight">
        <ReactMarkdown 
          components={{
            p: ({children}) => <p className="m-0 leading-normal">{children}</p>,
            code: ({children}) => <code className="bg-gray-100 px-1 rounded">{children}</code>,
            pre: ({children}) => <pre className="bg-gray-100 p-2 rounded my-1 overflow-x-auto">{children}</pre>,
            ul: ({children}) => <ul className="m-0 space-y-0">{children}</ul>,
            li: ({children}) => <li className="m-0">{children}</li>
          }}
        >
          {contentBlock.text}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className={`${role === 'user' ? 'col-start-1 col-end-13 justify-start' : 'col-start-1 col-end-13 justify-end'} p-2 rounded-lg flex`}>
      <div className={`flex ${role === 'user' ? 'flex-row' : 'flex-row-reverse'} items-center max-w-[80%]`}>
        {role === 'user' ? (
          <div 
            className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full text-white`} 
            style={{ backgroundColor: 'rgb(0, 132, 255)' }}
          >
            {role[0].toUpperCase()}
          </div>
        ) : (
          <img 
            src={require('./assets/chatbot_logo.png')} 
            alt="Chatbot"
            className="flex-shrink-0 h-10 w-10"
          />
        )}
        <div 
          className={`relative ${role === 'user' ? 'ml-3' : 'mr-3'} text-sm p-3 shadow rounded-xl flex-grow`} 
          style={{ 
            backgroundColor: role === 'user' 
              ? '#e0f2fe' 
              : role === 'system'
              ? '#fde68a'  
              : '#f4f4f5',
          }}
        >
          <div className="whitespace-pre-wrap text-black [&>*]:mb-0">
            {Array.isArray(content) 
              ? content.map((block, index) => (
                  <div key={index} className="flex items-center">
                    {index === 0 && role === 'system' && (
                      <img 
                        src={require('./assets/ad_logo.png')} 
                        alt="Ad" 
                        className="h-4 w-4 mr-2"
                      />
                    )}
                    {renderContent(block)}
                  </div>
                ))
              : content.split('\n').map((text, index) => (
                  <div key={index}>{text}</div>
                ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMessages({ messages }) {
  return (
    <div className="grid grid-cols-12 gap-y-2 px-2">
      {messages.map((message, index) =>
        <ChatBubble 
          key={index} 
          role={message.role} 
          content={message.content} 
        />
      )}
    </div>
  );
}

const ChatInput = forwardRef(({ onSendMessage }, ref) => {
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim() === '') {
      return;
    }
    onSendMessage(input);
    setInput('');
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  return (
    <div className="flex items-center gap-2">
    <input
      ref={ref}
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyPress={handleKeyPress}
      className="flex-grow px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      placeholder="Type a message..."
    />
    <button
      onClick={handleSendMessage}
      className="p-2 bg-blue-500 text-white text-sm md:text-base rounded-lg hover:bg-blue-600 min-w-[4rem] md:w-20"
    >
      Send
    </button>
  </div>
  );
});

function App() {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: [{
      text: "👋 Hi! I'm your Thrads AI assistant. How can I help you today?"
    }]
  }]);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const inputFieldRef = useRef(null);
  const [settings, setSettings] = useState({
    force: false,
    conversationOffset: 5,
    adFrequencyLimit: 10
  });

  // Add this new handler
  const handleSettingsChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  useEffect(() => {
    inputFieldRef.current.focus();
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = async (input) => {
    const newMessage = {
      role: "user",
      content: [{
        text: input
      }]
    };
    setMessages([...messages, newMessage]);
    scrollToBottom();
  
    try {
      // Only include the initial system prompt, and filter out any later system messages.
      const conversation = [
        { role: "system", content: "You are a helpful assistant." },
        ...messages
          .filter(msg => msg.role !== "system")
          .map(msg => ({ role: msg.role, content: msg.content[0].text })),
        { role: "user", content: input }
      ];

      const response = await sendMessage(conversation);
  
      // Add assistant's response
      const botResponse = {
        role: "assistant",
        content: [{
          text: response.content
        }]
      };
      setMessages(prev => [...prev, botResponse]);
  
      // Get recommendation from Thrads API
      const recommendation = await getRecommendation(input, response.content, settings);
  
      // If recommendation exists and ad is true, add the system message immediately
      if (recommendation.ad) {
        const systemResponse = {
          role: "system",
          content: [
            {
              text: recommendation.creative,
            },
            {
              type: "product",
              productName: recommendation.prod_name,
              price: recommendation.price,
              imageUrl: recommendation.imgUrl,
              url: recommendation.url
            }
          ]
        };
        console.log('System response:', systemResponse);
        setMessages(prev => [...prev, systemResponse]);
      }
      
      scrollToBottom();
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: "assistant",
        content: [{
          text: "Sorry, I encountered an error. Please try again."
        }]
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="antialiased bg-white dark:bg-gray-900">
      <InfoModal 
        isOpen={isInfoModalOpen} 
        onClose={() => setIsInfoModalOpen(false)} 
      />
      <Sidebar settings={settings} onSettingsChange={handleSettingsChange} />
      <main className="p-2 md:p-4 md:ml-48 pt-16 md:pt-20 dark:text-white h-screen bg-gray-50 overflow-hidden">
        <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl h-[calc(100vh-6rem)] max-w-4xl mx-auto">
          <div className="flex-1 overflow-x-hidden overflow-y-auto mb-4 px-2 md:px-4">
            <ChatMessages messages={messages} />
            <div ref={messagesEndRef} />
          </div>
          <div className="p-2 md:p-4 sticky bottom-0 bg-gray-50">
            <ChatInput onSendMessage={handleSendMessage} ref={inputFieldRef} />
          </div>
        </div>
      </main>
      <Analytics />
    </div>
  );
}

export default App;