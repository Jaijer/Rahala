import React, { useState, useEffect, useRef } from 'react';
import { Button, Input } from '@nextui-org/react';

const ChatBot = () => {
  // Original state variables
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const resizeRef = useRef(null);

  // NEW: Mobile-related state
  const [isMobile, setIsMobile] = useState(false);
  const [dimensions, setDimensions] = useState({ 
    width: typeof window !== 'undefined' ? 
      window.innerWidth < 768 ? window.innerWidth - 32 : 384 : 384,
    height: typeof window !== 'undefined' ? 
      window.innerWidth < 768 ? window.innerHeight - 100 : 384 : 384
  });
  const [isResizing, setIsResizing] = useState(false);

  // NEW: Mobile detection effect
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setDimensions({
          width: window.innerWidth - 32,
          height: window.innerHeight - 100
        });
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || isMobile) return;
      
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
  }, [isResizing, isMobile])

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

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving messages:', error);
        if (error.name === 'QuotaExceededError') {
          const reducedMessages = messages.slice(-20);
          localStorage.setItem('chatMessages', JSON.stringify(reducedMessages));
        }
      }
    }
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
    if (isMobile) return;
    e.preventDefault();
    setIsResizing(true);
  };
  // Clear conversation handler
  const clearConversation = () => {
    setMessages([{
      type: 'bot',
      content: 'مرحباً! أنا رحال، مساعدك الشخصي. كيف يمكنني مساعدتك اليوم؟'
    }]);
    localStorage.removeItem('chatMessages');
  };

  // Close handler
  const handleClose = () => {
    setIsOpen(false);
    if (messages.length > 20) { // Optional: Clear if conversation is too long
      clearConversation();
    }
  };

  // API call with retry mechanism
  const fetchWithRetry = async (url, options, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fetch(url, options);
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  };

  // Inside your ChatBot component, update the handleSubmit function:

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Check if the message is asking about the bot's name
    const nameQuestionPattern = /(?:ما|what|who).*(?:اسمك|name|you)/i;
    const isAskingName = nameQuestionPattern.test(message.toLowerCase());

    // Add user message immediately
    const userMessage = { type: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);

    // Clear input and set loading
    const currentMessage = message;
    setMessage('');
    setLoading(true);

    try {
      // Format conversation history with bot identity context
      const conversationHistory = [
        {
          role: 'system',
          content: 'You are رحال (Rahhal), a professional Arabic travel assistant. When asked about your name, always mention that you are رحال and explain that it means "traveler" in Arabic. Keep your responses friendly and culturally appropriate.'
        },
        ...messages.slice(-6).map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      ];

      // If it's a direct question about the name, handle it locally
      if (isAskingName) {
        const nameResponse = {
          type: 'bot',
          content: 'اسمي رحال، وهو يعني "المسافر" باللغة العربية. كيف يمكنني مساعدتك في رحلتك؟',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, nameResponse]);
        setLoading(false);
        return;
      }

      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const res = await fetchWithRetry(`${API_URL}/api/chatbot/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: currentMessage,
          conversationHistory
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Received response:', data);

      // Only include searchResults if they exist and are not empty
      const botResponse = {
        type: 'bot',
        content: data.output,
        timestamp: new Date().toISOString()
      };

      if (data.searchResults && data.searchResults.length > 0) {
        botResponse.searchResults = data.searchResults;
      }

      setMessages(prev => [...prev, botResponse]);

    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage = /[\u0600-\u06FF]/.test(currentMessage)
        ? 'عذراً، حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى.'
        : 'Sorry, a connection error occurred. Please try again.';

      setMessages(prev => [...prev, {
        type: 'bot',
        content: errorMessage,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`${isMobile ? 'fixed inset-0 z-50' : 'fixed bottom-6 right-6 z-50'}`}>
      {!isOpen && (
        <Button
          isIconOnly
          color="success"
          size="lg"
          radius="full"
          className={`${
            isMobile ? 'fixed bottom-6 right-4' : ''
          } w-14 h-14 shadow-lg bg-emerald-600 hover:bg-emerald-700`}
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
          className={`${
            isMobile 
              ? 'fixed inset-0' 
              : 'absolute bottom-0 right-0'
          } bg-white rounded-lg shadow-xl flex flex-col`}
          style={isMobile ? undefined : { 
            width: `${dimensions.width}px`, 
            height: `${dimensions.height}px`,
          }}
        >

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-700 font-arabic">رحال</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="light"
                onClick={clearConversation}
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                مسح المحادثة
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={handleClose}
                className="text-emerald-600 hover:text-emerald-700"
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
          </div>

          {/* Chat area */}
          <div 
            className={`flex-1 p-4 overflow-y-auto bg-gray-50 scrollbar-hide hover:scrollbar-default ${
              isMobile ? 'pb-20' : ''
            }`}
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
                    ? 'mr-auto ml-4 bg-emerald-100' 
                    : 'ml-auto mr-4 bg-white'
                } p-3 rounded-lg shadow-sm ${
                  isMobile ? 'max-w-[90%]' : 'max-w-[80%]'
                }`}
              >

                {msg.type === 'bot' && msg.searchResults ? (
                  <div className="space-y-4">
                    <p className="text-gray-700 whitespace-pre-line mb-4">
                      {msg.content}
                    </p>
                    {msg.searchResults.length > 0 && (
                      <div className="border-t pt-4">
                        <h3 className="font-semibold text-emerald-800 mb-3">الرحلات المتوفرة:</h3>
                        <div className="space-y-6">
                          {msg.searchResults.map((result, idx) => (
                            <a
                              href={`/view-travels/${result._id}`}
                              key={idx}
                              className="block bg-white rounded-lg p-4 shadow-sm border border-emerald-100 transition-all duration-200 hover:shadow-md hover:border-emerald-300 cursor-pointer"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-lg text-emerald-700">
                                  {idx + 1}. {result.travelName}
                                </h4>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-emerald-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </div>
                              <div className="flex gap-4 text-gray-600 mb-4">
                                <div className="flex items-center gap-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                  </svg>
                                  <span>{result.from}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                  </svg>
                                  <span>{result.destination}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                {result.packages.map((pkg, pIdx) => (
                                  <div key={pIdx} className="flex justify-between items-center py-2 px-3 bg-emerald-50 rounded">
                                    <span className="font-medium">{pkg.title}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-emerald-600 bg-emerald-100 px-2 py-1 rounded">
                                        {pkg.category}
                                      </span>
                                      <span className="font-bold text-emerald-700">
                                        {pkg.price} ريال
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-700 whitespace-pre-line">
                    {msg.content}
                  </p>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Resize handle */}
          {!isMobile && (
            <div
              className="absolute left-0 top-0 w-4 h-4 cursor-nw-resize"
              onMouseDown={handleResizeMouseDown}
            >
              <div className="w-2 h-2 bg-gray-300 rounded-full absolute top-1 left-1" />
            </div>
          )}


          {/* Input area */}
          <form 
            onSubmit={handleSubmit} 
            className={`p-4 border-t ${
              isMobile ? 'fixed bottom-0 left-0 right-0 bg-white' : ''
            }`}
          >
            <div className="flex gap-2">
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                disabled={loading}
                className={`flex-1 ${isMobile ? 'text-base' : ''}`}
                dir="rtl"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button
                type="submit"
                color="success"
                isLoading={loading}
                isIconOnly
                className={`bg-emerald-600 hover:bg-emerald-700 ${
                  isMobile ? 'w-12 h-12' : ''
                }`}
                disabled={loading || !message.trim()}
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