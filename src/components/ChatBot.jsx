import React, { useState, useRef, useEffect } from 'react';
import PitchGenerator from './PitchGenerator';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showRestaurantFinder, setShowRestaurantFinder] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const botMessage = {
        text: data.message,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, botMessage]);

      // Check if the message contains restaurant-related keywords
      if (data.message.toLowerCase().includes('restaurant') || 
          data.message.toLowerCase().includes('food') ||
          data.message.toLowerCase().includes('eat')) {
        setShowRestaurantFinder(true);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Business AI Assistant</h1>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">{message.text}</div>
            <div className="message-timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message bot-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <form onSubmit={handleSubmit}>
          <div className="input-container-inner">
            <textarea
              className="message-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button type="submit" className="send-button" disabled={!inputMessage.trim()}>
              Send
            </button>
          </div>
        </form>

        {messages.length > 0 && <PitchGenerator messages={messages} />}
      </div>

      {showRestaurantFinder && <RestaurantFinder />}
    </div>
  );
};

export default ChatBot; 