
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
import { SubmissionSuccess } from './components/SubmissionSuccess';
import { supabase } from './supabaseClient';

declare global {
  interface Window {
    phoneEmailListener?: (userObj: PhoneEmailUserObject) => void;
  }
}

type AdminView = 
  | { name: 'ADMIN' }
  | { name: 'FORM', idToEdit?: string }
  | { name: 'DETAIL', idToShow: string };

type AppView = 'LOGIN' | 'PUBLIC_FORM' | 'SUBMISSION_SUCCESS' | 'ADMIN_DASHBOARD';

const App: React.FC = () => {
    // Top-level application view state
    const [appView, setAppView] = useState<AppView>('LOGIN');
    const [lastSubmissionId, setLastSubmissionId] = useState<string | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    
    // State for the Admin Dashboard's internal navigation
    const [adminView, setAdminView] = useState<AdminView>({ name: 'ADMIN' });
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    
    // Shared state for the admission form (used by public and admin)
    const [verifiedUser, setVerifiedUser] = useState<VerifiedUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSubmissions = useCallback(async () => {
        setIsFetching(true);
        setFetchError(null);
        const { data, error } = await supabase
            .from('AdmissionTabel')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching submissions:', error);
            const errorMessage = `Failed to fetch submissions: ${error.message}. Please check your connection or contact support if the problem persists.`;
            setFetchError(errorMessage);
        } else {
            setSubmissions(data || []);
        }
        setIsFetching(false);
    }, []);

    useEffect(() => {
        if (appView === 'ADMIN_DASHBOARD') {
            fetchSubmissions();
        }
    }, [appView, fetchSubmissions]);

    useEffect(() => {
        const needsPhoneAuth = appView === 'PUBLIC_FORM' || (appView === 'ADMIN_DASHBOARD' && adminView.name === 'FORM' && !adminView.idToEdit);

        if (!needsPhoneAuth) {
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
    }, [appView, adminView]);
    
    const resetFormState = () => {
        setVerifiedUser(null);
        setError(null);
        setIsLoading(false);
    };

    const handleLogin = (email: string, pass: string) => {
        if (email === 'ikram.knit@gmail.com' && pass === 'Ikram@123') {
            setAppView('ADMIN_DASHBOARD');
            setLoginError(null);
        } else {
            setLoginError('Invalid email or password.');
        }
    };

    const handleLogout = () => {
        setAppView('LOGIN');
        setAdminView({ name: 'ADMIN' });
        resetFormState();
    };

    const handleBackToAdmin = () => {
        setAdminView({ name: 'ADMIN' });
        resetFormState();
    };

    const handleAddNew = () => setAdminView({ name: 'FORM' });
    const handleEdit = (id: string) => setAdminView({ name: 'FORM', idToEdit: id });
    const handleView = (id: string) => setAdminView({ name: 'DETAIL', idToShow: id });

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
            const { error } = await supabase.from('AdmissionTabel').delete().eq('id', id);
            if (error) {
                alert('Error deleting submission: ' + error.message);
            } else {
                fetchSubmissions();
            }
        }
    };
    
    const handleFormSubmit = async (formData: Omit<Submission, 'id' | 'created_at'>, editingId?: string) => {
        if (editingId) {
            const { data, error } = await supabase.from('AdmissionTabel').update(formData).eq('id', editingId).select();
            if (error) throw new Error(`Failed to update submission: ${error.message}`);
            if (!data || data.length === 0) throw new Error('Update failed. The submission could not be found or no data was changed.');
            
            await fetchSubmissions();
            setAdminView({ name: 'ADMIN' });

        } else {
            const { error } = await supabase.from('AdmissionTabel').insert([formData]);
            if (error) throw new Error(`Failed to create submission: ${error.message}`);

            if (appView === 'PUBLIC_FORM') {
                setLastSubmissionId(formData.submission_id);
                setAppView('SUBMISSION_SUCCESS');
            } else {
                await fetchSubmissions();
                setAdminView({ name: 'ADMIN' });
            }
        }
        resetFormState();
    };

    const handleBackup = async () => {
        const { data, error } = await supabase.from('AdmissionTabel').select('*');
        if (error) throw new Error(`Backup failed: ${error.message}`);
        if (!data || data.length === 0) throw new Error('No data to back up.');

        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const date = new Date().toISOString().split('T')[0];
        link.download = `admission_backup_${date}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleRestore = async (fileContent: string) => {
        let submissionsToRestore: Submission[];
        try {
            submissionsToRestore = JSON.parse(fileContent);
            if (!Array.isArray(submissionsToRestore)) {
                throw new Error("Backup file is not a valid JSON array.");
            }
        } catch (parseError) {
             throw new Error(`Failed to parse backup file: ${parseError instanceof Error ? parseError.message : 'Invalid format'}`);
        }

        const { error: deleteError } = await supabase.from('AdmissionTabel').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (deleteError) {
            throw new Error(`Failed to clear existing data: ${deleteError.message}`);
        }
        
        if (submissionsToRestore.length > 0) {
            const { error: insertError } = await supabase.from('AdmissionTabel').insert(submissionsToRestore);
            if (insertError) {
                throw new Error(`Failed to insert restored data: ${insertError.message}. The database may be empty.`);
            }
        }
        
        await fetchSubmissions();
    };


    const renderAdminDashboard = () => {
        switch (adminView.name) {
            case 'DETAIL':
                const detailData = submissions.find(s => s.id === adminView.idToShow);
                return detailData ? <SubmissionDetailView data={detailData} onBackToAdmin={handleBackToAdmin} /> : <div>Submission not found.</div>;
            
            case 'FORM':
                const initialData = adminView.idToEdit ? submissions.find(s => s.id === adminView.idToEdit) : undefined;
                if (initialData) { // Admin editing
                    return <AdmissionForm user={initialData.user_data} onFormSubmit={handleFormSubmit} initialData={initialData} onCancel={handleBackToAdmin} />;
                }
                
                // Admin "Add New"
                if (isLoading) return <LoadingSpinner />;
                if (error) return <ErrorDisplay message={error} suggestion="Please try signing in again." />;
                if (verifiedUser) return <AdmissionForm user={verifiedUser} onFormSubmit={handleFormSubmit} onCancel={handleBackToAdmin}/>;

                return (
                    <div className="text-center space-y-8">
                        <div>
                             <h1 className="text-3xl font-bold text-slate-900">Phone Verification</h1>
                            <p className="text-slate-600 mt-2">Sign in to add a new application. The verified number will be saved with the submission.</p>
                        </div>
                        <div className="flex justify-center"><div className="pe_signin_button" data-client-id="18916899238123945181"></div></div>
                        <div className="min-h-[180px] flex items-center justify-center"><InitialState /></div>
                    </div>
                );

            case 'ADMIN':
            default:
                if (isFetching) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;
                if (fetchError) {
                    return (
                        <div className="text-center p-8">
                            <ErrorDisplay message={fetchError} />
                            <button onClick={fetchSubmissions} className="mt-6 px-4 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold rounded-lg">Try Again</button>
                        </div>
                    );
                }
                return <AdminPage submissions={submissions} onAddNew={handleAddNew} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} onBackup={handleBackup} onRestore={handleRestore} />;
        }
    };
    
    const renderPublicForm = () => {
        const formContent = () => {
            if (isLoading) return <LoadingSpinner />;
            if (error) return <ErrorDisplay message={error} suggestion="Please try signing in again." />;
            if (verifiedUser) {
                return <AdmissionForm user={verifiedUser} onFormSubmit={handleFormSubmit} onCancel={() => setAppView('LOGIN')}/>;
            }
            return <InitialState />;
        };

        return (
             <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
                 <div className="w-full max-w-4xl">
                    <Header />
                    <main className="w-full mx-auto py-8">
                        <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 space-y-8">
                            <div className="text-center space-y-8">
                                {!verifiedUser && (
                                    <>
                                        <div>
                                            <h1 className="text-3xl font-bold text-slate-900">Phone Verification</h1>
                                            <p className="text-slate-600 mt-2">Please sign in to proceed with your application.</p>
                                        </div>
                                        <div className="flex justify-center"><div className="pe_signin_button" data-client-id="18916899238123945181"></div></div>
                                    </>
                                )}
                                <div className="min-h-[180px] flex items-center justify-center">
                                    {formContent()}
                                </div>
                            </div>
                        </div>
                    </main>
                 </div>
            </div>
        );
    };

    switch (appView) {
        case 'LOGIN':
            return <LoginPage onLogin={handleLogin} error={loginError} onGoToPublicForm={() => setAppView('PUBLIC_FORM')} />;
        
        case 'PUBLIC_FORM':
            return renderPublicForm();
        
        case 'SUBMISSION_SUCCESS':
            return <SubmissionSuccess submissionId={lastSubmissionId} onGoHome={() => setAppView('LOGIN')} />;
        
        case 'ADMIN_DASHBOARD':
            return (
                <div className="min-h-screen bg-gray-100">
                    <Header showBackButton={adminView.name !== 'ADMIN'} onBackToAdmin={handleBackToAdmin} onLogout={handleLogout}/>
                    <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                        <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 space-y-8">
                            {renderAdminDashboard()}
                        </div>
                    </main>
                </div>
            );
        default:
            return <LoginPage onLogin={handleLogin} error={loginError} onGoToPublicForm={() => setAppView('PUBLIC_FORM')} />;
    }
};

export default App;
