import {
  Requirement, Submission, Vendor, VendorDocument,
  Notification, User, ScreeningSlot
} from '@/types';

// ─── USERS ────────────────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@mindcrew.com', username: 'admin', role: 'admin', isActive: true, createdAt: '2024-01-01', lastLoginAt: '2026-09-16' },
  { id: 'u2', name: 'Sarah HR', email: 'sarah@mindcrew.com', username: 'sarah.hr', role: 'hr', isActive: true, createdAt: '2024-02-15', lastLoginAt: '2026-09-15' },
  { id: 'u3', name: 'Ravi Kumar', email: 'ravi@mindcrew.com', username: 'ravi.hr', role: 'hr', isActive: true, createdAt: '2024-03-10', lastLoginAt: '2026-09-14' },
  { id: 'u4', name: 'Chinthana Vortex', email: 'chinthana@vortexsoftinnovations.com', username: 'chinthana', role: 'vendor', vendorId: 'v1', isActive: true, createdAt: '2024-04-01', lastLoginAt: '2026-09-16' },
  { id: 'u5', name: 'Priya Tech', email: 'priya@techstaff.com', username: 'priya.tech', role: 'vendor', vendorId: 'v2', isActive: true, createdAt: '2024-05-20', lastLoginAt: '2026-09-10' },
  { id: 'u6', name: 'Amit Staffing', email: 'amit@globalstaff.in', username: 'amit.gs', role: 'vendor', vendorId: 'v3', isActive: false, createdAt: '2024-06-01', lastLoginAt: '2026-08-01' },
];

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const mockCredentials: Record<string, { password: string; userId: string }> = {
  'admin@mindcrew.com': { password: 'Admin@123', userId: 'u1' },
  'sarah@mindcrew.com': { password: 'Sarah@123', userId: 'u2' },
  'chinthana@vortexsoftinnovations.com': { password: 'Qwerty@09', userId: 'u4' },
  'priya@techstaff.com': { password: 'Priya@123', userId: 'u5' },
};

// ─── VENDORS ─────────────────────────────────────────────────────────────────
export const mockVendors: Vendor[] = [
  { id: 'v1', companyName: 'Vortexsoft Innovations Private Limited', contactPerson: 'Chinthana', email: 'chinthana@vortexsoftinnovations.com', phone: '+91 9876543210', address: 'Pune, Maharashtra', isActive: true, createdAt: '2024-04-01', totalSubmissions: 24 },
  { id: 'v2', companyName: 'TechStaff Solutions', contactPerson: 'Priya Sharma', email: 'priya@techstaff.com', phone: '+91 9123456780', address: 'Bangalore, Karnataka', isActive: true, createdAt: '2024-05-20', totalSubmissions: 41 },
  { id: 'v3', companyName: 'Global Staffing India', contactPerson: 'Amit Singh', email: 'amit@globalstaff.in', phone: '+91 9988776655', address: 'Mumbai, Maharashtra', isActive: false, createdAt: '2024-06-01', totalSubmissions: 8 },
  { id: 'v4', companyName: 'Nexus Recruit', contactPerson: 'Deepa Nair', email: 'deepa@nexusrecruit.com', phone: '+91 9011223344', address: 'Hyderabad, Telangana', isActive: true, createdAt: '2024-07-15', totalSubmissions: 19 },
  { id: 'v5', companyName: 'Apex Talent Hub', contactPerson: 'Vikram Patel', email: 'vikram@apextalent.io', phone: '+91 8866554433', address: 'Chennai, Tamil Nadu', isActive: true, createdAt: '2024-08-01', totalSubmissions: 33 },
];

