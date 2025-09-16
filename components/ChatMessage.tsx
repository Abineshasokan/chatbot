

import React from 'react';
import { Message, Sender } from '../types';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';
import GroundwaterChart from './GroundwaterChart';
import SuggestedQueries from './SuggestedQueries';

interface ChatMessageProps {
  message: Message;
  onSuggestionClick: (query: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSuggestionClick }) => {
  const isBot = message.sender === Sender.Bot;

  const renderText = (text: string) => {
    if (!text) return null;
    // Improved regex to handle various markdown elements including lists
    const parts = text.split(/(\n\s*\*.*)/s);
    return parts.map((part, index) => {
        if (part.match(/^\n\s*\*/)) {
            const listItems = part.trim().split(/\n\s*\*/).filter(Boolean);
            return (
                <ul key={index} className="space-y-1 list-disc list-inside">
                    {listItems.map((item, i) => <li key={i}>{renderStyledText(item.trim())}</li>)}
                </ul>
            );
        }
        return <span key={index}>{renderStyledText(part)}</span>;
    });
  };

  const renderStyledText = (text: string) => {
    const segments = text.split(/(\*\*.*?\*\*|`.*?`)/g).filter(Boolean);
    return segments.map((segment, i) => {
        if (segment.startsWith('**') && segment.endsWith('**')) {
            return <strong key={i} className="text-[color:var(--color-text-primary)]">{segment.slice(2, -2)}</strong>;
        }
        if (segment.startsWith('`') && segment.endsWith('`')) {
            return <code key={i} className="bg-[color:var(--color-bg-light-indigo)]/60 text-[color:var(--color-accent-light-teal)] rounded px-1 py-0.5 text-sm font-mono">{segment.slice(1, -1)}</code>;
        }
        return <span key={i}>{segment}</span>;
    });
  }

  return (
    <div className={`flex items-start gap-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && <div aria-hidden="true"><BotIcon /></div>}
      <div
        className={`max-w-xl p-4 rounded-2xl shadow-lg ${
          isBot
            ? 'bg-[color:var(--color-bg-mid-indigo)]/50 text-[color:var(--color-text-secondary)] rounded-tl-none border border-[color:var(--color-accent-teal)]/20 backdrop-blur-sm'
            : 'bg-[color:var(--color-accent-teal)]/80 text-[color:var(--color-bg-deep-indigo)] rounded-br-none shadow-cyan-500/20'
        }`}
      >
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-[color:var(--color-text-primary)]">
            {renderText(message.text)}
        </div>
        {message.chartData && message.chartData.length > 0 && (
          <GroundwaterChart data={message.chartData} comparisonStates={message.comparisonStates} />
        )}
        {message.suggestions && message.suggestions.length > 0 && (
            <SuggestedQueries suggestions={message.suggestions} onQuery={onSuggestionClick} />
        )}
      </div>
      {!isBot && <div aria-hidden="true"><UserIcon /></div>}
    </div>
  );
};

export default ChatMessage;