
import React from 'react';

const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-t-transparent border-slate-300 ${className || 'h-5 w-5'}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
