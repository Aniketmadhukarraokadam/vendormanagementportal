// ─── USER & AUTH ─────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'hr' | 'vendor';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  vendorId?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

// ─── VENDOR ───────────────────────────────────────────────────────────────────
export interface Vendor {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  totalSubmissions: number;
}

// ─── REQUIREMENT ─────────────────────────────────────────────────────────────
export type JobType = 'remote' | 'onsite' | 'hybrid';
export type RequirementStatus = 'open' | 'on_hold' | 'closed';

export interface Requirement {
  id: string;
  title: string;
  description: string;
  jobType: JobType;
  location: string;
  minExperience: number;
  targetClosureDate: string;
  budget?: string;
  mandatorySkills: string[];
  primarySkills: string[];
  secondarySkills: string[];
  status: RequirementStatus;
  createdBy: string;
  postedDate: string;
  totalSubmissions: number;
}

// ─── SUBMISSION ───────────────────────────────────────────────────────────────
export type SubmissionStatus =
  | 'submitted'
  | 'screening_scheduled'
  | 'screening_done'
  | 'interview_scheduled'
  | 'offer_offered'
  | 'approved'
  | 'rejected';

export interface Submission {
  id: string;
  requirementId: string;
  requirementTitle: string;
  vendorId: string;
  vendorName: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  totalExperience: number;
  relevantExperience: number;
  jdComfortable: boolean;
  cvFilename?: string;
  status: SubmissionStatus;
  screeningDate?: string;
  screeningTimeSlot?: string;
  meetingLink?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── DOCUMENT ─────────────────────────────────────────────────────────────────
export type DocumentStatus = 'pending_response' | 'responded' | 'approved' | 'rejected';
export type DocumentType = 'contract' | 'nda' | 'compliance' | 'other';

export interface VendorDocument {
  id: string;
  vendorId: string;
  name: string;
  type: DocumentType;
  fileUrl?: string;
  uploadedBy: string;
  responseUrl?: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── NOTIFICATION ─────────────────────────────────────────────────────────────
export type NotificationType = 'new_requirement' | 'submission_update' | 'screening_scheduled' | 'document';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedEntityType?: string;
  relatedEntityId?: string;
  createdAt: string;
}

// ─── SCREENING SLOT ───────────────────────────────────────────────────────────
export interface ScreeningSlot {
  id: string;
  date: string;
  time: string;
  isAvailable: boolean;
  submissionId?: string;
}
