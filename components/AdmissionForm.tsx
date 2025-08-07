import React, { useState, useEffect } from 'react';
import { VerifiedUser, AcademicRecord, Address, DocumentType, Submission } from '../types';
import { indianStates } from '../data/addressData';
import { indianEducationBoards } from '../data/educationData';
import { supabase } from '../supabaseClient';

interface AdmissionFormProps {
    user: VerifiedUser;
    onFormSubmit: (data: Omit<Submission, 'id' | 'created_at'>, editingId?: string) => void;
    onCancel: () => void;
    initialData?: Submission;
}

const FormField: React.FC<{ label: string; children: React.ReactNode; htmlFor?: string }> = ({ label, children, htmlFor }) => (
    <div>
        <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        {children}
    </div>
);

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ hasError, ...props }) => {
  const baseClasses = "w-full bg-white border rounded-md p-2 text-slate-900 transition-colors duration-200 ease-in-out";
  const stateClasses = hasError
    ? "border-red-500 focus:ring-red-500/50 focus:border-red-500"
    : "border-slate-300 focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue";
  const disabledClasses = (props.disabled || props.readOnly) ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : '';
  
  return <input {...props} className={`${baseClasses} ${stateClasses} ${disabledClasses} ${props.className || ''}`} />;
};


const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
     <select {...props} className={`w-full bg-white border border-slate-300 rounded-md p-2 text-slate-900 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue ${props.disabled ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : ''}`} />
);

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const documentFields: { id: DocumentType, label: string }[] = [
    { id: 'signature', label: 'Signature' },
    { id: 'highschoolMarksheet', label: 'Highschool Marksheet' },
    { id: 'intermediateMarksheet', label: 'Intermediate Marksheet' },
    { id: 'aadhar', label: 'Aadhar Card' },
    { id: 'domicile', label: 'Domicile Certificate' },
    { id: 'transferCertificate', label: 'Transfer Certificate' },
];

