import React from 'react';
import { Submission, DocumentType } from '../types';

const PrintIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>;

interface DetailSectionProps { title: string; children: React.ReactNode; }
const DetailSection: React.FC<DetailSectionProps> = ({ title, children }) => (
    <fieldset className="border-t border-slate-200 pt-4 mt-6">
        <legend className="text-lg font-semibold text-slate-800 px-2">{title}</legend>
        <div className="p-4 space-y-4">{children}</div>
    </fieldset>
);

interface DetailItemProps { label: string; value?: string | number | null; }
const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-md text-slate-900">{String(value) || 'N/A'}</p>
    </div>
);

const documentLabels: Record<DocumentType, string> = {
    signature: 'Signature', highschoolMarksheet: 'Highschool Marksheet', intermediateMarksheet: 'Intermediate Marksheet',
    aadhar: 'Aadhar Card', domicile: 'Domicile Certificate', transferCertificate: 'Transfer Certificate',
};

interface SubmissionDetailViewProps {
  data: Submission;
  onBackToAdmin: () => void;
}

export const SubmissionDetailView: React.FC<SubmissionDetailViewProps> = ({ data, onBackToAdmin }) => {
    const { user_data, submission_id } = data;
    
    const formattedPhone = `+${user_data.user_country_code.replace(/\+/g, '')} ${user_data.user_phone_number}`;

    return (
        <div className="w-full text-left">
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    .print-container, .print-container * { visibility: visible; }
                    .print-container { position: absolute; left: 0; top: 0; width: 100%; }
                    .no-print { display: none !important; }
                }
            `}</style>

            <div className="no-print flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Application Details</h1>
                    <p className="text-slate-500">Submission ID: {submission_id}</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={onBackToAdmin} className="flex items-center px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors">
                        <BackIcon /> Back
                    </button>
                    <button onClick={() => window.print()} className="flex items-center px-4 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-lg transition-colors">
                       <PrintIcon /> Print to PDF
                    </button>
                </div>
            </div>
            
            <div className="print-container">
                <div className="space-y-6">
                    <DetailSection title="Course Selection">
                        <DetailItem label="Selected Course" value={data.course} />
                    </DetailSection>

                    <DetailSection title="Personal Details">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                <DetailItem label="Verified Phone Number" value={formattedPhone} />
                                <DetailItem label="Candidate Name" value={data.candidate_name} />
                                <DetailItem label="Father's Name" value={data.father_name} />
                                <DetailItem label="Mother's Name" value={data.mother_name} />
                                <DetailItem label="Aadhar Number" value={data.aadhar_number} />
                                <DetailItem label="Sex" value={data.sex} />
                                <DetailItem label="Date of Birth" value={data.dob} />
                                <DetailItem label="Nationality" value={data.nationality} />
                                <DetailItem label="Category" value={data.category} />
                                <DetailItem label="Email" value={data.email} />
                            </div>
                            <div className="flex flex-col items-center">
                                <p className="text-sm font-medium text-slate-500 mb-2">Passport Photograph</p>
                                <div className="w-32 h-40 border border-slate-200 rounded-md flex items-center justify-center bg-slate-50 overflow-hidden">
                                   {data.photo_url ? (
                                        <a href={data.photo_url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                            <img src={data.photo_url} alt="Photograph" className="w-full h-full object-cover" />
                                        </a>
                                    ) : <span className="text-slate-500 text-xs p-2">Not Uploaded</span>}
                                </div>
                            </div>
                        </div>
                    </DetailSection>

                    <DetailSection title="Address Details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-slate-700 mb-2">Postal Address</h4>
                                <DetailItem label="Address Line" value={data.postal_address.line} />
                                <DetailItem label="State" value={data.postal_address.state} />
                                <DetailItem label="District" value={data.postal_address.district} />
                            </div>
                             <div>
                                <h4 className="font-semibold text-slate-700 mb-2">Permanent Address</h4>
                                <DetailItem label="Address Line" value={data.permanent_address.line} />
                                <DetailItem label="State" value={data.permanent_address.state} />
                                <DetailItem label="District" value={data.permanent_address.district} />
                            </div>
                        </div>
                    </DetailSection>

                    <DetailSection title="Academic Qualifications">
                        {data.academic_records.map((rec, index) => (
                            <div key={rec.id} className={`p-3 rounded-lg bg-slate-50 ${index > 0 ? 'mt-4' : ''}`}>
                                <h4 className="font-semibold text-slate-700 mb-2">{`Qualification #${index + 1}`}</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    <DetailItem label="Exam" value={rec.examPassed} />
                                    <DetailItem label="Institution" value={rec.institution} />
                                    <DetailItem label="Board/University" value={rec.boardUniv} />
                                    <DetailItem label="Year" value={rec.year} />
                                    <DetailItem label="Max Marks" value={rec.maxMarks} />
                                    <DetailItem label="Obtained Marks" value={rec.obtainedMarks} />
                                    <DetailItem label="Percentage" value={rec.percentage ? `${rec.percentage}%` : 'N/A'} />
                                </div>
                            </div>
                        ))}
                    </DetailSection>

                    <DetailSection title="Uploaded Documents">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {Object.entries(data.documents_urls).map(([key, value]) => (
                                <div key={key} className="text-center">
                                    <p className="text-sm font-medium text-slate-500 mb-2">{documentLabels[key as DocumentType]}</p>
                                    <div className="w-full h-32 border border-slate-200 rounded-md flex items-center justify-center bg-slate-50 overflow-hidden">
                                        {value ? (
                                            <a href={value} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                                <img src={value} alt={`${key} preview`} className="w-full h-full object-contain p-1" />
                                            </a>
                                        ) : <span className="text-slate-500 text-xs p-2">Not Uploaded</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DetailSection>
                </div>
            </div>
        </div>
    );
};