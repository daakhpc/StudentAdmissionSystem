import React from 'react';
import { Submission } from '../types';

const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const ViewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;


interface AdminPageProps {
  submissions: Submission[];
  onAddNew: () => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ submissions, onAddNew, onView, onEdit, onDelete }) => {
    return (
        <div className="w-full">
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

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3 hidden md:table-cell">Father's Name</th>
                            <th scope="col" className="px-6 py-3 hidden lg:table-cell">Mobile No.</th>
                            <th scope="col" className="px-6 py-3 hidden sm:table-cell">Course</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.length > 0 ? (
                            submissions.map(sub => {
                                const formattedPhone = `+${sub.user_data.user_country_code.replace(/\+/g, '')} ${sub.user_data.user_phone_number}`;
                                return (
                                <tr key={sub.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{sub.submission_id}</td>
                                    <td className="px-6 py-4">{sub.candidate_name}</td>
                                    <td className="px-6 py-4 hidden md:table-cell">{sub.father_name}</td>
                                    <td className="px-6 py-4 hidden lg:table-cell">{formattedPhone}</td>
                                    <td className="px-6 py-4 hidden sm:table-cell">{sub.course}</td>
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
                                    No submissions found. Click "Add New Application" to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};