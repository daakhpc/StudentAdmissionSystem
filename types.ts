/**
 * Represents the structure of the verified user data
 * fetched from the phone.email service.
 */
export interface VerifiedUser {
  user_country_code: string;
  user_phone_number: string;
  user_first_name: string;
  user_last_name: string;
}

/**
 * Represents the object passed to the global listener
 * by the phone.email script upon successful verification.
 */
export interface PhoneEmailUserObject {
    user_json_url: string;
}


/**
 * Represents the structure for a single academic qualification record.
 */
export interface AcademicRecord {
  id: number;
  examPassed: string;
  institution: string;
  boardUniv: string;
  year: string;
  maxMarks: string;
  obtainedMarks: string;
  percentage: string;
}

/**
 * Represents a structured address.
 */
export interface Address {
  line: string;
  state: string;
  district: string;
}

/**
 * Represents the document types for file uploads.
 */
export type DocumentType = 
    | 'signature' 
    | 'highschoolMarksheet' 
    | 'intermediateMarksheet' 
    | 'aadhar' 
    | 'domicile' 
    | 'transferCertificate';

/**
 * Represents a single submission record, matching the Supabase table schema.
 */
export interface Submission {
  id: string; // uuid from DB
  created_at: string;
  submission_id: string; // 6-digit user-facing ID
  user_data: VerifiedUser;
  course: string;
  candidate_name: string;
  father_name: string;
  mother_name: string;
  aadhar_number: string;
  sex: string;
  dob: string;
  nationality: string;
  category: string;
  email: string;
  optional_phone_number?: string;
  postal_address: Address;
  permanent_address: Address;
  academic_records: AcademicRecord[];
  declaration: boolean;
  photo_url: string | null;
  documents_urls: Record<DocumentType, string | null>;
}