// ─── REQUIREMENTS ─────────────────────────────────────────────────────────────
export const mockRequirements: Requirement[] = [
  {
    id: 'r1', title: 'Data Scientist', description: 'We are looking for an experienced Data Scientist to join our analytics team. The ideal candidate will have strong experience in machine learning, statistical modeling, and data pipeline development.', jobType: 'remote', location: 'Remote', minExperience: 3, targetClosureDate: '2026-10-31', budget: '₹18-25 LPA', mandatorySkills: ['Python', 'Machine Learning', 'SQL'], primarySkills: ['TensorFlow', 'Pandas', 'Scikit-learn'], secondarySkills: ['Spark', 'AWS', 'Tableau'], status: 'open', createdBy: 'u2', postedDate: '2026-01-10', totalSubmissions: 15,
  },
  {
    id: 'r2', title: 'Data Scientist - Analytics', description: 'Analytics-focused Data Scientist role. You will work closely with the product team to derive insights from user behavior data and build predictive models.', jobType: 'remote', location: 'Remote', minExperience: 4, targetClosureDate: '2026-11-15', budget: '₹20-30 LPA', mandatorySkills: ['Python', 'Statistics', 'Data Visualization'], primarySkills: ['R', 'Power BI', 'Looker'], secondarySkills: ['Databricks', 'GCP'], status: 'open', createdBy: 'u2', postedDate: '2026-01-15', totalSubmissions: 8,
  },
  {
    id: 'r3', title: 'Data Engineer - Acc03', description: 'Senior Data Engineer to build and maintain data pipelines for our accounting vertical. Strong ETL experience required.', jobType: 'onsite', location: 'Pune, Maharashtra', minExperience: 5, targetClosureDate: '2026-09-30', budget: '₹22-32 LPA', mandatorySkills: ['PySpark', 'Airflow', 'SQL'], primarySkills: ['AWS Glue', 'Kafka', 'Snowflake'], secondarySkills: ['dbt', 'Terraform'], status: 'open', createdBy: 'u3', postedDate: '2026-01-20', totalSubmissions: 23,
  },
  {
    id: 'r4', title: 'Senior React Developer', description: 'Senior Frontend Developer with deep expertise in React ecosystem. Will lead the UI development for our core product.', jobType: 'hybrid', location: 'Bangalore, Karnataka', minExperience: 4, targetClosureDate: '2026-10-20', budget: '₹20-28 LPA', mandatorySkills: ['React', 'TypeScript', 'Next.js'], primarySkills: ['Redux', 'Tailwind CSS', 'GraphQL'], secondarySkills: ['Jest', 'Cypress', 'Storybook'], status: 'open', createdBy: 'u2', postedDate: '2026-02-01', totalSubmissions: 18,
  },
  {
    id: 'r5', title: 'DevOps Engineer', description: 'DevOps Engineer to manage CI/CD pipelines and cloud infrastructure on AWS/Azure. Experience with Kubernetes and Docker required.', jobType: 'remote', location: 'Remote', minExperience: 3, targetClosureDate: '2026-10-15', budget: '₹18-25 LPA', mandatorySkills: ['Docker', 'Kubernetes', 'CI/CD'], primarySkills: ['AWS', 'Terraform', 'Helm'], secondarySkills: ['Prometheus', 'Grafana', 'ArgoCD'], status: 'open', createdBy: 'u3', postedDate: '2026-02-10', totalSubmissions: 11,
  },
  {
    id: 'r6', title: 'Product Manager', description: 'Product Manager to own the product roadmap and work with cross-functional teams. Strong analytical mindset required.', jobType: 'onsite', location: 'Mumbai, Maharashtra', minExperience: 5, targetClosureDate: '2026-09-25', budget: '₹25-35 LPA', mandatorySkills: ['Product Strategy', 'Agile', 'Analytics'], primarySkills: ['JIRA', 'Figma', 'SQL'], secondarySkills: ['A/B Testing', 'Mixpanel'], status: 'on_hold', createdBy: 'u2', postedDate: '2026-02-15', totalSubmissions: 7,
  },
  {
    id: 'r7', title: 'Java Backend Developer', description: 'Experienced Java developer to build microservices for our platform. Spring Boot, REST APIs, and microservices architecture experience required.', jobType: 'remote', location: 'Remote', minExperience: 4, targetClosureDate: '2026-10-01', budget: '₹18-24 LPA', mandatorySkills: ['Java', 'Spring Boot', 'Microservices'], primarySkills: ['REST APIs', 'PostgreSQL', 'Docker'], secondarySkills: ['Kafka', 'Redis', 'AWS'], status: 'open', createdBy: 'u3', postedDate: '2026-03-01', totalSubmissions: 29,
  },
  {
    id: 'r8', title: 'UI/UX Designer', description: 'Creative UI/UX Designer to design intuitive user experiences. Must have strong portfolio and experience with design systems.', jobType: 'remote', location: 'Remote', minExperience: 2, targetClosureDate: '2026-11-01', budget: '₹12-18 LPA', mandatorySkills: ['Figma', 'UX Research', 'Prototyping'], primarySkills: ['Adobe XD', 'Design Systems', 'Wireframing'], secondarySkills: ['HTML/CSS', 'Animation', 'Usability Testing'], status: 'open', createdBy: 'u2', postedDate: '2026-03-10', totalSubmissions: 14,
  },
  {
    id: 'r9', title: 'Python Developer', description: 'Python developer with FastAPI and Django experience. Will work on building REST APIs for our backend services.', jobType: 'remote', location: 'Remote', minExperience: 3, targetClosureDate: '2026-10-10', budget: '₹15-22 LPA', mandatorySkills: ['Python', 'FastAPI', 'REST APIs'], primarySkills: ['Django', 'PostgreSQL', 'Redis'], secondarySkills: ['Docker', 'AWS', 'Celery'], status: 'open', createdBy: 'u2', postedDate: '2026-03-15', totalSubmissions: 20,
  },
  {
    id: 'r10', title: 'QA Engineer', description: 'Manual and Automation QA Engineer. Will be responsible for ensuring product quality through comprehensive testing strategies.', jobType: 'onsite', location: 'Hyderabad, Telangana', minExperience: 2, targetClosureDate: '2026-09-20', budget: '₹10-15 LPA', mandatorySkills: ['Manual Testing', 'Selenium', 'JIRA'], primarySkills: ['Cypress', 'API Testing', 'Postman'], secondarySkills: ['Performance Testing', 'JMeter'], status: 'closed', createdBy: 'u3', postedDate: '2026-03-20', totalSubmissions: 32,
  },
];

