import React, { useState } from 'react';

interface LoginPageProps {
    onLogin: (email: string, pass: string) => void;
    error: string | null;
}

const LockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);


export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
             <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 space-y-6">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                       <LockIcon />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Admin Login</h1>
                    <p className="text-slate-500 mt-2">Please sign in to access the dashboard.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="w-full bg-white border border-slate-300 rounded-md p-3 text-slate-900 focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-slate-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="w-full bg-white border border-slate-300 rounded-md p-3 text-slate-900 focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4" role="alert">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-dark transition-transform transform hover:scale-105"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
             </div>
        </div>
    );
};