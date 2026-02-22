# 🚀 My Contributions to the Complaint Management System — Phase 3
## By: Raj Vairat
## Role: Admin Panel Frontend Developer
## Class: TYCO3 | Academic Year: 2025-26
## Project: Complaint Management System
## Institution: JSPM's Jayawantrao Sawant Polytechnic, Pune
## GitHub: [@rajvairat5](https://github.com/rajvairat5)

---

## 🛠️ Project Setup & How to Run

This is a [Next.js](https://nextjs.org) project.

```bash
npm install         # Install all dependencies
npm install recharts  # Required for Week 3 charts
npm run dev         # Start development server
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📌 Table of Contents

1. Introduction & My Role
2. What I Built — Overview
3. Chapter 1 — AdvancedSearch on Admin Complaints Page
4. Chapter 2 — Admin Complaint Detail Page Enhancements
5. Chapter 3 — Understanding the Components I Integrated
6. Chapter 4 — Code Walkthrough
7. Chapter 5 — Testing My Features
8. Chapter 6 — What I Learned
9. Conclusion & Team Summary

---

## 📌 Introduction: My Role in Week 3

Hello! I am **Raj Vairat**, and I am the **Admin Panel Frontend Developer** for Week 3 of our Complaint Management System at JSPM's Jayawantrao Sawant Polytechnic.

Our team is divided into 4 members, each handling specific parts of the system:

| Member | Role | Phase |
|--------|------|-------|
| **Jayraj Nawhale** | User Dashboard Frontend | Phase 1 + Phase 3 |
| **Shubham Mirarkar** | Backend APIs | Phase 2 + Phase 3 |
| **Atharva Bhujbal** | Advanced Features (Notifications, Charts, etc.) | Phase 3 |
| **Raj Vairat** *(me)* | Admin Panel Frontend Integration | Phase 3 |

My specific job in **Phase 3** was to take the components that Atharva built and **integrate them into the Admin side** of the application. While Jayraj handled the user-side (`/dashboard`), I handled the admin-side (`/admin`):

1. **Advanced Search on Admin Complaints Page** — Let admins powerfully filter and search through all student complaints
2. **Admin Complaint Detail Enhancements** — Added History Timeline and Attachment Gallery to the admin view of any complaint

---

## 🏫 The Library Analogy (Understanding My Role)

Imagine a school library. Think of the system like this:

- **Atharva** built all the new tools: a new sorting machine, a notification bell, a filing cabinet, a shelf tracker
- **Jayraj** placed those tools at the **student desk** so students can use them
- **I (Raj)** placed those same tools at the **librarian's desk** so the admin/librarian can use them too

The tools (components) are the same — I just made sure the admin's view of the system has all the same powerful features that students get.

---

## 🛠️ Technology Stack I Used

| Tool | Purpose |
|------|---------|
| **Next.js App Router** | Framework for pages and routing |
| **React `useState` / `useEffect`** | Managing data and component lifecycle |
| **Tailwind CSS** | Styling the UI |
| **Atharva's Components** | `AdvancedSearch`, `HistoryTimeline`, `AttachmentGallery` |
| **`fetch()` API** | Making HTTP requests to the backend |

---

## 📂 Files I Modified or Created

```
app/
└── admin/
    ├── complaints/
    │   ├── page.jsx              ← MODIFIED: Added AdvancedSearch component
    │   └── [id]/
    │       └── page.jsx          ← MODIFIED: Added HistoryTimeline + AttachmentGallery
```

That's it — clean and focused. I integrated 3 components across 2 files.

---

## 🔍 Chapter 1: Advanced Search on the Admin Complaints Page

### What Is the Admin Complaints Page?
This is where the admin sees ALL student complaints in the system — potentially hundreds of them. Without search, the admin has to scroll through everything to find specific complaints!

### What I Added
I integrated Atharva's `<AdvancedSearch />` component at the top of the admin complaints list. This gives the admin:
- **Text search** — search by complaint title, description, or ticket ID
- **Status filter** — show only PENDING, IN_PROGRESS, RESOLVED, ESCALATED, or REJECTED complaints
- **Category filter** — show only HOSTEL, LIBRARY, ACADEMIC, etc.
- **Priority filter** — show only HIGH or URGENT complaints (for quick triage)
- **Date range** — see complaints submitted between two dates
- **Sort options** — Newest First, Oldest First, Priority High→Low

### How I Integrated It

```jsx
// app/admin/complaints/page.jsx

'use client';

import { useState, useEffect } from 'react';
import AdvancedSearch from '@/components/complaints/AdvancedSearch';
import ComplaintTable from '@/components/complaints/ComplaintTable';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async (params = {}) => {
    setLoading(true);
    // Build query string from the search params
    const query = new URLSearchParams();
    if (params.search)   query.set('search', params.search);
    if (params.status?.length) query.set('status', params.status.join(','));
    if (params.category?.length) query.set('category', params.category.join(','));
    if (params.priority?.length) query.set('priority', params.priority.join(','));
    if (params.dateFrom) query.set('dateFrom', params.dateFrom);
    if (params.dateTo)   query.set('dateTo', params.dateTo);
    if (params.sort)     query.set('sort', params.sort);
    if (params.order)    query.set('order', params.order);

    const res = await fetch(`/api/complaints?${query.toString()}`);
    const data = await res.json();
    if (data.success) setComplaints(data.complaints);
    setLoading(false);
  };

  useEffect(() => { fetchComplaints(); }, []);

  // Called by AdvancedSearch whenever filters change
  const handleSearchChange = (params) => {
    setSearchParams(params);
    fetchComplaints(params);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Complaints</h1>
        <p className="text-slate-500 text-sm mt-1">Manage and filter all student complaints.</p>
      </div>

      {/* 🔍 Atharva's AdvancedSearch component */}
      <AdvancedSearch onSearchChange={handleSearchChange} />

      {/* Complaints Table */}
      {loading ? (
        <p className="text-slate-400 text-sm">Loading...</p>
      ) : (
        <ComplaintTable
          complaints={complaints}
          showUser={true}
          basePath="/admin/complaints"
        />
      )}
    </div>
  );
}
```

**What is `new URLSearchParams()`?**
This is a built-in browser tool that converts a JavaScript object into a URL query string. For example, `{ status: 'PENDING', category: 'HOSTEL' }` becomes `?status=PENDING&category=HOSTEL` — which is what we append to the API URL.

---

## 📜 Chapter 2: Admin Complaint Detail Page Enhancements

### What Is the Admin Complaint Detail Page?
When an admin clicks on a specific complaint, they see all its details: title, description, status, remarks. In Week 2, this page was basic. In Week 3, I enhanced it with Atharva's timeline and attachment viewer.

### What I Added
1. **History Timeline** — Admin can now see the full audit trail of every action done on a complaint
2. **Attachment Gallery** — Admin can view photos or PDFs that the student attached

### How I Integrated It

```jsx
// app/admin/complaints/[id]/page.jsx

