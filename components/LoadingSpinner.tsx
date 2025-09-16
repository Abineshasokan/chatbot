
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex space-x-1">
        <div className="w-2 h-2 bg-[color:var(--color-text-secondary)] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-[color:var(--color-text-secondary)] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        <div className="w-2 h-2 bg-[color:var(--color-text-secondary)] rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
    </div>
  );
};

export default LoadingSpinner;