// ─── SUBMISSIONS ──────────────────────────────────────────────────────────────
export const mockSubmissions: Submission[] = [
  { id: 's1', requirementId: 'r1', requirementTitle: 'Data Scientist', vendorId: 'v1', vendorName: 'Vortexsoft Innovations Private Limited', candidateName: 'Yogesh Sunil Punde', candidateEmail: 'yogesh.punde@gmail.com', candidatePhone: '+91 9876543211', totalExperience: 5, relevantExperience: 4, jdComfortable: true, cvFilename: 'yogesh_punde_cv.pdf', status: 'submitted', createdAt: '2026-05-29', updatedAt: '2026-05-29' },
  { id: 's2', requirementId: 'r2', requirementTitle: 'Data Scientist - Analytics', vendorId: 'v1', vendorName: 'Vortexsoft Innovations Private Limited', candidateName: 'Yogesh Sunil Punde', candidateEmail: 'yogesh.punde@gmail.com', candidatePhone: '+91 9876543211', totalExperience: 5, relevantExperience: 4, jdComfortable: true, cvFilename: 'yogesh_punde_cv.pdf', status: 'screening_scheduled', meetingLink: 'https://meet.google.com/abc-defg-hij', screeningDate: '2026-06-05', screeningTimeSlot: '10:00 AM', scheduledAt: '2026-06-05T10:00:00', createdAt: '2026-05-29', updatedAt: '2026-06-01' },
  { id: 's3', requirementId: 'r3', requirementTitle: 'Data Engineer - Acc03', vendorId: 'v1', vendorName: 'Vortexsoft Innovations Private Limited', candidateName: 'Ashutosh Joshi', candidateEmail: 'ashutosh.joshi@gmail.com', candidatePhone: '+91 8866554432', totalExperience: 7, relevantExperience: 5, jdComfortable: true, cvFilename: 'ashutosh_joshi_cv.pdf', status: 'interview_scheduled', meetingLink: 'https://meet.google.com/xyz-uvwx-yz', screeningDate: '2026-02-10', screeningTimeSlot: '2:30 PM', scheduledAt: '2026-02-10T14:30:00', createdAt: '2026-01-31', updatedAt: '2026-02-05' },
  { id: 's4', requirementId: 'r3', requirementTitle: 'Data Engineer - Acc03', vendorId: 'v1', vendorName: 'Vortexsoft Innovations Private Limited', candidateName: 'YOGESH PUNDE', candidateEmail: 'yogesh2@gmail.com', candidatePhone: '+91 9988776654', totalExperience: 6, relevantExperience: 5, jdComfortable: true, cvFilename: 'yogesh2_cv.pdf', status: 'rejected', createdAt: '2026-01-31', updatedAt: '2026-02-15' },
  { id: 's5', requirementId: 'r1', requirementTitle: 'Data Scientist', vendorId: 'v1', vendorName: 'Vortexsoft Innovations Private Limited', candidateName: 'MAHESH YANNAWA', candidateEmail: 'mahesh.y@gmail.com', candidatePhone: '+91 9011223345', totalExperience: 4, relevantExperience: 3, jdComfortable: false, cvFilename: 'mahesh_yannawa_cv.pdf', status: 'submitted', createdAt: '2026-01-27', updatedAt: '2026-01-27' },
  { id: 's6', requirementId: 'r4', requirementTitle: 'Senior React Developer', vendorId: 'v2', vendorName: 'TechStaff Solutions', candidateName: 'Anita Sharma', candidateEmail: 'anita.s@gmail.com', candidatePhone: '+91 9123456781', totalExperience: 5, relevantExperience: 4, jdComfortable: true, cvFilename: 'anita_sharma_cv.pdf', status: 'offer_offered', meetingLink: 'https://meet.google.com/mno-pqrs-tu', createdAt: '2026-02-10', updatedAt: '2026-03-01' },
  { id: 's7', requirementId: 'r5', requirementTitle: 'DevOps Engineer', vendorId: 'v2', vendorName: 'TechStaff Solutions', candidateName: 'Rajesh Kumar', candidateEmail: 'rajesh.k@gmail.com', candidatePhone: '+91 8876543210', totalExperience: 4, relevantExperience: 3, jdComfortable: true, cvFilename: 'rajesh_kumar_cv.pdf', status: 'screening_scheduled', meetingLink: 'https://meet.google.com/qrs-tuvw-xy', screeningDate: '2026-09-20', screeningTimeSlot: '11:00 AM', scheduledAt: '2026-09-20T11:00:00', createdAt: '2026-09-10', updatedAt: '2026-09-12' },
  { id: 's8', requirementId: 'r7', requirementTitle: 'Java Backend Developer', vendorId: 'v4', vendorName: 'Nexus Recruit', candidateName: 'Suresh Menon', candidateEmail: 'suresh.m@gmail.com', candidatePhone: '+91 9966554433', totalExperience: 6, relevantExperience: 5, jdComfortable: true, cvFilename: 'suresh_menon_cv.pdf', status: 'approved', createdAt: '2026-03-15', updatedAt: '2026-04-01' },
];

