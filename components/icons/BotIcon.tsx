
import React from 'react';

const BotIcon: React.FC = () => (
    <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-md bg-transparent">
        <svg 
            viewBox="0 0 64 64" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-full h-full" 
            aria-label="NeerAI Logo"
        >
            <defs>
                <linearGradient id="logoGradientBot" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-accent-teal)" />
                    <stop offset="100%" stopColor="#302B63" />
                </linearGradient>
            </defs>
            <path 
                d="M32 2C16.5 2 4 17.5 4 32c0 14.5 24 30 25.8 31.4a4 4 0 004.4 0C36 62 60 46.5 60 32 60 17.5 47.5 2 32 2z"
                fill="url(#logoGradientBot)"
            />
            <path 
                d="M23 42 V 22 h 6 l 10 12 V 22 h 6 v 20 h -6 l -10 -12 v 12 z"
                fill="#E6E6FA"
            />
        </svg>
    </div>
);

export default BotIcon;