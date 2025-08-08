import React from 'react';
import { Submission, DocumentType } from '../types';

const PrintIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>;

// Icons for print header
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>;
const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>;
const WebIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.72 7.97 5 10 5c2.03 0 3.488.72 4.756 1.321l.127.058a.5.5 0 01-.001.99l-.128-.057C13.488 6.72 12.03 6 10 6c-1.551 0-2.75.588-3.668 1.134a.5.5 0 01-.664-.663z" clipRule="evenodd" /></svg>;
const AddressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;


interface DetailSectionProps { title: string; children: React.ReactNode; }
const DetailSection: React.FC<DetailSectionProps> = ({ title, children }) => (
    <fieldset className="border-t border-slate-300 pt-4 mt-6">
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

const PrintHeader = () => (
    <div className="print:block border-b-2 border-slate-900 pb-4 mb-6 text-slate-900">
        <div className="text-center mb-4">
            <h1 className="text-3xl font-bold">Dr APJ Abdul Kalam Educational Institute</h1>
            <p className="text-slate-700 mt-1 text-base">
                Affiliated with: Homeopathic Medicine Board Lucknow Uttar Pradesh, SCVT Lucknow & NCVT New Delhi
            </p>
        </div>
        <div className="mt-4 border-t border-slate-300 pt-3 text-xs">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                 <div className="flex items-center"><PhoneIcon /><span>Contact No: 8958963106</span></div>
                 <div className="flex items-center"><EmailIcon /><span>Email: daakhpc@gmail.com</span></div>
                 <div className="flex items-center"><WebIcon /><span>Website: www.daakhpc.com</span></div>
                 <div className="flex items-center col-span-2"><AddressIcon /><span>6 Km From Govt Hospital Dabki Road, Village Ghoghreki, Saharanpur UP-247001</span></div>
            </div>
        </div>
    </div>
);


interface SubmissionDetailViewProps {
  data: Submission;
  onBackToAdmin: () => void;
}

export const SubmissionDetailView: React.FC<SubmissionDetailViewProps> = ({ data, onBackToAdmin }) => {
    const { user_data, submission_id } = data;
    
    const formattedPhone = `+${user_data.user_country_code.replace(/\+/g, '')} ${user_data.user_phone_number}`;
    const declarationText = "I hereby declare that I have understood the conditions of eligibility for the programme for which I seek admission. I fulfill the minimum eligibility criteria and I have provided necessary information in this regard. In the event of any information being found incorrect or misleading, my candidature shall be liable to be cancelled by the College at any time and I shall not be entitled to refund any fee submitted by me.";

    return (
        <div className="w-full text-left">
            <style>{`
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    body * { visibility: hidden; }
                    .print-container, .print-container * { visibility: visible; }
                    .print-container { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
                    .no-print { display: none !important; }
                    .page-break { page-break-before: always; }
                    .detail-item-print div { font-size: 11pt; }
                    .detail-item-print p:first-child { font-size: 9pt; }
                }
            `}</style>

            <div className="no-print flex justify-end items-center mb-8 pb-4 border-b border-slate-200">
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
                 <PrintHeader />

                 <div className="text-center my-6">
                    <h2 className="text-2xl font-bold text-slate-900 underline decoration-slate-400 decoration-2">Application Form</h2>
                    <p className="text-slate-600 mt-1">Submission ID: {submission_id}</p>
                 </div>
                
                <div className="detail-item-print">
                    <DetailSection title="Course Selection">
                        <DetailItem label="Selected Course" value={data.course} />
                    </DetailSection>

                    <DetailSection title="Personal Details">
                        <div className="flex justify-between items-start">
                             <div className="grid grid-cols-2 gap-x-12 gap-y-4 flex-grow">
                                <DetailItem label="Verified Phone Number" value={formattedPhone} />
                                {data.optional_phone_number && (
                                    <DetailItem label="Optional Phone Number" value={`+91 ${data.optional_phone_number}`} />
                                )}
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
                            <div className="ml-8 flex-shrink-0">
                                <p className="text-sm font-medium text-slate-500 mb-2 text-center">Passport Photograph</p>
                                <div className="w-32 h-40 border border-slate-300 rounded-md flex items-center justify-center bg-slate-50 overflow-hidden">
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
                        <div className="grid grid-cols-2 gap-x-12">
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
                    
                    <div className="page-break"></div>

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
                        <div className="grid grid-cols-3 gap-6">
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

                     <DetailSection title="Declaration">
                        <p className="text-sm text-slate-600 italic">
                           {declarationText}
                        </p>
                         <p className="mt-4 text-slate-900 font-semibold">Status: <span className="font-normal">{data.declaration ? "Agreed" : "Not Agreed"}</span></p>
                    </DetailSection>

                    <div className="mt-20 pt-10 flex justify-between text-center text-sm font-semibold text-slate-800">
                        <div>
                            <div className="border-t-2 border-slate-400 w-48 pt-2">Student's Signature</div>
                        </div>
                        <div>
                            <div className="border-t-2 border-slate-400 w-48 pt-2">Principal's Signature</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};