import React, { useState, useEffect, useCallback } from 'react';
import { VerifiedUser, PhoneEmailUserObject, Submission } from './types';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { InitialState } from './components/InitialState';
import { AdmissionForm } from './components/AdmissionForm';
import { Header } from './components/Header';
import { SubmissionDetailView } from './components/SubmissionDetailView';
import { AdminPage } from './components/AdminPage';
import { LoginPage } from './components/LoginPage';
import { supabase } from './supabaseClient';

declare global {
  interface Window {
    phoneEmailListener?: (userObj: PhoneEmailUserObject) => void;
  }
}

type View = 
  | { name: 'ADMIN' }
  | { name: 'FORM', idToEdit?: string }
  | { name: 'DETAIL', idToShow: string };

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const [view, setView] = useState<View>({ name: 'ADMIN' });
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    
    const [verifiedUser, setVerifiedUser] = useState<VerifiedUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSubmissions = useCallback(async () => {
        setIsFetching(true);
        const { data, error } = await supabase
            .from('AdmissionTabel')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching submissions:', error);
            alert('Could not fetch submission data.');
        } else {
            setSubmissions(data || []);
        }
        setIsFetching(false);
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetchSubmissions();
        }
    }, [isLoggedIn, fetchSubmissions]);

    useEffect(() => {
        if (!isLoggedIn || view.name !== 'FORM' || (view.name === 'FORM' && view.idToEdit)) {
            return; 
        }

        const handleVerification = async (userObj: PhoneEmailUserObject) => {
            setIsLoading(true);
            setError(null);
            setVerifiedUser(null);
            try {
                const response = await fetch(userObj.user_json_url);
                if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
                const data: VerifiedUser = await response.json();
                setVerifiedUser(data);
            } catch (err) {
                const msg = err instanceof Error ? err.message : "An unknown error occurred.";
                setError(msg);
            } finally {
                setIsLoading(false);
            }
        };

        window.phoneEmailListener = handleVerification;
        const scriptId = 'phone-email-signin-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://www.phone.email/sign_in_button_v1.js';
            script.async = true;
            document.body.appendChild(script);
        }

        return () => {
            delete window.phoneEmailListener;
            const script = document.getElementById(scriptId);
            if (script && script.parentElement) {
                script.parentElement.removeChild(script);
            }
        };
    }, [view, isLoggedIn]);
    
    const resetFormState = () => {
        setVerifiedUser(null);
        setError(null);
        setIsLoading(false);
    };

    const handleLogin = (email: string, pass: string) => {
        if (email === 'ikram.knit@gmail.com' && pass === 'Ikram@123') {
            setIsLoggedIn(true);
            setLoginError(null);
        } else {
            setLoginError('Invalid email or password.');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setView({ name: 'ADMIN' });
        resetFormState();
    };

    const handleBackToAdmin = () => {
        setView({ name: 'ADMIN' });
        resetFormState();
    };

    const handleAddNew = () => setView({ name: 'FORM' });
    const handleEdit = (id: string) => setView({ name: 'FORM', idToEdit: id });
    const handleView = (id: string) => setView({ name: 'DETAIL', idToShow: id });

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
            const { error } = await supabase.from('AdmissionTabel').delete().eq('id', id);
            if (error) {
                alert('Error deleting submission: ' + error.message);
            } else {
                fetchSubmissions(); // Re-fetch data
            }
        }
    };
    
    const handleFormSubmit = async (formData: Omit<Submission, 'id' | 'created_at'>, editingId?: string) => {
        if (editingId) {
            const { error } = await supabase
                .from('AdmissionTabel')
                .update(formData)
                .eq('id', editingId);
            
            if (error) {
                alert('Error updating submission: ' + error.message);
                return;
            }
        } else {
            const { error } = await supabase.from('AdmissionTabel').insert([formData]);
             if (error) {
                alert('Error creating submission: ' + error.message);
                return;
            }
        }
        await fetchSubmissions();
        handleBackToAdmin();
    };

    const renderCurrentView = () => {
        switch (view.name) {
            case 'DETAIL':
                const detailData = submissions.find(s => s.id === view.idToShow);
                return detailData ? <SubmissionDetailView data={detailData} onBackToAdmin={handleBackToAdmin} /> : <div>Submission not found.</div>;
            
            case 'FORM':
                const initialData = view.idToEdit ? submissions.find(s => s.id === view.idToEdit) : undefined;
                
                if (initialData) { // Editing mode, bypass phone auth
                    return <AdmissionForm user={initialData.user_data} onFormSubmit={handleFormSubmit} initialData={initialData} onCancel={handleBackToAdmin} />;
                }
                
                // New form mode, requires phone auth
                if (isLoading) return <LoadingSpinner />;
                if (error) return <ErrorDisplay message={error} />;
                if (verifiedUser) return <AdmissionForm user={verifiedUser} onFormSubmit={handleFormSubmit} onCancel={handleBackToAdmin}/>;

                return (
                    <div className="text-center space-y-8">
                        <div>
                             <h1 className="text-3xl font-bold text-slate-900">Phone Verification</h1>
                            <p className="text-slate-600 mt-2">Please sign in to proceed with your application.</p>
                        </div>
                        <div className="flex justify-center">
                            <div className="pe_signin_button" data-client-id="18916899238123945181"></div>
                        </div>
                        <div className="min-h-[180px] flex items-center justify-center">
                            <InitialState />
                        </div>
                     </div>
                );

            case 'ADMIN':
            default:
                if (isFetching) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;
                return <AdminPage submissions={submissions} onAddNew={handleAddNew} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />;
        }
    };

    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} error={loginError} />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header showBackButton={view.name !== 'ADMIN'} onBackToAdmin={handleBackToAdmin} onLogout={handleLogout}/>
            <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 space-y-8">
                    {renderCurrentView()}
                </div>
            </main>
        </div>
    );
};

export default App;