
import React from 'react';

const UserIcon: React.FC = () => (
    <div className="w-10 h-10 rounded-full bg-[color:var(--color-bg-mid-indigo)]/50 flex-shrink-0 flex items-center justify-center shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[color:var(--color-text-secondary)]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
);

export default UserIcon;