import HistoryTimeline from '@/components/complaints/HistoryTimeline';
import AttachmentGallery from '@/components/complaints/AttachmentGallery';

// Inside the component, fetch history the same way the user page does:
const [history, setHistory] = useState([]);

useEffect(() => {
  if (id) {
    fetch(`/api/complaints/${id}/history`)
      .then(r => r.json())
      .then(data => { if (data.success) setHistory(data.history); });
  }
}, [id]);

// Then in the JSX, add these two cards:

{/* Attachments (shows only if the complaint has files attached) */}
{complaint.attachments?.length > 0 && (
  <Card>
    <CardContent className="pt-6">
      <AttachmentGallery attachments={complaint.attachments} />
    </CardContent>
  </Card>
)}

{/* History Timeline */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <History className="h-5 w-5" />
      Activity History
    </CardTitle>
  </CardHeader>
  <CardContent>
    <HistoryTimeline history={history} />
  </CardContent>
</Card>
```

**Why is this useful for the admin?**
If a student complains "my complaint status was changed incorrectly," the admin can open the history timeline and see exactly who changed it, when, and what it was before. Complete accountability!

---

## 🧩 Chapter 3: Understanding the Components I Integrated

### `<AdvancedSearch />` (Built by Atharva)
This is a "smart" search bar. It:
- Has a text box with **debounced search** (doesn't fire on every keystroke — waits until you stop typing)
- Has a collapsible filter panel with checkboxes for status, category, priority
- Has a date range picker
- Shows active filter "chips" so the user always knows what's filtered
- Calls `onSearchChange(params)` whenever anything changes

I just needed to pass a function `handleSearchChange` to it, and it handles all the UI automatically!

### `<HistoryTimeline />` (Built by Atharva)
This shows a vertical timeline. It receives a `history` array and draws:
- Color-coded dots (green for status change, purple for remark, etc.)
- Action descriptions like "Status changed from PENDING to IN_PROGRESS by Admin"
- Timestamps like "2 hours ago"
- Grouped by date (Today / Yesterday / This Week / Older)

I just needed to pass the `history` array from the `/api/complaints/[id]/history` API.

### `<AttachmentGallery />` (Built by Atharva)
This shows file attachments in a visual way:
- Images appear as clickable thumbnails → clicking opens a full lightbox view
- PDFs show as a list with "View" and "Download" buttons

I just needed to pass `complaint.attachments` to it.

---

## 🧪 Chapter 4: Testing My Features

### Testing Advanced Search on Admin Page

| Test | Action | Expected Result |
|------|--------|----------------|
| Text search | Type "library" in search box | Only complaints with "library" in title/description show |
| Status filter | Check "PENDING" box | Only pending complaints show |
| Multiple filters | Check "PENDING" + "HIGH priority" | Only pending high-priority complaints show |
| Clear filters | Click "Clear all filters" | All complaints show again |
| Date range | Set From: 2025-01-01, To: 2025-01-31 | Only January complaints show |

### Testing Admin Complaint Detail Enhancements

| Test | Action | Expected Result |
|------|--------|----------------|
| View timeline | Open any complaint, scroll to bottom | Timeline shows all actions taken |
| View attachments | Open complaint that has files | Gallery appears above the remarks |
| View image | Click an image in gallery | Lightbox opens with full-size image |

---

## 🌟 Chapter 5: What I Learned

### Component Reuse
The most powerful lesson: Atharva wrote `<AdvancedSearch />`, `<HistoryTimeline />`, and `<AttachmentGallery />` once. Jayraj used them on the user dashboard. I used the exact same components on the admin panel. This is called **component reusability** — write once, use everywhere. It saves huge amounts of time and keeps the design consistent!

### Building Query Strings
I learned how to convert filter objects into URL query strings using `URLSearchParams`. This is a common real-world pattern for building API requests with multiple parameters.

### `Promise.all` vs Sequential `fetch`
When loading the complaint details AND the history, I could do them one after another (sequential), or both at the same time (parallel). I learned to use parallel loading for better performance:
```javascript
// ✅ Parallel — faster
const [complaintRes, historyRes] = await Promise.all([
  fetch(`/api/complaints/${id}`),
  fetch(`/api/complaints/${id}/history`),
]);
```

---

## 🏁 Conclusion

My Week 3 contribution was focused and precise — take Atharva's powerful new components and make sure the **admin side** of the application has the same capabilities as the user side.

### My Deliverables

| Feature | File Modified |
|---------|--------------|
| AdvancedSearch on admin complaints list | `app/admin/complaints/page.jsx` |
| HistoryTimeline on admin complaint detail | `app/admin/complaints/[id]/page.jsx` |
| AttachmentGallery on admin complaint detail | `app/admin/complaints/[id]/page.jsx` |

By doing this integration work, admins can now:
- ✅ Search and filter hundreds of complaints instantly
- ✅ See the full history/audit trail of any complaint
- ✅ View and download attached photos and documents

---

## 👥 Complete Team Division

| Member | Role | Contributions |
|--------|------|--------------|
| **Jayraj Nawhale** | User Frontend | Login, Register, Home pages + AdvancedSearch on user dashboard + Notifications nav link |
| **Shubham Mirarkar** | Backend | All complaint APIs + status/remarks APIs + Advanced Search API enhancement + Pagination |
| **Atharva Bhujbal** | Advanced Features | Notifications, History, File Upload, Escalation, Charts, Bulk Operations, all lib helpers |
| **Raj Vairat** *(me)* | Admin Frontend | AdvancedSearch on admin page + HistoryTimeline + AttachmentGallery on admin detail |

---

*Prepared by: Raj Vairat*
*Enrollment: ________________*
*JSPM's Jayawantrao Sawant Polytechnic, Pune*
*Computer Engineering Department — TYCO3*
*Academic Year 2025-26*
*GitHub: [@rajvairat5](https://github.com/rajvairat5)*
