# 🎓 Complaint Management System
### JSPM's Jayawantrao Sawant Polytechnic, Pune
#### Computer Engineering Department — TYCO3 | Academic Year 2025-26

---

## 📋 Project Overview

The **Complaint Management System** is a full-stack web application built by a team of TYCO3 students at JSPM's Jayawantrao Sawant Polytechnic. It provides a structured digital platform for students, teachers, and staff to formally file complaints related to infrastructure, academics, hostel, library, canteen, and administration — and allows administrators to track, manage, and resolve them efficiently.

This eliminates the need for paper-based complaint forms and untracked verbal grievances, replacing them with a transparent, role-based digital pipeline.

---

## 👥 Project Team

| Name | Enrollment No. | Role |
|------|----------------|------|
| **Shubham Mirarkar** | 23211830520 | Team Lead & Backend Developer |
| **Jayraj Nawhale** | 23211830526 | Frontend Developer |
| **Atharva Bhujbal** | 23211830502 | Advanced Features & Database |
| **Raj Vairat** | 23211830553 | UI/UX & Testing |

---

## ✨ Features

### For Students / Users
- 🔐 **Secure Registration & Login** with encrypted passwords
- 📝 **Submit Complaints** with category, priority, department, and file attachments
- 📋 **My Complaints Dashboard** — view all personal complaints with live status
- 🔍 **Advanced Search** — filter by status, category, priority, date range
- 📜 **History Timeline** — see every action ever taken on a complaint
- 🖼️ **Attachment Gallery** — view uploaded photos and PDFs
- ⚠️ **Escalation** — escalate unresolved complaints with a reason
- 🔔 **Real-time Notifications** — bell icon with unread count (polls every 30s)
- 👤 **User Profile** — edit name, phone, change password, upload avatar
- 🎟️ **Auto-generated Ticket IDs** like `CMP-20250115001`

### For Administrators
- 🛡️ **Protected Admin Dashboard** — accessible only to ADMIN role
- 📊 **Live Statistics** — total, pending, in-progress, escalated, resolved counts
- 📈 **Dashboard Charts** — Status pie, Category bar, Daily line (Recharts)
- 📂 **All Complaints View** — manage every complaint across the institution
- 🔍 **Advanced Filtering** — filter by Status, Category, Priority, Date, Search
- ✅ **Status Management** — move tickets through entire lifecycle
- 🗂️ **Bulk Operations** — update status or assign multiple complaints at once
- 👥 **User Management** — view users, promote roles, manage accounts
- 📄 **Reports & Analytics** — comprehensive reports with PDF and Excel export
- ⚙️ **System Settings** — configure app name, escalation days, file limits
- 🏢 **Department Management** — add, edit, delete departments

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | JavaScript (ES6+) |
| **Frontend Styling** | Tailwind CSS |
| **UI Components** | Shadcn/UI |
| **Charts** | Recharts |
| **Database** | MongoDB (via MongoDB Atlas) |
| **ORM** | Mongoose |
| **Authentication** | Custom session cookies (HTTP-Only) |
| **Password Hashing** | bcryptjs |
| **File Upload** | Node.js `fs` + Next.js `formData()` |
| **PDF Export** | jspdf |
| **Excel Export** | xlsx |
| **Version Control** | Git & GitHub |

---

## 📂 Project Folder Structure

