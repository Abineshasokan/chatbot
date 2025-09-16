import React from 'react';

interface SuggestedQueriesProps {
  suggestions: string[];
  onQuery: (query: string) => void;
}

const SuggestedQueries: React.FC<SuggestedQueriesProps> = ({ suggestions, onQuery }) => {
  return (
    <div className="mt-3 pt-3 border-t border-[color:var(--color-accent-teal)]/20 flex flex-wrap gap-2">
      {suggestions.map((query, index) => (
        <button
          key={index}
          onClick={() => onQuery(query)}
          className="px-3 py-1.5 bg-[color:var(--color-bg-light-indigo)]/50 rounded-full text-[color:var(--color-accent-light-teal)] text-sm font-medium hover:bg-[color:var(--color-bg-light-indigo)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--color-accent-teal)] focus:ring-offset-[color:var(--color-bg-mid-indigo)]"
        >
          {query}
        </button>
      ))}
    </div>
  );
};

export default SuggestedQueries;