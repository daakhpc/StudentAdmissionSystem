
import React, { useState, useRef, useMemo } from 'react';
import { Submission } from '../types';

// Icons
const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const ViewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const BackupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const RestoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const SortAscIcon = () => <svg className="w-4 h-4 inline-block ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>;
const SortDescIcon = () => <svg className="w-4 h-4 inline-block ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;

type SortableKeys = 'submission_id' | 'candidate_name' | 'father_name' | 'course';

interface AdminPageProps {
  submissions: Submission[];
  onAddNew: () => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onBackup: () => Promise<void>;
  onRestore: (content: string) => Promise<void>;
  autoBackupStatus: string | null;
  onDismissAutoBackupStatus: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ submissions, onAddNew, onView, onEdit, onDelete, onBackup, onRestore, autoBackupStatus, onDismissAutoBackupStatus }) => {
    // Data Management State
    const [backupStatus, setBackupStatus] = useState<string | null>(null);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [restoreStatus, setRestoreStatus] = useState<string | null>(null);
    const [isRestoring, setIsRestoring] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Table Interaction State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCourse, setFilterCourse] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'ascending' | 'descending' } | null>({ key: 'submission_id', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const courseOptions = useMemo(() => {
        const courses = new Set(submissions.map(s => s.course));
        return Array.from(courses);
    }, [submissions]);
    
    const filteredAndSortedSubmissions = useMemo(() => {
        let sortableItems = [...submissions];

        if (filterCourse) {
            sortableItems = sortableItems.filter(sub => sub.course === filterCourse);
        }

        if (searchTerm) {
            const lowercasedFilter = searchTerm.toLowerCase();
            sortableItems = sortableItems.filter(sub =>
                sub.submission_id.toLowerCase().includes(lowercasedFilter) ||
                sub.candidate_name.toLowerCase().includes(lowercasedFilter) ||
                sub.father_name.toLowerCase().includes(lowercasedFilter)
            );
        }

        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const key = sortConfig.key;
                const aValue = a[key];
                const bValue = b[key];

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

        return sortableItems;
    }, [submissions, searchTerm, filterCourse, sortConfig]);

    const requestSort = (key: SortableKeys) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const getSortIndicator = (key: SortableKeys) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? <SortAscIcon /> : <SortDescIcon />;
    };

    const totalPages = Math.ceil(filteredAndSortedSubmissions.length / ITEMS_PER_PAGE);
    const paginatedSubmissions = filteredAndSortedSubmissions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const resultStart = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const resultEnd = Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedSubmissions.length);


    const handleBackupClick = async () => {
        setIsBackingUp(true);
        setBackupStatus('Backing up...');
        try {
            await onBackup();
            setBackupStatus('Backup complete! File downloaded.');
        } catch (error) {
            setBackupStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsBackingUp(false);
            setTimeout(() => setBackupStatus(null), 5000);
        }
    };
    
    const handleRestoreClick = () => {
        setRestoreStatus(null);
        fileInputRef.current?.click();
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!window.confirm('Are you sure you want to restore from this backup? This will DELETE all current data and replace it. This action cannot be undone.')) {
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setIsRestoring(true);
        setRestoreStatus('Reading file and restoring...');
        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target?.result as string;
            try {
                await onRestore(content);
                setRestoreStatus('Restore successful! Data reloaded.');
            } catch (error) {
                setRestoreStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
                setIsRestoring(false);
                if (fileInputRef.current) fileInputRef.current.value = "";
                setTimeout(() => setRestoreStatus(null), 5000);
            }
        };
        reader.onerror = () => {
            setIsRestoring(false);
            setRestoreStatus('Error: Could not read the selected file.');
            if (fileInputRef.current) fileInputRef.current.value = "";
        };
        reader.readAsText(file);
    };

    return (
        <div className="w-full">
            {autoBackupStatus && (
                <div className={`p-4 mb-6 rounded-md relative shadow ${autoBackupStatus.includes('failed') ? 'bg-red-100 border-l-4 border-red-500 text-red-700' : 'bg-blue-100 border-l-4 border-blue-500 text-blue-700'}`} role="alert">
                    <p className="font-bold">{autoBackupStatus.includes('failed') ? 'Backup Error' : 'System Notice'}</p>
                    <p>{autoBackupStatus}</p>
                    <button onClick={onDismissAutoBackupStatus} className="absolute top-2 right-3 text-2xl font-bold leading-none" aria-label="Close">&times;</button>
                </div>
            )}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-600 mt-1">Manage all student applications.</p>
                </div>
                <button onClick={onAddNew} className="flex items-center justify-center px-4 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-lg transition-colors shadow-sm">
                    <AddIcon />
                    Add New Application
                </button>
            </div>

            <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">Search Applications</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                               <SearchIcon />
                            </div>
                            <input
                                type="text"
                                id="search"
                                placeholder="Search by ID, name, or father's name..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full border-slate-300 rounded-md shadow-sm pl-10 p-2 focus:ring-brand-blue focus:border-brand-blue"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="filterCourse" className="block text-sm font-medium text-slate-700 mb-1">Filter by Course</label>
                        <select
                            id="filterCourse"
                            value={filterCourse}
                            onChange={(e) => { setFilterCourse(e.target.value); setCurrentPage(1); }}
                            className="w-full border-slate-300 rounded-md shadow-sm p-2 focus:ring-brand-blue focus:border-brand-blue"
                        >
                            <option value="">All Courses</option>
                            {courseOptions.map(course => <option key={course} value={course}>{course}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            {(['submission_id', 'candidate_name', 'father_name', 'course'] as SortableKeys[]).map(key => (
                                <th key={key} scope="col" className={`px-6 py-3 ${key === 'father_name' ? 'hidden md:table-cell' : ''} ${key === 'course' ? 'hidden sm:table-cell' : ''}`}>
                                    <button onClick={() => requestSort(key)} className="flex items-center font-bold">
                                        {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        {getSortIndicator(key)}
                                    </button>
                                </th>
                            ))}
                             <th scope="col" className="px-6 py-3 hidden lg:table-cell">Mobile No.</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedSubmissions.length > 0 ? (
                            paginatedSubmissions.map(sub => {
                                const formattedPhone = `+${sub.user_data.user_country_code.replace(/\+/g, '')} ${sub.user_data.user_phone_number}`;
                                return (
                                <tr key={sub.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{sub.submission_id}</td>
                                    <td className="px-6 py-4">{sub.candidate_name}</td>
                                    <td className="px-6 py-4 hidden md:table-cell">{sub.father_name}</td>
                                    <td className="px-6 py-4 hidden sm:table-cell">{sub.course}</td>
                                    <td className="px-6 py-4 hidden lg:table-cell">{formattedPhone}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button onClick={() => onView(sub.id)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" title="View/Print"><ViewIcon /></button>
                                            <button onClick={() => onEdit(sub.id)} className="p-2 text-green-600 hover:bg-green-100 rounded-full" title="Edit"><EditIcon /></button>
                                            <button onClick={() => onDelete(sub.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full" title="Delete"><DeleteIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            )})
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-500">
                                    No submissions match your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-slate-700">
                        Showing {resultStart}-{resultEnd} of {filteredAndSortedSubmissions.length} results
                    </span>
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-l-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-sm font-medium text-slate-900 bg-white border-t border-b border-slate-200">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-r-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-12 border-t pt-8">
                <h2 className="text-2xl font-bold text-slate-800">Data Management</h2>
                <p className="text-slate-500 mt-1 mb-4">Backup all application data to a file or restore from a backup.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-slate-50">
                    <div>
                        <h3 className="font-semibold text-slate-700">Backup Data</h3>
                        <p className="text-sm text-slate-600 mb-3">Download a complete JSON file of all submissions.</p>
                        <button 
                            onClick={handleBackupClick} 
                            disabled={isBackingUp || isRestoring}
                            className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                            <BackupIcon />
                            {isBackingUp ? 'Backing up...' : 'Backup All Data'}
                        </button>
                        {backupStatus && <p className={`mt-2 text-sm ${backupStatus.includes('Error') ? 'text-red-600' : 'text-slate-600'}`}>{backupStatus}</p>}
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-700">Restore Data</h3>
                        <p className="text-sm text-slate-600 mb-3">Restore from a JSON backup file. <span className="font-bold text-red-600">This will overwrite all current data.</span></p>
                        <button 
                            onClick={handleRestoreClick} 
                            disabled={isRestoring || isBackingUp}
                            className="flex items-center justify-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                            <RestoreIcon />
                            {isRestoring ? 'Restoring...' : 'Restore from Backup'}
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".json" />
                        {restoreStatus && <p className={`mt-2 text-sm ${restoreStatus.includes('Error') ? 'text-red-600' : 'text-slate-600'}`}>{restoreStatus}</p>}
                    </div>
                </div>
            </div>

        </div>
    );
};
