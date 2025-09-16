
import React from 'react';
import PlusIcon from './icons/PlusIcon';
import MapIcon from './icons/MapIcon';
import LogoutIcon from './icons/LogoutIcon';

interface SidebarProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  onClearChat: () => void;
  onBrowseClick: () => void;
  onLogout: () => void;
}

const languages = [
  'English', 'हिन्दी', 'বাংলা', 'తెలుగు', 'मराठी', 'தமிழ்', 
  'ગુજરાતી', 'ಕನ್ನಡ', 'ଓଡ଼ିଆ', 'മലയാളം', 'ਪੰਜਾਬੀ'
];

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedLanguage, 
  onLanguageChange, 
  onClearChat, 
  onBrowseClick,
  onLogout
}) => {
  return (
    <aside className="w-64 bg-[color:var(--color-bg-mid-indigo)]/50 backdrop-blur-md flex-col p-4 border-r border-[color:var(--color-accent-teal)]/20 shadow-lg hidden md:flex">
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-10 w-10">
          <svg 
            viewBox="0 0 64 64" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-full h-full" 
            aria-label="NeerAI Logo"
          >
            <defs>
              <linearGradient id="logoGradientSidebar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-accent-teal)" />
                <stop offset="100%" stopColor="#302B63" />
              </linearGradient>
            </defs>
            <path 
              d="M32 2C16.5 2 4 17.5 4 32c0 14.5 24 30 25.8 31.4a4 4 0 004.4 0C36 62 60 46.5 60 32 60 17.5 47.5 2 32 2z"
              fill="url(#logoGradientSidebar)"
            />
            <path 
              d="M23 42 V 22 h 6 l 10 12 V 22 h 6 v 20 h -6 l -10 -12 v 12 z"
              fill="var(--color-text-primary)"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[color:var(--color-text-primary)]">NeerAI</h1>
          <p className="text-xs text-[color:var(--color-text-secondary)]">Groundwater Assistant</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col space-y-2">
        <button
          onClick={onClearChat}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-[color:var(--color-text-secondary)] bg-[color:var(--color-bg-light-indigo)]/40 rounded-md hover:bg-[color:var(--color-bg-light-indigo)]/80 hover:text-[color:var(--color-text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--color-accent-teal)] focus:ring-offset-[color:var(--color-bg-mid-indigo)]"
        >
          <PlusIcon />
          New Chat
        </button>
        <button
          onClick={onBrowseClick}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-[color:var(--color-text-secondary)] bg-[color:var(--color-bg-light-indigo)]/40 rounded-md hover:bg-[color:var(--color-bg-light-indigo)]/80 hover:text-[color:var(--color-text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--color-accent-teal)] focus:ring-offset-[color:var(--color-bg-mid-indigo)]"
        >
          <MapIcon />
          Browse States
        </button>
      </nav>

      <div className="mt-auto space-y-4">
        <div>
            <label htmlFor="language-select" className="text-xs font-medium text-[color:var(--color-text-secondary)] px-1">Language</label>
            <select
                id="language-select"
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="w-full mt-1 text-sm font-medium bg-[color:var(--color-bg-light-indigo)] border-[color:var(--color-accent-teal)]/20 rounded-md p-2 focus:ring-2 focus:ring-[color:var(--color-accent-teal)] cursor-pointer text-[color:var(--color-text-primary)]"
                aria-label="Select language"
            >
                {languages.map(lang => (
                    <option key={lang} value={lang} className="bg-[color:var(--color-bg-deep-indigo)] text-[color:var(--color-text-primary)]">{lang}</option>
                ))}
            </select>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-[color:var(--color-text-secondary)] bg-[color:var(--color-bg-light-indigo)]/40 rounded-md hover:bg-[color:var(--color-bg-light-indigo)]/80 hover:text-[color:var(--color-text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--color-accent-teal)] focus:ring-offset-[color:var(--color-bg-mid-indigo)]"
        >
          <LogoutIcon />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;