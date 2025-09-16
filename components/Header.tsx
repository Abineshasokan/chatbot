

import React from 'react';
import BotIcon from './icons/BotIcon';
import TrashIcon from './icons/TrashIcon';
import MapIcon from './icons/MapIcon'; 
import LogoutIcon from './icons/LogoutIcon';

interface HeaderProps {
  onClearChat: () => void;
  onBrowseClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClearChat, onBrowseClick, onLogout }) => {
  return (
    <header className="p-3 border-b border-[color:var(--color-accent-teal)]/20 bg-[color:var(--color-bg-mid-indigo)]/50 backdrop-blur-md flex items-center justify-between shadow-lg sticky top-0 z-10 md:hidden">
      <div className="flex items-center space-x-3">
        <BotIcon />
        <div>
          <h1 className="text-lg font-bold text-[color:var(--color-text-primary)]">NeerAI</h1>
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--color-accent-teal)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--color-accent-light-teal)]"></span>
            </span>
            <p className="text-xs font-medium text-[color:var(--color-accent-light-teal)]">Online</p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <button
          onClick={onBrowseClick}
          className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] transition-colors p-2 rounded-full hover:bg-[color:var(--color-bg-light-indigo)]/50"
          aria-label="Browse states"
          title="Browse states"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <button
          onClick={onClearChat}
          className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] transition-colors p-2 rounded-full hover:bg-[color:var(--color-bg-light-indigo)]/50"
          aria-label="New chat"
          title="New chat"
        >
          <TrashIcon />
        </button>
         <button
          onClick={onLogout}
          className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] transition-colors p-2 rounded-full hover:bg-[color:var(--color-bg-light-indigo)]/50"
          aria-label="Logout"
          title="Logout"
        >
          <LogoutIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;