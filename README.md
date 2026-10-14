# 🦷 Apex Dental Clinic - Advanced Hospital EHR & CRM System

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀_LIVE_DEMO-dental--crm01.vercel.app-0070F3?style=for-the-badge&logo=vercel&logoColor=white)](https://dental-crm01.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.8-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<br />

### 🌐 **[👉 Click Here to Open Live Website 👈](https://dental-crm01.vercel.app)**

A full-stack, enterprise-grade Dental Clinic Management System (CRM & Electronic Health Records) featuring real-time appointment scheduling, 32-teeth interactive odontogram, AI-assisted emergency triage, 1-click WhatsApp reminders, and printable billing receipts.

</div>

---

## ⚡ Quick Demo Credentials

Aap live website par neeche diye gaye demo accounts se **1-Click** me login karke test kar sakte hain:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **👨‍⚕️ Senior Doctor (Admin)** | `admin@apexdental.com` | `admin123` | Full access: Doctor shifts, appointments, EHR charts, billing, and clinic settings |
| **👩‍💼 Front Desk (Receptionist)** | `reception@apexdental.com` | `clinic123` | Patient check-ins, appointment booking, invoices, WhatsApp reminders |

---

## ✨ Key Features

### 1. 📅 Interactive Appointment Calendar & Timetable
* Real-time chair availability grid with morning, afternoon, and evening clinical slots.
* Filter appointments by doctor, date, or procedure.
* Conflict-prevention logic to eliminate double-booking.

### 2. 🦷 32-Teeth Digital Odontogram (EHR Chart)
* Standard **FDI World Dental Federation** two-digit notation chart.
* Visual jaw mapping: Upper Maxillary (#1–16) and Lower Mandibular (#17–32).
* Chairside condition mapping for cavities, root canals, restorations, and crowns.

### 3. 🚨 AI-Powered Emergency Triage Flagging
* Natural Language Processing (NLP) detection for high-priority cases.
* Flags emergencies automatically when patients report keywords like *"severe"*, *"bleeding"*, *"unbearable pain"*, *"dard"*, *"khoon"*, or *"accident"*.

### 4. 💬 1-Click WhatsApp Patient Reminders
* Instant WhatsApp web/mobile bridge generating formatted appointment confirmation and reminder messages with doctor details, procedure, and clinic map address.

### 5. 💰 Billing, Invoicing & Printable Thermal Receipts
* Detailed dental treatment catalog with categorized pricing.
* Multi-mode payments (Cash, UPI, Credit/Debit Card) with automatic balance tracking.
* Clean, print-ready formal invoice receipts with clinic header and patient details.

### 6. 🔐 Enterprise Authentication & Role-Based Access (RBAC)
* Secure **JWT (JSON Web Token)** stored in `HttpOnly`, `SameSite=Lax` cookies with 7-day session validity.
* Passwords cryptographically hashed using **Bcrypt** (salt rounds = 10).
* Route protection via Next.js middleware proxy.

### 7. 📡 Live Built-in API Debugger & Network Tracker
* Interactive on-screen debugging drawer logging every backend REST API call, status codes (`200 OK`, `401 Unauthorized`), response payload, and network latency.

---

## 🏗️ Architecture & Tech Stack

```text
┌────────────────────────────────────────────────────────┐
│                   CLIENT (BROWSER)                     │
│  Next.js 16 App Router · React 19 · Tailwind CSS v4    │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / REST API
                            ▼
┌────────────────────────────────────────────────────────┐
│                   VERCEL EDGE SERVER                   │
│  Node.js Serverless Route Handlers · JWT Auth Guard    │
└───────────────────────────┬────────────────────────────┘
                            │ Connection Pooler (Port 6543)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   SUPABASE CLOUD                       │
│  PostgreSQL Database (Hosted on AWS ap-southeast-2)    │
│  Tables: clinics, doctors, patients, appointments, etc.│
└────────────────────────────────────────────────────────┘
```

* **Frontend Framework:** Next.js 16.3 (App Router with Turbopack)
* **UI Library:** React 19.2, Lucide React Icons
* **Styling:** Tailwind CSS v4
* **Backend Runtime:** Serverless Node.js Route Handlers (`src/app/api/v1/`)
* **Database:** PostgreSQL (Hosted on **Supabase** via PgBouncer/Supavisor Pooler)
* **Authentication:** JWT HS256 with HttpOnly Cookies & Bcrypt.js
* **Hosting:** Vercel Global Edge Network

---

## 🔌 API Endpoints Summary

All backend APIs are located under `/api/v1/` and return clean JSON payloads:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate user, issue HttpOnly JWT cookie |
| `GET` | `/api/v1/auth/me` | Validate session and load current user profile |
| `POST` | `/api/v1/auth/logout` | Clear auth cookie and terminate session |
| `GET` | `/api/v1/clinic` | Get clinic profile and operating hours |
| `GET` | `/api/v1/availability` | Query free time slots (supports morning/evening/subah/shaam) |
| `GET, POST, PATCH, DELETE` | `/api/v1/appointments` | CRUD operations for chair appointments |
| `GET, POST` | `/api/v1/patients` | Patient directory and medical alert records |
| `GET, POST, PUT, DELETE` | `/api/v1/doctors` | Manage doctors, fees, and clinical shift rosters |
| `GET, PUT` | `/api/v1/services` | Dental procedure pricing and duration catalog |
| `GET, POST, PATCH` | `/api/v1/invoices` | Generate billing invoices and record payments |

---

## 💻 Local Setup & Development

Follow these steps to run the project locally on your machine:

### 1. Clone the Repository
```bash
git clone https://github.com/Saifazad/dental-crm.git
cd dental-crm
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory:
```env
# Cloud Database (Supabase)
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Or Local PostgreSQL
PGUSER=your_user
PGHOST=localhost
PGDATABASE=dental_crm
PGPORT=5432
PGPASSWORD=your_password

# JWT Authentication
JWT_SECRET=super_secret_jwt_dental_crm_key_2026_xyz
```

### 4. Initialize Database
Run the seed script or paste `supabase-setup.sql` into your database SQL editor:
```bash
node scripts/init-db.js
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment

The project is optimized for 1-click deployment on **Vercel** with **Supabase**:

1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the Environment Variables (`DATABASE_URL`, `JWT_SECRET`).
4. Click **Deploy**.

---

## 👨‍💻 Author

* **Developer:** [Saif Azad](https://github.com/Saifazad)
* **Repository:** [Saifazad/dental-crm](https://github.com/Saifazad/dental-crm)
* **Live Deployment:** [dental-crm01.vercel.app](https://dental-crm01.vercel.app)

---

<div align="center">
  <sub>Built with ❤️ for modern dental clinics and healthcare providers.</sub>
</div>
