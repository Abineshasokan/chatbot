

import React, { useState, useEffect, useRef } from 'react';
import SendIcon from './icons/SendIcon';
import ButtonSpinner from './icons/ButtonSpinner';
import MicrophoneIcon from './icons/MicrophoneIcon';

// For browser compatibility
const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, disabled }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any | null>(null);
  const [speechSupport, setSpeechSupport] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [text]);

  // Initialize speech recognition only once on component mount
  useEffect(() => {
    if (!SpeechRecognitionAPI) {
      setSpeechSupport(false);
      return;
    }
    
    setSpeechSupport(true);
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true; // Allows for longer pauses
    recognition.interimResults = false; // We only care about the final result

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        // Use a functional update to correctly append the new transcript
        // to the existing text, preventing stale state issues.
        setText(prevText => (prevText.trim() ? prevText.trim() + ' ' : '') + finalTranscript.trim());
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    }

    recognitionRef.current = recognition;

    // Cleanup function to abort recognition if the component unmounts
    return () => {
      recognitionRef.current?.abort();
    };
  }, []); // Empty dependency array ensures this effect runs only once

  const toggleListening = () => {
    if (isLoading || disabled || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      // onend handler will set isListening to false
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading && !disabled) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 md:p-4">
      <div className="flex items-end space-x-2 bg-[color:var(--color-bg-light-indigo)]/70 border border-[color:var(--color-accent-teal)]/20 rounded-lg p-2 focus-within:ring-2 focus-within:ring-[color:var(--color-accent-teal)] transition-shadow">
        <label htmlFor="chat-input" className="sr-only">Chat message input</label>
        <textarea
          id="chat-input"
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Chat is currently unavailable." : "Ask about groundwater in any Indian state..."}
          className="flex-1 p-2 bg-transparent focus:outline-none resize-none transition-all duration-200 disabled:cursor-not-allowed max-h-36 text-[color:var(--color-text-primary)] placeholder-[color:var(--color-text-secondary)]"
          rows={1}
          disabled={isLoading || disabled}
          aria-label="Chat input"
        />
        <div className="flex items-center space-x-1">
            {speechSupport && (
            <button
                type="button"
                onClick={toggleListening}
                disabled={isLoading || disabled}
                className={`text-[color:var(--color-text-secondary)] rounded-full p-3 h-12 w-12 flex items-center justify-center hover:bg-[color:var(--color-bg-mid-indigo)] disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--color-accent-teal)] focus:ring-offset-[color:var(--color-bg-light-indigo)] ${isListening ? 'bg-red-900/50 text-red-500' : ''}`}
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                title={isListening ? 'Stop listening' : 'Start voice input'}
            >
                <MicrophoneIcon isListening={isListening} />
            </button>
            )}
            <button
                type="submit"
                disabled={isLoading || disabled || !text.trim()}
                className="bg-[color:var(--color-accent-teal)] text-[color:var(--color-bg-deep-indigo)] rounded-full p-3 h-12 w-12 flex items-center justify-center hover:bg-[color:var(--color-accent-light-teal)] disabled:bg-[color:var(--color-accent-teal)]/20 disabled:text-[color:var(--color-accent-teal)]/50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--color-accent-teal)] focus:ring-offset-[color:var(--color-bg-light-indigo)] shadow-lg shadow-cyan-500/20"
                aria-label="Send message"
            >
                {isLoading ? <ButtonSpinner /> : <SendIcon />}
            </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;