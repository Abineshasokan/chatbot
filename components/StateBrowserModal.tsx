

import React, { useRef, useEffect } from 'react';
import { indianStatesAndUTs } from '../constants/states';
import CloseIcon from './icons/CloseIcon';

interface StateBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectState: (state: string) => void;
}

const StateBrowserModal: React.FC<StateBrowserModalProps> = ({ isOpen, onClose, onSelectState }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Delay focus slightly to ensure modal is rendered and transition completes
      setTimeout(() => closeButtonRef.current?.focus(), 100);

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        } else if (event.key === 'Tab') {
          if (!modalRef.current) return;
          const focusableElements = Array.from(
            modalRef.current.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          );
          
          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey) { // Shift+Tab
            if (document.activeElement === firstElement) {
              lastElement.focus();
              event.preventDefault();
            }
          } else { // Tab
            if (document.activeElement === lastElement) {
              firstElement.focus();
              event.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStateClick = (state: string) => {
    onSelectState(state);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-[color:var(--color-bg-mid-indigo)]/80 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md m-4 transform transition-transform scale-95 border border-[color:var(--color-accent-teal)]/20"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[color:var(--color-accent-teal)]/20">
            <h2 id="modal-title" className="text-lg font-semibold text-[color:var(--color-text-primary)]">Select a State or Union Territory</h2>
            <button 
                ref={closeButtonRef}
                onClick={onClose} 
                className="p-2 rounded-full hover:bg-[color:var(--color-bg-light-indigo)]/50 transition-colors"
                aria-label="Close modal"
            >
                <CloseIcon />
            </button>
        </div>
        <div className="p-2 max-h-[60vh] overflow-y-auto">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
                {indianStatesAndUTs.map(state => (
                    <li key={state}>
                        <button 
                            onClick={() => handleStateClick(state)}
                            className="w-full text-left px-4 py-3 rounded-lg text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-accent-teal)]/10 hover:text-[color:var(--color-accent-light-teal)] font-medium transition-colors"
                        >
                            {state}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default StateBrowserModal;