```
src/
├── app/
│   ├── (auth)/                    ← Public login & register pages
│   ├── dashboard/                 ← Protected student area
│   │   ├── page.jsx               ← User home dashboard
│   │   ├── complaints/            ← My Complaints + Detail + New
│   │   ├── notifications/         ← Notifications page
│   │   └── profile/               ← User profile page
│   └── admin/                     ← Protected admin-only area
│       ├── page.jsx               ← Admin dashboard with charts
│       ├── complaints/            ← All complaints + detail
│       ├── users/                 ← User management
│       ├── reports/               ← Reports & analytics page
│       └── settings/              ← System settings page
│
├── api/
│   ├── auth/                      ← login, register, logout, me
│   ├── complaints/                ← CRUD + status + remarks + history + escalate
│   ├── complaints/bulk/           ← Bulk status update, assign, delete
│   ├── notifications/             ← CRUD + mark read
│   ├── upload/                    ← File upload route
│   ├── reports/                   ← Overview + PDF + Excel export
│   ├── users/                     ← Profile + password + avatar
│   └── admin/                     ← Settings + departments
│
├── components/
│   ├── complaints/                ← ComplaintForm, AdvancedSearch, HistoryTimeline,
│   │                                 FileUpload, AttachmentGallery, EscalateButton
│   ├── charts/                    ← StatusPieChart, CategoryBarChart, DailyLineChart
│   ├── notifications/             ← NotificationBell, NotificationList
│   ├── reports/                   ← ReportCard, DateRangePicker, ExportButtons
│   ├── profile/                   ← ProfileForm, PasswordForm, AvatarUpload
│   └── layout/                    ← Sidebar (with NotificationBell)
│
├── models/
│   ├── User.js                    ← User schema + indexes + avatar field
│   ├── Complaint.js               ← Complaint schema + 7 indexes + attachments
│   ├── Notification.js            ← Notification schema + indexes
│   ├── ComplaintHistory.js        ← History/audit trail schema
│   ├── Setting.js                 ← Key-value settings model
│   └── Department.js              ← Department management model
│
└── lib/
    ├── auth.js                    ← Session cookie utilities
    ├── db.js                      ← MongoDB connection handler
    ├── notifications.js           ← createNotification, notifyStatusChange helpers
    ├── history.js                 ← recordHistory helper
    ├── upload.js                  ← validateFile, saveFile helpers
    ├── dateUtils.js               ← formatTimeAgo, formatDate helpers
    └── cache.js                   ← In-memory cache with TTL

public/
└── uploads/
    ├── complaints/                ← Complaint file attachments
    └── avatars/                   ← User profile photos

docs/
├── API_DOCS.md                    ← Full API documentation
├── USER_MANUAL.md                 ← User guide
└── DEPLOYMENT.md                  ← Deployment instructions
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** or **yarn**
- A **MongoDB Atlas** account (free tier is sufficient)

### 1. Clone the Repository

```bash
git clone https://github.com/jayraj7576/Complaint-Management-System.git
cd Complaint-Management-System
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/complaint-system
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 User Roles

| Role | Access Level |
|------|-------------|
| `USER` | Submit complaints, view own tickets, add remarks, escalate |
| `DEPARTMENT_HEAD` | View department complaints, update status |
| `ADMIN` | Full access — all complaints, all users, reports, settings |

---

## 📅 Development Phases

| Phase | Focus | Key Deliverables |
|-------|-------|--------------------|
| **Phase 1** | Authentication & Setup | Login, Register, Session cookies, Protected dashboard, Home page |
| **Phase 2** | Core Features | Complaint CRUD APIs, Admin dashboard, User management, Status engine |
| **Phase 3** | Advanced Features | Notifications, File Upload, History Timeline, Escalation, Charts, Bulk Ops, AdvancedSearch |
| **Phase 4** | Final Polish | Reports, Settings, Profile, Department Mgmt, PDF/Excel Export, Deployment |

---

## 🔒 Security Features

- **HTTP-Only Session Cookies** — tokens invisible to client-side JavaScript
- **bcryptjs Password Hashing** — non-reversible hashes
- **Role-based API guards** — every endpoint validates user role
- **Middleware Route Protection** — admin pages blocked at routing layer
- **File Type Validation** — both client-side and server-side (JPG, PNG, PDF only, max 5MB)
- **Ownership validation** — users can only view their own complaints

---

## 📊 Complaint Status Flow

```
[PENDING] → [IN_PROGRESS] → [RESOLVED]
                         ↘ [REJECTED]
         → [ESCALATED]
```

Every status change triggers:
1. A **notification** to the complaint owner
2. A **history record** logged in the audit trail

---

## 📖 Team Documentation

| README | Author | Coverage |
|--------|--------|---------|
| [`ATHARVA_README.md`](./ATHARVA_README.md) | Atharva Bhujbal | Phase 3 — Notifications, History, File Upload, Charts, Escalation, Bulk Ops |
| [`RAJ_README.md`](./RAJ_README.md) | Raj Vairat | Phase 3 & 4 — Admin panel integration, UI polish, Testing, User manual |
| [`JAYRAJ_README.md`](./JAYRAJ_README.md) | Jayraj Nawhale | Phase 1 & 4 — Frontend, Auth pages, Profile page |
| [`SHUBHAM_README.md`](./SHUBHAM_README.md) | Shubham Mirarkar | Phase 2 & 4 — All APIs, Reports, Settings, Deployment |
| [`PHASE3_README.md`](./PHASE3_README.md) | All | Phase 3 task plan |
| [`docs/API_DOCS.md`](./docs/API_DOCS.md) | Atharva Bhujbal | Full API reference |

---

## 🚀 Deploy on Vercel

```bash
npm run build   # Verify production build
```

Deploy via [Vercel](https://vercel.com/new). Add `MONGODB_URI` as an environment variable in the Vercel project settings.

---

*JSPM's Jayawantrao Sawant Polytechnic, Pune | Computer Engineering Department | TYCO3 | 2025-26*
