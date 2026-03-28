# Complaint Management System (CMS) - JSPM's Sawant Polytechnic

A premium, role-based digital infrastructure for grievance lifecycle management. Designed to enhance institutional transparency, improve resolution turnaround times, and provide data-driven insights for college administration.

---

## 🏗️ System Architecture & Workflow

The CMS follows a strictly segregated **Role-Based Access Control (RBAC)** architecture:

1. **User (Student/Staff)**: Submit complaints with attachments, track real-time status with audit logs, and download official grievance PDFs.
2. **Department Head (DH)**: Manage complaints assigned to their specific department (e.g., Computer, Mechanical, Civil), update internal remarks, and escalate unresolved issues.
3. **Super Admin**: Global oversight, system configuration (Maintenance mode, App name), department Head assignments, and bulk management operations.

---

## 🚀 Premium Features (Week 4 Final)

- **Bulk Administrative Management**: Multi-select status updates, assignments, and deletions for high-volume handling.
- **Micro-Animated Dashboard**: Full statistics dashboard with `recharts` for visualization and `skeleton` loading for high perceived performance.
- **Official Documentation**: Generation of professional PDF grievance reports with institutional branding using `jspdf-autotable`.
- **Intelligent Filtering**: Advanced search across Ticket IDs, Departments, Status, and Priority combinations.
- **Responsive Profile Hub**: Customizable user profiles with notification preferences (Email/Browser toggles) and secure field validation.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (React 19, Server Actions, App Router)
- **Database**: MongoDB Atlas with Mongoose ODM
- **Analytics**: Recharts & Dashboard Statistics API
- **UI/UX**: Tailwind CSS v4, Shadcn/UI, Lucide Icons, Sonner (Toasts)
- **Reporting**: jspdf, jspdf-autotable, xlsx

---

## 📦 Final Production Build

To run the system in production mode:

```bash
# 1. Install dependencies
npm install

# 2. Build the optimized production bundle
npm run build

# 3. Start the production server
npm run start
```

---

## 📄 Final Project Submission

| Field | Detail |
|-------|--------|
| **Institution** | JSPM's Jayawantrao Sawant Polytechnic, Pune |
| **Academic Year** | 2025-26 |
| **Department** | Computer Engineering (TYCO3) |

### Development Team
- **Shubham Irkar**: Team Lead & Backend Architect
- **Jayraj Nhavale**: Lead Frontend Developer
- **Atharva Bhujbal**: Database & API Integration
- **Raj Vairat**: UI/UX Designer & Performance QE

---

## ⚖️ License
Released under MIT License. © 2025-26 JSPM Project Team.
