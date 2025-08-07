
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ExclamationIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center space-y-4 text-center" role="alert">
    <ExclamationIcon />
    <h3 className="text-xl font-semibold text-red-500">An Error Occurred</h3>
    <p className="text-slate-600 max-w-sm">{message}</p>
    <p className="text-slate-500 text-sm">Please try signing in again.</p>
  </div>
);