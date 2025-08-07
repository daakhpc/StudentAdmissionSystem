import React from 'react';

const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>;
const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>;
const WebIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.72 7.97 5 10 5c2.03 0 3.488.72 4.756 1.321l.127.058a.5.5 0 01-.001.99l-.128-.057C13.488 6.72 12.03 6 10 6c-1.551 0-2.75.588-3.668 1.134a.5.5 0 01-.664-.663z" clipRule="evenodd" /></svg>;
const AddressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>;

interface HeaderProps {
    showBackButton?: boolean;
    onBackToAdmin?: () => void;
    onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ showBackButton, onBackToAdmin, onLogout }) => {
    return (
        <header className="bg-white p-6 shadow-md border-b border-gray-200 relative">
            <div className="max-w-7xl mx-auto">
                {showBackButton && (
                     <div className="absolute top-0 left-0 h-full flex items-center pl-4 sm:pl-6">
                        <button onClick={onBackToAdmin} className="flex items-center px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-sm">
                            <BackIcon />
                            Admin Dashboard
                        </button>
                    </div>
                )}
                 {onLogout && (
                    <div className="absolute top-0 right-0 h-full flex items-center pr-4 sm:pr-6">
                        <button onClick={onLogout} className="flex items-center px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-700 font-semibold rounded-lg transition-colors text-sm">
                            <LogoutIcon />
                            Logout
                        </button>
                    </div>
                )}
                <div className="text-center mb-4">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Dr APJ Abdul Kalam Educational Institute</h1>
                    <p className="text-slate-600 mt-1 text-sm sm:text-lg">
                        Affiliated with: Homeopathic Medicine Board Lucknow Uttar Pradesh, SCVT Lucknow & NCVT New Delhi
                    </p>
                </div>
                <div className="mt-6 border-t border-slate-200 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-center md:text-left text-slate-700">
                        <div className="flex items-center justify-center md:justify-start"><PhoneIcon /><span>Contact No: 8958963106</span></div>
                        <div className="flex items-center justify-center md:justify-start"><EmailIcon /><span>Email: daakhpc@gmail.com</span></div>
                        <div className="flex items-center justify-center md:justify-start"><WebIcon /><span>Website: www.daakhpc.com</span></div>
                        <div className="flex items-center justify-center md:justify-start"><AddressIcon /><span className="flex-1">6 Km From Govt Hospital Dabki Road, Village Ghoghreki, Saharanpur UP-247001</span></div>
                    </div>
                </div>
            </div>
        </header>
    );
};