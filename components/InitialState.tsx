
import React from 'react';

const FingerPrintIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.78-2.75 9.565M12 11c-1.34 0-2.58.338-3.687.942m8.374 0c.113-.34.214-.685.303-1.036M12 11c.63 0 1.233-.079 1.804-.231M12 11a9.043 9.043 0 01-4.425-1.125M19.25 10.5a9.027 9.027 0 00-4.425-1.125M12 11a9.027 9.027 0 00-4.425 1.125M12 11a9.043 9.043 0 004.425 1.125m-8.85 3.435C5.042 16.326 4 13.791 4 11c0-4.418 4.03-8 9-8s9 3.582 9 8c0 2.791-1.042 5.326-2.75 7.125" />
    </svg>
);


export const InitialState: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-4 text-center">
    <FingerPrintIcon />
    <h3 className="text-xl font-semibold text-slate-900">Verification Required</h3>
    <p className="text-slate-600 max-w-xs">Please sign in using the button above to securely verify your phone number.</p>
  </div>
);