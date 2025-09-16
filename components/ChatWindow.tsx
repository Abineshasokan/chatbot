
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import ChatMessage from './ChatMessage';
import LoadingSpinner from './LoadingSpinner';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSuggestionClick: (query: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSuggestionClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto p-4 md:p-6 space-y-6" role="log" aria-live="polite">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} onSuggestionClick={onSuggestionClick} />
      ))}
      {isLoading && (
        <div className="flex justify-start">
            <div className="flex items-center space-x-3">
                <div className="bg-gray-200 dark:bg-slate-700 p-3 rounded-full">
                   <LoadingSpinner />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;