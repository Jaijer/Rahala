import React, { useState, useEffect, useRef } from 'react';
import { Button, Input } from '@nextui-org/react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const resizeRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 384, height: 384 });
  const [isResizing, setIsResizing] = useState(false);

  // Load saved messages on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Add greeting only if no messages exist
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        type: 'bot',
        content: 'مرحباً! أنا رحال، مساعدك الشخصي. كيف يمكنني مساعدتك اليوم؟'
      }]);
    }
  }, [isOpen, messages.length]);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle resize events
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const newWidth = Math.min(Math.max(300, window.innerWidth - e.clientX), 800);
      const newHeight = Math.min(Math.max(300, window.innerHeight - e.clientY), 800);
      
      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResizeMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { type: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:3000/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message }),
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { type: 'bot', content: data.output }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'عذراً، حدث خطأ. الرجاء المحاولة مرة أخرى.'
      }]);
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <Button
          isIconOnly
          color="primary"
          size="lg"
          radius="full"
          className="w-14 h-14 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </Button>
      )}

      {isOpen && (
        <div 
          ref={resizeRef}
          className="absolute bottom-0 right-0 bg-white rounded-lg shadow-xl flex flex-col"
          style={{ 
            width: `${dimensions.width}px`, 
            height: `${dimensions.height}px`,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-700 font-arabic">رحال</h3>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          {/* Chat area */}
          <div 
            className="flex-1 p-4 overflow-y-auto bg-gray-50 scrollbar-hide hover:scrollbar-default" 
            dir="rtl"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgb(203 213 225) transparent'
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  msg.type === 'user' 
                    ? 'mr-auto ml-4 bg-blue-100' 
                    : 'ml-auto mr-4 bg-white'
                } p-3 rounded-lg shadow-sm max-w-[80%]`}
              >
                <p className="text-gray-700">{msg.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Resize handle */}
          <div
            className="absolute left-0 top-0 w-4 h-4 cursor-nw-resize"
            onMouseDown={handleResizeMouseDown}
          >
            <div className="w-2 h-2 bg-gray-300 rounded-full absolute top-1 left-1" />
          </div>

          {/* Input area */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                disabled={loading}
                className="flex-1"
                dir="rtl"
              />
              <Button
                type="submit"
                color="primary"
                isLoading={loading}
                isIconOnly
              >
                {!loading && (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-5 h-5 rotate-180"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;