// ─── DOCUMENTS ─────────────────────────────────────────────────────────────────
export const mockDocuments: VendorDocument[] = [
  { id: 'd1', vendorId: 'v1', name: 'Master Service Agreement 2024', type: 'contract', uploadedBy: 'Sarah HR', status: 'responded', createdAt: '2024-05-01', updatedAt: '2024-05-10' },
  { id: 'd2', vendorId: 'v1', name: 'Non-Disclosure Agreement', type: 'nda', uploadedBy: 'Admin User', status: 'approved', createdAt: '2024-04-15', updatedAt: '2024-04-20' },
  { id: 'd3', vendorId: 'v1', name: 'Vendor Compliance Checklist Q1 2026', type: 'compliance', uploadedBy: 'Sarah HR', status: 'pending_response', createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'd4', vendorId: 'v1', name: 'Rate Card Update 2026', type: 'contract', uploadedBy: 'Admin User', status: 'pending_response', createdAt: '2026-03-01', updatedAt: '2026-03-01' },
  { id: 'd5', vendorId: 'v2', name: 'Partnership Agreement 2024', type: 'contract', uploadedBy: 'Sarah HR', status: 'approved', createdAt: '2024-06-01', updatedAt: '2024-06-15' },
];

// ─── NOTIFICATIONS ─────────────────────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  { id: 'n1', userId: 'u4', type: 'new_requirement', title: 'New Requirement Posted', message: 'Senior React Developer position is now open for submissions', isRead: false, relatedEntityType: 'requirement', relatedEntityId: 'r4', createdAt: '2026-09-15T10:30:00' },
  { id: 'n2', userId: 'u4', type: 'submission_update', title: 'Submission Status Updated', message: 'Yogesh Punde\'s application for Data Scientist Analytics has been moved to Screening Scheduled', isRead: false, relatedEntityType: 'submission', relatedEntityId: 's2', createdAt: '2026-09-14T14:20:00' },
  { id: 'n3', userId: 'u4', type: 'document', title: 'New Document Awaiting Response', message: 'Vendor Compliance Checklist Q1 2026 requires your response', isRead: false, relatedEntityType: 'document', relatedEntityId: 'd3', createdAt: '2026-09-13T09:00:00' },
  { id: 'n4', userId: 'u4', type: 'new_requirement', title: 'New Requirement Posted', message: 'DevOps Engineer position is now open for submissions', isRead: false, relatedEntityType: 'requirement', relatedEntityId: 'r5', createdAt: '2026-09-12T11:00:00' },
  { id: 'n5', userId: 'u4', type: 'document', title: 'Document Update Required', message: 'Rate Card Update 2026 has been uploaded for your review', isRead: true, relatedEntityType: 'document', relatedEntityId: 'd4', createdAt: '2026-09-10T08:30:00' },
  { id: 'n6', userId: 'u4', type: 'submission_update', title: 'Candidate Rejected', message: 'YOGESH PUNDE\'s application for Data Engineer - Acc03 was rejected', isRead: true, relatedEntityType: 'submission', relatedEntityId: 's4', createdAt: '2026-09-08T16:00:00' },
  { id: 'n7', userId: 'u4', type: 'new_requirement', title: 'New Requirement Posted', message: 'Python Developer position is now open', isRead: false, relatedEntityType: 'requirement', relatedEntityId: 'r9', createdAt: '2026-09-07T10:00:00' },
  { id: 'n8', userId: 'u4', type: 'new_requirement', title: 'New Requirement Posted', message: 'UI/UX Designer position is now open', isRead: false, relatedEntityType: 'requirement', relatedEntityId: 'r8', createdAt: '2026-09-06T10:00:00' },
];

