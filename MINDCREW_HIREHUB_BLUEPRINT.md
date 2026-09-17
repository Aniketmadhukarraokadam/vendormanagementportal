# Mindcrew HireHub — Complete Application Blueprint

> **Source**: Live exploration of https://www.mindcrewstaffaug.com/
> **Explored As**: Vendor User (`Chinthana@vortexsoftinnovations.com`)
> **Date**: September 2026
> **Purpose**: Exact blueprint to rebuild this web application

---

## Table of Contents

1. [Application Overview](#1-application-overview)
2. [Technology Stack (Observed)](#2-technology-stack-observed)
3. [User Roles & Access Control](#3-user-roles--access-control)
4. [Application Architecture & Route Map](#4-application-architecture--route-map)
5. [Authentication Module](#5-authentication-module)
6. [Vendor Portal](#6-vendor-portal)
7. [HR Portal](#7-hr-portal)
8. [Admin Portal](#8-admin-portal)
9. [Shared Components & UI](#9-shared-components--ui)
10. [Data Models & Entities](#10-data-models--entities)
11. [Workflows & Business Logic](#11-workflows--business-logic)
12. [Database Schema (Inferred)](#12-database-schema-inferred)
13. [Pages to Build Checklist](#13-pages-to-build-summary-checklist)
14. [Live Application Statistics](#14-live-application-statistics-observed)
15. [Key Observations & Notes](#15-key-observations--notes)

---

## 1. Application Overview

**Mindcrew HireHub** is a **Vendor Portal / Staffing Augmentation Platform** built for **MindCrew Technologies** ("Inspired Mind Creates Living"). It serves as a three-sided marketplace connecting:

- **Vendors** (staffing agencies/recruiters) who submit candidates for open positions
- **HR Team** who manage job requirements, screen candidates, and schedule interviews
- **Admins** who manage users, vendors, system settings, and overall platform operations

### Key Value Proposition
- Post job requirements with detailed specs
- Allow registered vendors to browse & submit candidates
- Book screening slots with calendar integration
- Track submissions through an interview pipeline
- Manage compliance documents between company and vendors

---

## 2. Technology Stack (Observed)

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js (React) — Server-Side Rendered |
| Routing | Next.js App Router (file-based routing with `/Vendor-dashboard/*`) |
| Styling | Tailwind CSS (utility classes observed in DOM) |
| Icons | Lucide Icons / React Icons |
| UI Components | Custom component library with glassmorphism design |
| Authentication | JWT-based session auth with "Keep me signed in" (Remember Me) |
| File Upload | Drag & Drop with PDF/DOC/DOCX support (max 5MB) |
| Calendar Integration | Date picker with time slot selection |
| Video Meetings | Google Meet integration (meeting links in submissions) |
| Dark Mode | Full dark/light mode toggle |
| Notifications | Real-time notification system (badge count observed: 22+) |

---

## 3. User Roles & Access Control

### 3.1 Role Hierarchy

```
┌─────────────────────────────────────────┐
│                 ADMIN                   │
│   Full system access + user management  │
├─────────────────────────────────────────┤
│                  HR                     │
│   Requirements + Candidates + Reports   │
├─────────────────────────────────────────┤
│                VENDOR                   │
│   Browse + Submit + Track candidates    │
└─────────────────────────────────────────┘
```

### 3.2 Role Capabilities

| Feature | Admin | HR | Vendor |
|---------|-------|----|--------|
| Create job requirements | ✅ | ✅ | ❌ |
| Manage vendors | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| View all submissions | ✅ | ✅ | Own only |
| Browse requirements | ✅ | ✅ | ✅ |
| Submit candidates | ❌ | ❌ | ✅ |
| Schedule screenings | ❌ | ✅ | ✅ |
| Approve screenings | ❌ | ✅ | ❌ |
| View analytics | ✅ | ✅ | Limited |
| Manage documents | ✅ | ✅ | Own only |
| System settings | ✅ | ❌ | ❌ |

### 3.3 Route-Based Access Control

| Route Prefix | Role |
|--------------|------|
| `/` (Login) | Public |
| `/forgot-password` | Public |
| `/Vendor-dashboard/*` | Vendor |
| `/dashboard/*` | Admin / HR |
| `/admin/*` | Admin only |

---

## 4. Application Architecture & Route Map

### Complete Route Sitemap

```
/ (Root)
├── / → Login Page
├── /forgot-password → Password Reset
│
├── /Vendor-dashboard (Vendor Portal)
│   ├── /Vendor-dashboard → Vendor Home Dashboard
│   ├── /Vendor-dashboard/browse-requirements → Browse Job Requirements
│   ├── /Vendor-dashboard/submissions → My Submissions
│   └── /Vendor-dashboard/documents → Vendor Documents
│
├── /dashboard (Admin/HR Portal — Auth Protected)
│   ├── /dashboard → Admin/HR Home Dashboard
│   ├── /dashboard/requirements → Manage Requirements
│   ├── /dashboard/vendors → Vendor Management
│   ├── /dashboard/candidates → All Candidates
│   ├── /dashboard/submissions → All Submissions
│   ├── /dashboard/interviews → Interview Management
│   ├── /dashboard/documents → Document Management
│   ├── /dashboard/users → User Management (Admin)
│   ├── /dashboard/settings → System Settings (Admin)
│   └── /dashboard/reports → Reports & Analytics
│
└── * → Redirect to appropriate dashboard or 404
```

---

## 5. Authentication Module

### 5.1 Login Page

- **URL**: `https://www.mindcrewstaffaug.com/`
- **Page Title**: `Mindcrew HireHub - Sign In`

#### Layout
```
┌────────────────────────────────────────────┐
│  [Logo] MindCrew Technologies              │
│  "Inspired Mind Creates Living"            │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │         Sign In                      │  │
│  │  Enter your credentials to access    │  │
│  │  your account                        │  │
│  │                                      │  │
│  │  [Username or Email         ]        │  │
│  │  [Password              👁️  ]        │  │
│  │                                      │  │
│  │  ☐ Keep me signed in  Forgot pass?  │  │
│  │                                      │  │
│  │  [      Sign In      ] ← gradient   │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Need help? Contact your system admin      │
│  © 2024 Mindcrew HireHub. All rights rsv.  │
└────────────────────────────────────────────┘
```

#### Form Fields

| Field | Type | ID | Placeholder | Validation |
|-------|------|----|-------------|------------|
| Username or Email | text/email | `username` | "Enter your username or email" | Required, valid email |
| Password | password | `password` | "Enter your password" | Required, min 8 chars |
| Keep me signed in | checkbox | `remember` | — | Optional |

#### Actions
- **Sign In button**: POST credentials, JWT token returned, redirect to role-specific dashboard
- **Forgot password?** link → `/forgot-password` page
- **Password toggle** (eye icon): Show/hide password text

#### Post-Login Routing Logic
```
if (user.role === 'vendor') → redirect to /Vendor-dashboard
if (user.role === 'hr') → redirect to /dashboard
if (user.role === 'admin') → redirect to /dashboard (with admin privileges)
```

### 5.2 Forgot Password Page

- **URL**: `/forgot-password`
- **Fields**: Email input
- **Action**: Send password reset email

---

## 6. Vendor Portal

### 6.1 Vendor Dashboard

- **URL**: `/Vendor-dashboard`
- **Page Title**: `Vendor Dashboard`

#### Header Bar
| Element | Description |
|---------|-------------|
| Sidebar toggle | Collapse/expand sidebar |
| Back button | Navigate back |
| Page title | "Vendor Dashboard" |
| Dark mode toggle | Light/Dark theme switch |
| Notification bell | Badge with unread count (22+ observed) |
| User profile chip | Shows email + role, click for dropdown |

#### Welcome Banner
```
┌──────────────────────────────────────────────┐
│  Welcome back, chinthana@vortexsoft...!       │
│  Manage your submissions and find             │
│  new opportunities                            │
└──────────────────────────────────────────────┘
```

#### Metrics Cards (3 cards)

| Card | Value | Sub-text |
|------|-------|---------|
| Total Submissions | 7 | +0 this week |
| Screening Approved | 0 | Success rate: 0% |
| Available Requirements | 236 | [Browse Now] link |

#### Recent Submissions Feed

Table showing last 5 submissions:

| Column | Description |
|--------|-------------|
| Candidate Name | Full name of submitted candidate |
| Job Title | The requirement they were submitted for |
| Date | Submission date (DD/MM/YYYY format) |

**Sample data observed:**
- Yogesh Sunil Punde → Data Scientist (29/05/2026)
- Yogesh Sunil Punde → Data Scientist - Analytics (29/05/2026)
- Ashutosh Joshi → Data Engineer - Acc03 (31/01/2026)
- YOGESH PUNDE → Data Engineer - Acc03 (31/01/2026)
- MAHESH YANNAWA → Data Scientist (27/01/2026)

#### Sidebar Navigation (Vendor)
```
┌────────────────┐
│ [Logo]         │
├────────────────┤
│ 📊 Dashboard   │ → /Vendor-dashboard
│ 🔍 Browse Req  │ → /Vendor-dashboard/browse-requirements
│ 📄 Submissions │ → /Vendor-dashboard/submissions
│ 📁 Documents   │ → /Vendor-dashboard/documents
├────────────────┤
│ 🚪 Sign Out    │ (bottom)
└────────────────┘
```

---

### 6.2 Browse Requirements

- **URL**: `/Vendor-dashboard/browse-requirements`

#### Summary Metric Cards (3 cards)

| Card | Value |
|------|-------|
| Open Requirements | 5 |
| Onsite Opportunities | 14 |
| Remote Opportunities | 187 |

#### Requirements List/Table

**Filter Controls:**
- Search bar (text input) — filter by job title or keywords
- Job Type dropdown — All / Remote / Onsite / Hybrid
- Tab filters: **All Jobs** | **Remote Jobs** | **Onsite Jobs**

**Table Columns:**

| Column | Description |
|--------|-------------|
| Job Title | Name of the open position |
| Experience Required | Years of experience needed |
| Job Type | Remote / Onsite / Hybrid badge |
| Location | Work location |
| Status | Open / Closed / On Hold |
| Posted Date | Date the requirement was posted |
| Actions | View Details (👁️) + Submit Candidate (👤+) icons |

#### Requirement Detail Modal (View Details)

Opened via the eye icon on any requirement row.

**Fields displayed:**
- Job Title
- Job Description (full text)
- Requirements / Responsibilities
- Target Closure Date
- Minimum Experience (years)
- Pricing / Budget
- Mandatory Skills (tags)
- Primary Skills (tags)
- Secondary Skills (tags)
- Job Type badge (Remote/Onsite/Hybrid)
- Location

#### Candidate Submission Modal (Submit Candidate)

Triggered by the user-plus icon. Multi-section modal:

**Section 1: Candidate Details**

| Field | Type | Description |
|-------|------|-------------|
| Candidate Name | text input | Full name |
| Contact No. | tel input | Phone number |
| Email | email input | Candidate email |
| Year of Experience | number | Total years of experience |
| Relevant Experience | number | Years relevant to this role |
| 100% comfortable with JD? | radio (Yes/No) | Candidate JD acknowledgement |

**Section 2: Screening Slot Booking**

| Field | Type | Description |
|-------|------|-------------|
| Select Date | date picker / calendar | Preferred screening date |
| Select Time Slot | dropdown/radio | Available time slots for selected date |

**Section 3: Resume Upload**

| Field | Type | Description |
|-------|------|-------------|
| CV Upload | drag-and-drop / file input | PDF, DOC, DOCX — max 5MB |

**Actions:**
- Submit button — sends candidate data + CV + screening slot booking
- Cancel button — closes modal

---

### 6.3 My Submissions

- **URL**: `/Vendor-dashboard/submissions`

#### Page Controls
- **Search bar** — filter submissions by candidate name or requirement
- **Status filter dropdown** — filter by submission status
- **"My Team — reuse a candidate"** button — opens reuse modal

#### Submissions Table

| Column | Description |
|--------|-------------|
| Candidate Name | Full name of submitted candidate |
| Requirement Title | Job requirement the candidate was submitted for |
| Status | Current pipeline status (Submitted / Screening / Approved / Rejected) |
| Meeting Link | Google Meet link (appears when screening is scheduled) |
| Scheduled At | Date and time of scheduled screening |
| Actions | View, Edit, Delete options |

**Status Values observed:**
- `Submitted` — Initial state after vendor submission
- `Screening Scheduled` — Screening meeting has been booked
- `Interview Scheduled` — Moved to interview stage
- `Offer Offered` — Candidate received an offer
- `Approved` / `Rejected`

#### "My Team — Reuse a Candidate" Modal

Purpose: Re-submit a previously uploaded candidate to a new requirement without re-uploading their CV.

**Modal Fields:**
- Select Requirement (dropdown from available requirements)
- Select from Team (list of previously submitted candidates with their CVs)
- Confirm button
- Cancel button

---

### 6.4 Documents

- **URL**: `/Vendor-dashboard/documents`

#### Metric Cards (3 cards)

| Card | Description |
|------|-------------|
| Total Documents | Total count of documents in the system |
| Responses Uploaded | Documents that have been responded to |
| Pending Responses | Documents awaiting vendor response |

#### Document Management Table

| Column | Description |
|--------|-------------|
| Document Name | Name/title of the document |
| Document Type | Category (Contract, NDA, Compliance, etc.) |
| Uploaded By | Who uploaded the document |
| Status | Pending Response / Responded / Approved |
| Upload Date | When the document was uploaded |
| Actions | View / Download / Upload Response |

**Functionality:**
- Search and filter interface for documents
- Upload response to a document request
- Download documents
- View document details

---

## 7. HR Portal

> **Note**: The explored account (Vendor role) does not have direct access to the HR portal. The following is inferred from the Vendor portal's data references and standard staffing platform patterns.

### 7.1 HR Dashboard

- **URL**: `/dashboard`
- **Estimated Metrics:**
  - Total Active Requirements
  - Total Submissions (all vendors)
  - Screenings Scheduled Today
  - Interviews Scheduled
  - Offers Extended
  - Hiring Rate %

### 7.2 Requirements Management

- **URL**: `/dashboard/requirements`

#### Create New Requirement Form

| Field | Type | Description |
|-------|------|-------------|
| Job Title | text | Position name |
| Job Description | rich text / textarea | Full JD |
| Job Type | select | Remote / Onsite / Hybrid |
| Location | text | Work location |
| Minimum Experience | number | Min years required |
| Target Closure Date | date | When to close hiring |
| Budget / Pricing | text/number | Salary range or rate |
| Mandatory Skills | tag input | Must-have skills |
| Primary Skills | tag input | Primary skills |
| Secondary Skills | tag input | Nice-to-have skills |
| Status | select | Open / On Hold / Closed |

#### Requirements List Table

| Column | Description |
|--------|-------------|
| Job Title | Position name |
| Type | Remote/Onsite/Hybrid |
| Location | Office location |
| Status | Open/Closed/On Hold |
| Total Submissions | Count from all vendors |
| Posted Date | Date created |
| Actions | Edit, Close, View Submissions |

### 7.3 Submissions Management (HR View)

- **URL**: `/dashboard/submissions`
- View ALL vendor submissions (not just one vendor)
- Filter by requirement, vendor, date range, status
- Approve/Reject submissions
- Schedule screenings
- Generate Google Meet links
- Move candidates through pipeline stages

### 7.4 Interview Scheduling

- **URL**: `/dashboard/interviews`
- Calendar view of all scheduled screenings
- Google Meet integration
- Send notifications to vendors and candidates

### 7.5 Document Management (HR)

- Upload documents for vendors to respond to
- Review vendor document responses
- Approve/Reject documents

---

## 8. Admin Portal

> **Note**: Admin features are inferred from standard platform patterns and the data visible in the Vendor portal.

### 8.1 Admin Dashboard

- **URL**: `/dashboard` (with admin role)
- All HR metrics +
  - Total Vendors registered
  - Total HR Users
  - System health metrics

### 8.2 User Management

- **URL**: `/dashboard/users`

| Column | Description |
|--------|-------------|
| Name | User full name |
| Email | User email |
| Role | Admin / HR / Vendor |
| Status | Active / Inactive |
| Created Date | Account creation date |
| Actions | Edit, Deactivate, Reset Password |

**Create User Form Fields:**
- Full Name
- Email
- Role (dropdown: Admin / HR / Vendor)
- Password (auto-generated or manual)
- Send welcome email (checkbox)

### 8.3 Vendor Management

- **URL**: `/dashboard/vendors`

| Column | Description |
|--------|-------------|
| Vendor Company Name | Company name |
| Contact Person | Primary contact |
| Email | Vendor email |
| Total Submissions | Lifetime submission count |
| Active Since | Registration date |
| Status | Active / Inactive |
| Actions | View, Edit, Deactivate |

### 8.4 Reports & Analytics

- **URL**: `/dashboard/reports`

**Estimated Reports:**
- Submission Funnel Report
- Vendor Performance Report
- Requirement Closure Rate
- Time-to-Fill Analysis
- Interview Pass Rate

### 8.5 System Settings

- **URL**: `/dashboard/settings`
- Platform branding settings
- Email notification templates
- Integration settings (Google Meet, etc.)
- Default screening slot availability

---

## 9. Shared Components & UI

### 9.1 Header / Top Bar

```
┌──────────────────────────────────────────────────────────┐
│ [≡ Sidebar] [← Back]  Page Title  [🌙 Dark] [🔔22] [👤]  │
└──────────────────────────────────────────────────────────┘
```

| Element | Description |
|---------|-------------|
| Sidebar toggle | Hamburger icon, collapses/expands sidebar |
| Back button | Browser-style back navigation |
| Page title | Current page name |
| Dark mode toggle | Moon/Sun icon switches theme |
| Notification bell | Badge with unread count, opens notification panel |
| User chip | Email + role badge, opens profile dropdown |

### 9.2 User Profile Dropdown

- Profile/Account settings
- Change password
- Sign Out

### 9.3 Notification Panel

- Slide-out panel from top-right
- Shows unread notifications (22+ observed)
- Notification types:
  - New requirement posted
  - Submission status update
  - Screening scheduled
  - Document upload/response
- Mark as read / Mark all as read
- Notification count badge on bell icon

### 9.4 Sidebar Navigation

- Collapsible sidebar (icon-only or icon+text)
- Active state highlighting
- Role-specific menu items
- Sign Out button at bottom

### 9.5 Modals

All modals share consistent pattern:
- Dark overlay backdrop
- Centered white/dark card
- Close button (X) top-right
- Title + subtitle
- Form content
- Action buttons (Submit/Cancel)

### 9.6 Data Tables

All tables share:
- Search bar above table
- Filter dropdowns
- Sortable columns
- Pagination
- Action columns with icon buttons
- Empty state message

### 9.7 Metric Cards

Dashboard metric cards:
- Icon on left
- Large number value
- Label below
- Trend indicator (↑↓)
- Colored accent/gradient

### 9.8 Status Badges

Color-coded status chips:

| Status | Color |
|--------|-------|
| Open | Green |
| Closed | Red/Gray |
| On Hold | Yellow/Orange |
| Remote | Blue |
| Onsite | Purple |
| Hybrid | Teal |
| Submitted | Blue |
| Screening | Yellow |
| Approved | Green |
| Rejected | Red |

---

## 10. Data Models & Entities

### 10.1 User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password_hash: string;
  role: 'admin' | 'hr' | 'vendor';
  vendor_id?: string; // if role is vendor
  is_active: boolean;
  remember_token?: string;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
}
```

### 10.2 Vendor
```typescript
interface Vendor {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  address?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
```

### 10.3 Requirement (Job)
```typescript
interface Requirement {
  id: string;
  title: string;
  description: string;
  job_type: 'remote' | 'onsite' | 'hybrid';
  location: string;
  min_experience: number; // years
  target_closure_date: Date;
  budget?: string;
  mandatory_skills: string[];
  primary_skills: string[];
  secondary_skills: string[];
  status: 'open' | 'on_hold' | 'closed';
  created_by: string; // HR user ID
  posted_date: Date;
  updated_at: Date;
}
```

### 10.4 Candidate Submission
```typescript
interface Submission {
  id: string;
  requirement_id: string;
  vendor_id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  total_experience: number; // years
  relevant_experience: number; // years
  jd_comfortable: boolean; // 100% comfortable with JD
  cv_url: string; // S3/storage path to uploaded CV
  cv_filename: string;
  status: 'submitted' | 'screening_scheduled' | 'screening_done' | 
          'interview_scheduled' | 'offer_offered' | 'approved' | 'rejected';
  screening_date?: Date;
  screening_time_slot?: string;
  meeting_link?: string; // Google Meet URL
  scheduled_at?: Date;
  created_at: Date;
  updated_at: Date;
}
```

### 10.5 Document
```typescript
interface Document {
  id: string;
  vendor_id: string;
  name: string;
  type: 'contract' | 'nda' | 'compliance' | 'other';
  file_url: string;
  uploaded_by: string; // user ID
  response_url?: string; // vendor response file
  status: 'pending_response' | 'responded' | 'approved' | 'rejected';
  created_at: Date;
  updated_at: Date;
}
```

### 10.6 Notification
```typescript
interface Notification {
  id: string;
  user_id: string;
  type: 'new_requirement' | 'submission_update' | 'screening_scheduled' | 'document';
  title: string;
  message: string;
  is_read: boolean;
  related_entity_type?: string;
  related_entity_id?: string;
  created_at: Date;
}
```

### 10.7 Screening Slot
```typescript
interface ScreeningSlot {
  id: string;
  date: Date;
  time: string; // "10:00 AM", "2:30 PM"
  is_available: boolean;
  submission_id?: string; // booked by submission
  created_at: Date;
}
```

---

## 11. Workflows & Business Logic

### 11.1 Candidate Submission Workflow

```
Vendor browses requirements
    │
    ▼
Vendor clicks "Submit Candidate"
    │
    ▼
Vendor fills in candidate details (name, email, phone, experience, JD comfort)
    │
    ▼
Vendor selects screening date & time slot
    │
    ▼
Vendor uploads candidate CV (PDF/DOC/DOCX ≤ 5MB)
    │
    ▼
System creates Submission record (status: "submitted")
    │
    ▼
Google Meet link is generated
    │
    ▼
HR receives notification of new submission
    │
    ▼
HR reviews submission → [Approve / Reject / Reschedule]
    │
    ├── Reject → Vendor notified → Submission status: "rejected"
    │
    └── Approve for Screening → Screening status updated
            │
            ▼
        Screening conducted
            │
            ▼
        HR decision: Move to Interview / Reject
            │
            ├── Reject → Status: "rejected"
            └── Move to Interview → Status: "interview_scheduled"
                    │
                    ▼
                Interview conducted
                    │
                    ▼
                HR: Extend Offer / Reject
                    │
                    ├── Reject → Status: "rejected"
                    └── Offer → Status: "offer_offered"
```

### 11.2 Candidate Reuse Workflow

```
Vendor goes to My Submissions
    │
    ▼
Clicks "My Team — Reuse a Candidate"
    │
    ▼
Selects target requirement from dropdown
    │
    ▼
Picks from previously submitted candidates
    │
    ▼
System re-uses existing CV + candidate data
    │
    ▼
New submission created for the new requirement
```

### 11.3 Document Exchange Workflow

```
Admin/HR uploads document for vendor
    │
    ▼
Vendor receives notification
    │
    ▼
Vendor views document in Documents section
    │
    ▼
Vendor downloads and reviews document
    │
    ▼
Vendor uploads response/signed document
    │
    ▼
Admin/HR reviews response → Approve / Reject
```

---

## 12. Database Schema (Inferred)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'hr', 'vendor')),
  vendor_id UUID REFERENCES vendors(id),
  is_active BOOLEAN DEFAULT TRUE,
  remember_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- Vendors
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Requirements (Job Postings)
CREATE TABLE requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  job_type VARCHAR(20) CHECK (job_type IN ('remote', 'onsite', 'hybrid')),
  location VARCHAR(255),
  min_experience INTEGER,
  target_closure_date DATE,
  budget VARCHAR(100),
  mandatory_skills TEXT[],
  primary_skills TEXT[],
  secondary_skills TEXT[],
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'on_hold', 'closed')),
  created_by UUID REFERENCES users(id),
  posted_date TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Submissions (Candidate Applications)
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_id UUID REFERENCES requirements(id),
  vendor_id UUID REFERENCES vendors(id),
  candidate_name VARCHAR(255) NOT NULL,
  candidate_email VARCHAR(255),
  candidate_phone VARCHAR(20),
  total_experience DECIMAL(4,1),
  relevant_experience DECIMAL(4,1),
  jd_comfortable BOOLEAN,
  cv_url VARCHAR(500),
  cv_filename VARCHAR(255),
  status VARCHAR(30) DEFAULT 'submitted' CHECK (
    status IN ('submitted', 'screening_scheduled', 'screening_done',
               'interview_scheduled', 'offer_offered', 'approved', 'rejected')
  ),
  screening_date DATE,
  screening_time_slot VARCHAR(20),
  meeting_link VARCHAR(500),
  scheduled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  file_url VARCHAR(500),
  uploaded_by UUID REFERENCES users(id),
  response_url VARCHAR(500),
  status VARCHAR(30) DEFAULT 'pending_response' CHECK (
    status IN ('pending_response', 'responded', 'approved', 'rejected')
  ),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50),
  title VARCHAR(255),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  related_entity_type VARCHAR(50),
  related_entity_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Screening Slots
CREATE TABLE screening_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_date DATE NOT NULL,
  slot_time VARCHAR(20) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  submission_id UUID REFERENCES submissions(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 13. Pages to Build (Summary Checklist)

### Public Pages
- [ ] `/` — Login page
- [ ] `/forgot-password` — Password reset

### Vendor Portal Pages
- [ ] `/Vendor-dashboard` — Vendor home dashboard
- [ ] `/Vendor-dashboard/browse-requirements` — Browse requirements
- [ ] `/Vendor-dashboard/submissions` — My submissions
- [ ] `/Vendor-dashboard/documents` — Vendor documents

### HR Portal Pages
- [ ] `/dashboard` — HR home dashboard
- [ ] `/dashboard/requirements` — Manage requirements (CRUD)
- [ ] `/dashboard/submissions` — All submissions management
- [ ] `/dashboard/interviews` — Interview scheduling
- [ ] `/dashboard/documents` — Document management

### Admin Portal Pages
- [ ] `/dashboard` — Admin home dashboard (extends HR)
- [ ] `/dashboard/users` — User management
- [ ] `/dashboard/vendors` — Vendor management
- [ ] `/dashboard/reports` — Reports & analytics
- [ ] `/dashboard/settings` — System settings

### Shared Components
- [ ] Auth layout (login wrapper)
- [ ] App layout (sidebar + header)
- [ ] Sidebar component (role-based menu)
- [ ] Header bar component
- [ ] Notification panel
- [ ] User profile dropdown
- [ ] Metric card component
- [ ] Data table component (search, filter, pagination)
- [ ] Modal component
- [ ] Status badge component
- [ ] File upload (drag & drop) component
- [ ] Date/time slot picker component
- [ ] Dark mode toggle

---

## 14. Live Application Statistics (Observed)

| Metric | Value |
|--------|-------|
| Total Requirements in System | 236 (Browse page count) |
| Open Requirements | 5 |
| Remote Opportunities | 187 |
| Onsite Opportunities | 14 |
| Total Submissions (this vendor) | 7 |
| Screening Approved | 0 |
| Unread Notifications | 22+ |

---

## 15. Key Observations & Notes

1. **Login auto-routes by role**: After login, the app detects user role and redirects to appropriate portal
2. **Vendor has read-only access to requirements**: Can browse but cannot create/edit
3. **Google Meet integration**: Meeting links are automatically generated for screening sessions
4. **CV upload limit**: 5MB max, accepts PDF/DOC/DOCX
5. **Candidate reuse feature**: Vendors can reuse previously submitted candidates' profiles
6. **Real-time notifications**: 22+ notifications observed, suggesting active notification system
7. **Dark mode**: Full dark/light theme toggle available in header
8. **Mobile responsive**: Sidebar collapse suggests responsive design
9. **Requirement count discrepancy**: Dashboard showed 236 available requirements while only 5 are "Open" — likely includes all historical/closed listings
10. **Date format**: DD/MM/YYYY format used throughout the app
11. **URL naming convention**: Vendor portal uses `/Vendor-dashboard` (capital V, hyphenated)
12. **Status pipeline**: submitted → screening_scheduled → screening_done → interview_scheduled → offer_offered → approved/rejected

---

*Blueprint generated from live exploration of https://www.mindcrewstaffaug.com/*
*Explored with credentials: Chinthana@vortexsoftinnovations.com (Vendor Role)*
*Last updated: September 2026*
