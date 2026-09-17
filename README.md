# vendormanagementportal

**MindCrew HireHub** — Comprehensive Vendor Management Portal & Staff Augmentation System.

Built with **Next.js 16 (Turbopack)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **SQLite**.

---

## Portals & Roles

- **Admin Portal (`/dashboard`)**: Manage requirements, review vendor submissions, track active vendors, user management, and view company analytics.
- **HR Portal (`/dashboard`)**: Create and post job requirements, schedule candidate screening interviews, track candidate pipeline status, and coordinate documents.
- **Vendor Portal (`/Vendor-dashboard`)**: Browse open requirements, submit candidates with multi-step validation, reuse talent profiles across requirements, track submission statuses, and manage contracts/NDAs.

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@mindcrew.com` | `Admin@123` |
| **HR** | `sarah@mindcrew.com` | `Sarah@123` |
| **Vendor** | `chinthana@vortexsoftinnovations.com` | `Qwerty@09` |

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database & Seed Data
```bash
# Push schema to SQLite database
npx prisma db push

# Seed initial requirements, submissions, vendors, and demo accounts
npx prisma db seed
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism & Haikei generative SVG graphics
- **Database & ORM**: Prisma ORM with SQLite
- **Authentication**: Bcrypt-hashed credentials & REST API route handlers
- **Icons**: Lucide React