// ─── SCREENING SLOTS ──────────────────────────────────────────────────────────
export const mockScreeningSlots: ScreeningSlot[] = [
  { id: 'sl1', date: '2026-09-20', time: '9:00 AM', isAvailable: true },
  { id: 'sl2', date: '2026-09-20', time: '10:00 AM', isAvailable: true },
  { id: 'sl3', date: '2026-09-20', time: '11:00 AM', isAvailable: false },
  { id: 'sl4', date: '2026-09-20', time: '2:00 PM', isAvailable: true },
  { id: 'sl5', date: '2026-09-20', time: '3:00 PM', isAvailable: true },
  { id: 'sl6', date: '2026-09-20', time: '4:00 PM', isAvailable: true },
  { id: 'sl7', date: '2026-09-22', time: '9:00 AM', isAvailable: true },
  { id: 'sl8', date: '2026-09-22', time: '10:00 AM', isAvailable: true },
  { id: 'sl9', date: '2026-09-22', time: '11:00 AM', isAvailable: true },
  { id: 'sl10', date: '2026-09-22', time: '2:00 PM', isAvailable: true },
  { id: 'sl11', date: '2026-09-23', time: '9:00 AM', isAvailable: true },
  { id: 'sl12', date: '2026-09-23', time: '10:00 AM', isAvailable: true },
  { id: 'sl13', date: '2026-09-23', time: '3:00 PM', isAvailable: true },
  { id: 'sl14', date: '2026-09-24', time: '2:00 PM', isAvailable: true },
  { id: 'sl15', date: '2026-09-24', time: '4:00 PM', isAvailable: true },
];

// ─── DEMO ACCOUNTS FOR LOGIN PAGE ─────────────────────────────────────────────
export const demoAccounts = [
  { role: 'Admin', email: 'admin@mindcrew.com', password: 'Admin@123', color: 'text-purple-400' },
  { role: 'HR', email: 'sarah@mindcrew.com', password: 'Sarah@123', color: 'text-blue-400' },
  { role: 'Vendor', email: 'chinthana@vortexsoftinnovations.com', password: 'Qwerty@09', color: 'text-emerald-400' },
];