export const AdmissionForm: React.FC<AdmissionFormProps> = ({ user, onFormSubmit, onCancel, initialData }) => {
    const [isEditing, setIsEditing] = useState(false);
    
    // Form state initialization
    const [phoneNumber, setPhoneNumber] = useState('');
    const [course, setCourse] = useState('Electrician (2 Year Diploma)');
    const [candidateName, setCandidateName] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [motherName, setMotherName] = useState('');
    const [aadharNumber, setAadharNumber] = useState('');
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [sex, setSex] = useState('');
    const [dob, setDob] = useState('');
    const [nationality, setNationality] = useState('Indian');
    const [category, setCategory] = useState('');
    const [email, setEmail] = useState('');
    const [postalAddress, setPostalAddress] = useState<Address>({ line: '', state: '', district: '' });
    const [permanentAddress, setPermanentAddress] = useState<Address>({ line: '', state: '', district: '' });
    const [isSameAddress, setIsSameAddress] = useState(false);
    const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([
        { id: Date.now(), examPassed: 'High School', institution: '', boardUniv: '', year: '', maxMarks: '', obtainedMarks: '', percentage: '' }
    ]);
    const [documentsUrls, setDocumentsUrls] = useState<Record<DocumentType, string | null>>({
        signature: null, highschoolMarksheet: null, intermediateMarksheet: null, aadhar: null, domicile: null, transferCertificate: null
    });
    const [declaration, setDeclaration] = useState(false);
    
    const [postalDistricts, setPostalDistricts] = useState<string[]>([]);
    const [permanentDistricts, setPermanentDistricts] = useState<string[]>([]);
    const [aadharError, setAadharError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const stateNames = Object.keys(indianStates);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

    useEffect(() => {
        const countryCode = user.user_country_code.replace(/\+/g, '');
        setPhoneNumber(`+${countryCode} ${user.user_phone_number}`);
        
        if (initialData) {
            setIsEditing(true);
            setCourse(initialData.course);
            setCandidateName(initialData.candidate_name);
            setFatherName(initialData.father_name);
            setMotherName(initialData.mother_name);
            setAadharNumber(initialData.aadhar_number);
            setPhotoUrl(initialData.photo_url);
            setSex(initialData.sex);
            setDob(initialData.dob);
            setNationality(initialData.nationality);
            setCategory(initialData.category);
            setEmail(initialData.email);
            setPostalAddress(initialData.postal_address);
            if (JSON.stringify(initialData.postal_address) === JSON.stringify(initialData.permanent_address)) {
                setIsSameAddress(true);
            } else {
                setPermanentAddress(initialData.permanent_address);
            }
            setAcademicRecords(initialData.academic_records);
            setDocumentsUrls(initialData.documents_urls);
            setDeclaration(initialData.declaration);
        }
    }, [user, initialData]);

    useEffect(() => {
        if (postalAddress.state) {
            setPostalDistricts(indianStates[postalAddress.state] || []);
        } else {
            setPostalDistricts([]);
        }
    }, [postalAddress.state]);

    useEffect(() => {
        if (!isSameAddress && permanentAddress.state) {
            setPermanentDistricts(indianStates[permanentAddress.state] || []);
        } else {
            setPermanentDistricts([]);
        }
    }, [permanentAddress.state, isSameAddress]);

    useEffect(() => {
        if (isSameAddress) {
            setPermanentAddress(postalAddress);
        }
    }, [isSameAddress, postalAddress]);
    
    const validateAadhar = (): boolean => {
        if (!aadharNumber.trim()) {
            setAadharError('Aadhar Number is required.');
            return false;
        }
        if (aadharNumber.length !== 12) {
            setAadharError('Aadhar Number must be exactly 12 digits.');
            return false;
        }
        setAadharError(null);
        return true;
    };

    const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setAadharNumber(value.replace(/[^0-9]/g, ''));
        if (aadharError) validateAadhar();
    };
    
    const handleAddressChange = (type: 'postal' | 'permanent', field: keyof Address, value: string) => {
        const setter = type === 'postal' ? setPostalAddress : setPermanentAddress;
        setter(prev => {
           const newState = { ...prev, [field]: value };
           if (field === 'state') newState.district = ''; // Reset district when state changes
           return newState;
        });
    };
    
    const uploadFile = async (file: File): Promise<string | null> => {
        setIsUploading(true);
        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
            .from('uploadedDocument')
            .upload(fileName, file);

        if (uploadError) {
            alert('Error uploading file: ' + uploadError.message);
            setIsUploading(false);
            return null;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('uploadedDocument')
            .getPublicUrl(fileName);
        
        setIsUploading(false);
        return publicUrl;
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) { alert('Please upload only image files.'); return; }
            const url = await uploadFile(file);
            if (url) setPhotoUrl(url);
        }
    };

    const handleDocumentChange = async (e: React.ChangeEvent<HTMLInputElement>, docType: DocumentType) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) { alert('Please upload only image files.'); return; }
            const url = await uploadFile(file);
            if(url) setDocumentsUrls(prev => ({ ...prev, [docType]: url }));
        }
    };

    const addAcademicRecord = () => {
        setAcademicRecords(prev => [...prev, { id: Date.now(), examPassed: 'High School', institution: '', boardUniv: '', year: '', maxMarks: '', obtainedMarks: '', percentage: '' }]);
    };

    const removeAcademicRecord = (id: number) => {
        if (academicRecords.length > 1) {
            setAcademicRecords(prev => prev.filter(record => record.id !== id));
        }
    };

    const handleAcademicChange = (id: number, field: keyof Omit<AcademicRecord, 'id'>, value: string) => {
        setAcademicRecords(prev => prev.map(record => {
            if (record.id === id) {
                const updatedRecord = { ...record, [field]: value };
                if (field === 'maxMarks' || field === 'obtainedMarks') {
                    const max = parseFloat(field === 'maxMarks' ? value : updatedRecord.maxMarks);
                    const obtained = parseFloat(field === 'obtainedMarks' ? value : updatedRecord.obtainedMarks);
                    if (!isNaN(max) && !isNaN(obtained) && max > 0) {
                        updatedRecord.percentage = ((obtained / max) * 100).toFixed(2);
                    } else {
                        updatedRecord.percentage = '';
                    }
                }
                return updatedRecord;
            }
            return record;
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isAadharValid = validateAadhar();
        if (!declaration) {
            alert('You must agree to the declaration before submitting.');
            return;
        }
        if (!isAadharValid) {
            alert('Please correct the Aadhar Number before submitting.');
            return;
        }

        const collectedData: Omit<Submission, 'id' | 'created_at'> = {
            submission_id: initialData?.submission_id || Math.floor(100000 + Math.random() * 900000).toString(),
            user_data: user,
            course,
            candidate_name: candidateName,
            father_name: fatherName,
            mother_name: motherName,
            aadhar_number: aadharNumber,
            photo_url: photoUrl,
            sex, dob, nationality, category, email, 
            postal_address: postalAddress,
            permanent_address: isSameAddress ? postalAddress : permanentAddress,
            academic_records: academicRecords, 
            documents_urls: documentsUrls, 
            declaration,
        };
        
        onFormSubmit(collectedData, initialData?.id);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-8 text-left">
            {isUploading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="text-white text-lg flex items-center gap-4"><div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-white"></div> Uploading file...</div>
                </div>
            )}
            <div className="text-center mb-4">
                <h1 className="text-3xl font-bold text-slate-900">{isEditing ? 'Edit Application' : 'Admission Form'}</h1>
                <p className="text-slate-600 mt-2">{isEditing ? `Editing submission ID: ${initialData?.submission_id}` : 'Please fill out the details below.'}</p>
            </div>

            <fieldset>
                <legend className="text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2 w-full">Course Selection</legend>
                 <div className="space-y-2">
                    {['Electrician (2 Year Diploma)', 'HSI (Health & Sanitary Inspector 1 Year Diploma)', 'DHP (2 Year Diploma)'].map(c => (
                        <div key={c} className="flex items-center gap-x-3">
                            <input id={c} name="course" type="radio" value={c} className="h-4 w-4 border-slate-400 text-brand-blue focus:ring-brand-blue" checked={course === c} onChange={e => setCourse(e.target.value)} />
                            <label htmlFor={c} className="block text-sm font-medium leading-6 text-slate-800">{c}</label>
                        </div>
                    ))}
                </div>
            </fieldset>

            <fieldset>
                <legend className="text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2 w-full">Personal Details</legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <FormField label="Verified Phone Number"><FormInput type="text" value={phoneNumber} readOnly /></FormField>
                        <FormField label="Name of Candidate"><FormInput type="text" value={candidateName} onChange={e => setCandidateName(e.target.value)} required /></FormField>
                        <FormField label="Father's Name"><FormInput type="text" value={fatherName} onChange={e => setFatherName(e.target.value)} required /></FormField>
                        <FormField label="Mother's Name"><FormInput type="text" value={motherName} onChange={e => setMotherName(e.target.value)} required /></FormField>
                        <FormField label="Aadhar Number (12 Digits)">
                            <FormInput type="text" value={aadharNumber} onChange={handleAadharChange} onBlur={validateAadhar} maxLength={12} hasError={!!aadharError} required />
                            {aadharError && <p className="text-red-600 text-xs mt-1">{aadharError}</p>}
                        </FormField>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg p-4">
                        <div className="w-32 h-40 border-2 border-dashed border-slate-300 flex items-center justify-center rounded-md overflow-hidden">
                           {photoUrl ? <img src={photoUrl} alt="Photograph Preview" className="w-full h-full object-cover" /> : <span className="text-slate-500 text-center text-sm p-2">Passport Photo</span>}
                        </div>
                        <label htmlFor="photograph" className="mt-2 text-sm text-brand-blue hover:text-brand-blue-dark cursor-pointer">
                            Upload Photo
                            <input id="photograph" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange}/>
                        </label>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    <FormField label="Sex"><FormSelect value={sex} onChange={e => setSex(e.target.value)} required><option value="">Select...</option><option>Male</option><option>Female</option></FormSelect></FormField>
                    <FormField label="Date of Birth"><FormInput type="date" value={dob} onChange={e => setDob(e.target.value)} required /></FormField>
                    <FormField label="Nationality"><FormInput type="text" value={nationality} onChange={e => setNationality(e.target.value)} required /></FormField>
                    <FormField label="Category"><FormSelect value={category} onChange={e => setCategory(e.target.value)} required><option value="">Select...</option><option>General</option><option>OBC</option><option>SC</option><option>ST</option><option>MIN</option></FormSelect></FormField>
                    <FormField label="Email"><FormInput type="email" value={email} onChange={e => setEmail(e.target.value)} required /></FormField>
                </div>
                
                 <div className="space-y-6 mt-6">
                    <div className="p-4 border border-slate-200 rounded-lg">
                        <h3 className="text-md font-semibold text-slate-800 mb-3">Postal Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div className="md:col-span-3"><FormField label="Address Line"><FormInput type="text" value={postalAddress.line} onChange={e => handleAddressChange('postal', 'line', e.target.value)} required /></FormField></div>
                            <FormField label="State"><FormSelect value={postalAddress.state} onChange={e => handleAddressChange('postal', 'state', e.target.value)} required><option value="">Select State...</option>{stateNames.map(s => <option key={s} value={s}>{s}</option>)}</FormSelect></FormField>
                            <FormField label="District"><FormSelect value={postalAddress.district} onChange={e => handleAddressChange('postal', 'district', e.target.value)} disabled={!postalAddress.state} required><option value="">Select District...</option>{postalDistricts.map(d => <option key={d} value={d}>{d}</option>)}</FormSelect></FormField>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input id="sameAddress" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" checked={isSameAddress} onChange={(e) => setIsSameAddress(e.target.checked)} />
                        <label htmlFor="sameAddress" className="ml-2 block text-sm text-gray-900">Permanent address is same as postal.</label>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-lg">
                         <h3 className="text-md font-semibold text-slate-800 mb-3">Permanent Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div className="md:col-span-3"><FormField label="Address Line"><FormInput type="text" value={permanentAddress.line} onChange={e => handleAddressChange('permanent', 'line', e.target.value)} disabled={isSameAddress} required={!isSameAddress} /></FormField></div>
                            <FormField label="State"><FormSelect value={permanentAddress.state} onChange={e => handleAddressChange('permanent', 'state', e.target.value)} disabled={isSameAddress} required={!isSameAddress}><option value="">Select State...</option>{stateNames.map(s => <option key={s} value={s}>{s}</option>)}</FormSelect></FormField>
                             <FormField label="District"><FormSelect value={permanentAddress.district} onChange={e => handleAddressChange('permanent', 'district', e.target.value)} disabled={isSameAddress || !permanentAddress.state} required={!isSameAddress}><option value="">Select District...</option>{permanentDistricts.map(d => <option key={d} value={d}>{d}</option>)}</FormSelect></FormField>
                        </div>
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <legend className="text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2 w-full">Academic Qualification</legend>
                <div className="space-y-4">
                    {academicRecords.map((rec) => (
                        <div key={rec.id} className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-10 gap-2 items-end bg-slate-50 p-3 rounded-lg">
                            <div className="lg:col-span-1"><FormField label="Exam"><FormSelect value={rec.examPassed} onChange={e => handleAcademicChange(rec.id, 'examPassed', e.target.value)}><option>High School</option><option>Intermediate</option></FormSelect></FormField></div>
                            <div className="md:col-span-2 lg:col-span-2"><FormField label="Institution"><FormInput type="text" value={rec.institution} onChange={e => handleAcademicChange(rec.id, 'institution', e.target.value)} /></FormField></div>
                            <div className="md:col-span-2 lg:col-span-2"><FormField label="Board/Univ."><FormSelect value={rec.boardUniv} onChange={e => handleAcademicChange(rec.id, 'boardUniv', e.target.value)}><option value="">Select Board...</option>{indianEducationBoards.map(board => <option key={board} value={board}>{board}</option>)}</FormSelect></FormField></div>
                            <div className="lg:col-span-1"><FormField label="Year"><FormSelect value={rec.year} onChange={e => handleAcademicChange(rec.id, 'year', e.target.value)}><option value="">Select Year...</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</FormSelect></FormField></div>
                            <div className="lg:col-span-1"><FormField label="Max Marks"><FormInput type="number" value={rec.maxMarks} onChange={e => handleAcademicChange(rec.id, 'maxMarks', e.target.value)} /></FormField></div>
                            <div className="lg:col-span-1"><FormField label="Obtained"><FormInput type="number" value={rec.obtainedMarks} onChange={e => handleAcademicChange(rec.id, 'obtainedMarks', e.target.value)} /></FormField></div>
                            <div className="lg:col-span-2 flex items-end gap-2">
                                <div className="flex-grow"><FormField label="%"><FormInput type="text" value={rec.percentage} readOnly /></FormField></div>
                                <button type="button" onClick={() => removeAcademicRecord(rec.id)} className="h-10 w-10 flex-shrink-0 bg-red-500/80 hover:bg-red-600 text-white font-bold rounded-md disabled:opacity-50 disabled:cursor-not-allowed" disabled={academicRecords.length <= 1}>-</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addAcademicRecord} className="mt-4 px-4 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold rounded-md text-sm">+ Add Row</button>
            </fieldset>

            <fieldset>
                <legend className="text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2 w-full">Document Uploads (Optional)</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documentFields.map((doc) => (
                        <div key={doc.id} className="bg-slate-50 p-4 rounded-lg flex flex-col items-center text-center">
                            <h4 className="font-semibold text-slate-800 mb-2 h-10 flex items-center">{doc.label}</h4>
                            <div className="w-full h-32 border-2 border-dashed border-slate-300 rounded-md flex items-center justify-center overflow-hidden bg-white">
                                {documentsUrls[doc.id] ? <img src={documentsUrls[doc.id]} alt={`${doc.label} Preview`} className="w-full h-full object-contain" /> : <UploadIcon />}
                            </div>
                            <label htmlFor={doc.id} className="mt-3 inline-block bg-white hover:bg-slate-100 text-slate-700 text-sm font-medium py-2 px-4 border border-slate-300 rounded-md shadow-sm cursor-pointer">
                                Choose File
                                <input id={doc.id} type="file" className="sr-only" accept="image/*" onChange={(e) => handleDocumentChange(e, doc.id)} />
                            </label>
                        </div>
                    ))}
                </div>
            </fieldset>
            
            <fieldset>
                <legend className="text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2 w-full">Declaration</legend>
                <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-lg">
                    <input id="declaration" name="declaration" type="checkbox" required className="h-4 w-4 mt-1 border-slate-400 text-brand-blue focus:ring-brand-blue" checked={declaration} onChange={e => setDeclaration(e.target.checked)} />
                    <label htmlFor="declaration" className="text-slate-700 text-sm">
                        I hereby declare that I have understood the conditions of eligibility for the programme for which I seek admission. I fulfill the minimum eligibility criteria and I have provided necessary information in this regard. In the event of any information being found incorrect or misleading, my candidature shall be liable to be cancelled by the College at any time and I shall not be entitled to refund any fee submitted by me.
                    </label>
                </div>
            </fieldset>

            <div className="flex justify-end items-center gap-4 pt-6 border-t border-slate-200">
                <button type="button" onClick={onCancel} className="px-8 py-3 bg-slate-500 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : isEditing ? 'Update Application' : 'Submit Application'}
                </button>
            </div>
        </form>
    );
};