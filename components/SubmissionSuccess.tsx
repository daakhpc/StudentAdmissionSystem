
import React from 'react';

interface SubmissionSuccessProps {
    submissionId: string | null;
    onGoHome: () => void;
}

const CheckCircleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({ submissionId, onGoHome }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 space-y-6 text-center">
                <div className="flex justify-center mb-4">
                    <CheckCircleIcon />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Submission Successful!</h1>
                <p className="text-slate-600">Your application has been received. Please make a note of your submission ID for future reference.</p>
                
                {submissionId && (
                    <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-600 font-medium">Your Submission ID is:</p>
                        <p className="text-2xl font-bold text-brand-blue tracking-wider mt-1">{submissionId}</p>
                    </div>
                )}
                
                <button
                    onClick={onGoHome}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-dark transition-transform transform hover:scale-105"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};
