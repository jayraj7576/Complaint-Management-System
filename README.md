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
| **Atharva Bhujbal** | 23211830502 | Admin Dashboard & Database |

---

## ✨ Features

### For Students / Users
- 🔐 **Secure Registration & Login** with encrypted passwords
- 📝 **Submit Complaints** with category, priority, and department selection
- 📋 **My Complaints Dashboard** — view all personal complaints with live status
- 🔍 **Complaint Detail View** — see full history, timeline, and admin remarks
- 💬 **Add Remarks** — communicate with the admin team on any ticket
- 🎟️ **Auto-generated Ticket IDs** like `CMP-20250115001`

### For Administrators
- 🛡️ **Protected Admin Dashboard** — accessible only to users with the ADMIN role
- 📊 **System Statistics** — total, pending, in-progress, and resolved counts
- 📂 **All Complaints View** — manage every complaint filed across the institution
- 🔽 **Advanced Filtering** — filter by Status, Category, and Priority
- ✅ **Status Management** — move tickets from Pending → In Progress → Resolved / Rejected
- 👥 **User Management** — view all registered users, promote roles, deactivate accounts

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | JavaScript (ES6+) |
| **Frontend Styling** | Tailwind CSS |
| **UI Components** | Shadcn/UI |
| **Database** | MongoDB (via MongoDB Atlas) |
| **ORM** | Mongoose |
| **Authentication** | Custom session cookies (HTTP-Only) |
| **Password Hashing** | bcryptjs |
| **Form Validation** | react-hook-form + Zod |
| **Notifications** | Sonner (toast notifications) |
| **Version Control** | Git & GitHub |

---

## 📂 Project Folder Structure

```
src/
├── app/
│   ├── (auth)/                 ← Public login & register pages
│   │   ├── login/page.jsx
│   │   └── register/page.jsx
│   │
│   ├── dashboard/              ← Protected student area
│   │   ├── layout.jsx          ← Auth guard (checks session cookie)
│   │   ├── page.jsx            ← User home dashboard
│   │   └── complaints/
│   │       ├── page.jsx        ← "My Complaints" listing
│   │       ├── new/page.jsx    ← Submit new complaint form
│   │       └── [id]/page.jsx   ← Single complaint detail view
│   │
│   ├── admin/                  ← Protected admin-only area
│   │   ├── middleware.js       ← Role-based route guard
│   │   ├── layout.jsx
│   │   ├── page.jsx            ← Admin overview dashboard
│   │   ├── complaints/
│   │   │   ├── page.jsx        ← All complaints management
│   │   │   └── [id]/page.jsx   ← Admin complaint detail/edit
│   │   └── users/page.jsx      ← User management panel
│   │
│   └── api/                    ← Backend REST API routes
│       ├── auth/
│       │   ├── login/route.js
│       │   ├── register/route.js
│       │   ├── logout/route.js
│       │   └── me/route.js
│       ├── complaints/
│       │   ├── route.js              ← POST (create) / GET (admin all)
│       │   ├── user/route.js         ← GET user's own complaints
│       │   └── [id]/
│       │       ├── route.js          ← GET single complaint
│       │       ├── status/route.js   ← PUT update status
│       │       └── remarks/route.js  ← POST add remark
│       └── users/
│           ├── route.js              ← GET all users (admin)
│           └── [id]/route.js         ← PUT update user role
│
├── components/
│   ├── ui/                     ← Shadcn base components
│   ├── complaints/
│   │   ├── ComplaintCard.jsx
│   │   ├── ComplaintForm.jsx
│   │   ├── ComplaintTable.jsx
│   │   ├── StatusBadge.jsx
│   │   └── PriorityBadge.jsx
│   ├── dashboard/
│   │   └── StatsCard.jsx
│   └── layout/
│       └── Sidebar.jsx
│
├── models/
│   ├── User.js                 ← MongoDB User schema
│   └── Complaint.js            ← MongoDB Complaint schema + Ticket ID hook
│
└── lib/
    ├── auth.js                 ← Session cookie utilities
    └── db.js                   ← MongoDB connection handler
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed:
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
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root of the project:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/complaint-system
```

Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 User Roles

| Role | Access Level |
|------|-------------|
| `USER` | Submit complaints, view own tickets, add remarks |
| `DEPARTMENT_HEAD` | View department complaints, update status |
| `ADMIN` | Full access — all complaints, all users, all statistics |

To promote a user to Admin, go to **Admin Panel → Users** and change their role, or manually update the `role` field in MongoDB Atlas.

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Login and set session cookie |
| POST | `/api/auth/logout` | Clear the session cookie |
| GET | `/api/auth/me` | Get current logged-in user |

### Complaints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/complaints` | Submit a new complaint |
| GET | `/api/complaints` | Get all complaints (Admin only) |
| GET | `/api/complaints/user` | Get current user's complaints |
| GET | `/api/complaints/:id` | Get single complaint details |
| PUT | `/api/complaints/:id/status` | Update complaint status (Admin) |
| POST | `/api/complaints/:id/remarks` | Add a remark/comment |

### Users (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get list of all users |
| PUT | `/api/users/:id` | Update user role / status |

---

## 📅 Development Timeline

| Week | Focus | Key Deliverables |
|------|-------|-----------------|
| **Week 1** | Authentication & Setup | Login, Register, Session cookies, Protected dashboard layout, Home page |
| **Week 2** | Complaints & Admin | All 8 complaint APIs, Admin dashboard, User management, Status update engine, Middleware |

---

## 🔒 Security Features

- **HTTP-Only Session Cookies** — tokens are invisible to client-side JavaScript
- **bcryptjs Password Hashing** — passwords stored as non-reversible hashes
- **Role-based API guards** — every endpoint validates user role before returning data
- **Middleware Route Protection** — admin pages blocked at the routing layer
- **Status forced to PENDING** — users cannot manipulate complaint state on creation
- **Ownership validation** — users can only view their own complaints

---

## 📬 Complaint Status Flow

```
[PENDING] → [IN_PROGRESS] → [RESOLVED]
                         ↘ [REJECTED]
          → [ESCALATED]
```

Every status change is logged with a timestamp and the acting admin's identity, building a full audit trail.

---

## 🗃️ Database Schema Overview

### User
```
name, email, password (hashed), role, department, isActive, createdAt
```

### Complaint
```
ticketId (auto-generated), title, description, category, priority,
status, department, userId (ref), assignedTo (ref),
remarks [ { userId, content, createdAt } ],
resolvedAt, createdAt, updatedAt
```

---

## 📖 Team Documentation

Detailed contribution reports are available in the repository:

- [`JAYRAJ_README.md`](./JAYRAJ_README.md) — Frontend & Authentication (Week 1) by Jayraj Nawhale
- [`SHUBHAM_README.md`](./SHUBHAM_README.md) — Backend APIs & Middleware (Week 2) by Shubham Mirarkar

---

## 🚀 Deploy on Vercel

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js. Make sure to add your `MONGODB_URI` as an Environment Variable in the Vercel project settings.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

*JSPM's Jayawantrao Sawant Polytechnic, Pune | Computer Engineering Department | TYCO3 | 2025-26*
