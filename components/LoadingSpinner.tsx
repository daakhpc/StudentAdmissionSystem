
import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-4" aria-live="polite">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-blue"></div>
    <p className="text-slate-600 text-lg">Verifying your details...</p>
  </div>
);