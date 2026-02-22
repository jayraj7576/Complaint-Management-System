# 🚀 My Journey Building the Advanced Features for the Complaint Management System
## By: Atharva Bhujbal (Enrollment: 23211830502)
## Role: Database & Admin Dashboard Developer
## Class: TYCO3 | Academic Year: 2025-26
## Project: Complaint Management System
## Institution: JSPM's Jayawantrao Sawant Polytechnic, Pune

---

## 🛠️ Project Setup & How to Run

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load fonts.

### Learn More About Next.js
- [Next.js Documentation](https://nextjs.org/docs) — learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) — an interactive Next.js tutorial.

### Deploy on Vercel
The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

---

## 📌 Table of Contents

1. Introduction & What I Did
2. The Post Office Analogy (Understanding Notifications)
3. Technology Stack I Used
4. Folder Structure & My Files
5. Chapter 1 — Notification System (Model & APIs)
6. Chapter 2 — File Upload System
7. Chapter 3 — Complaint History Timeline
8. Chapter 4 — Escalation System
9. Chapter 5 — Dashboard Charts
10. Chapter 6 — Bulk Operations (Admin)
11. Chapter 7 — Helper Libraries I Built
12. Chapter 8 — Advanced Search Component
13. Chapter 9 — Security & Validation in Week 3
14. Chapter 10 — Testing My Features
15. Chapter 11 — Bugs I Fixed
16. Chapter 12 — What I Learned
17. Conclusion

---

## 📌 Introduction: What Did I Actually Do?

Hello! My name is Atharva Bhujbal, and I am the **Database & Admin Dashboard Developer** for our Complaint Management System project at JSPM's Jayawantrao Sawant Polytechnic.

Our team's work division:
- **Jayraj Nawhale** — Built the frontend Login, Register, and Home pages (Week 1)
- **Shubham Mirarkar** — Built all the backend APIs for complaints management (Week 2)
- **I (Atharva Bhujbal)** — Built Week 3 advanced features: Notifications, File Uploads, History Timeline, Charts, and Dashboard improvements

In **Week 3**, after Weeks 1 and 2 had already established the core system, my job was to add the **smart features** that make the system feel truly professional and complete:

1. A **Notification System** that automatically tells users when their complaint's status changes
2. A **File Upload System** so students can attach photos or PDF documents to their complaints
3. A **History Timeline** that shows every change ever made to a complaint
4. An **Escalation System** for students to escalate unresolved complaints
5. **Dashboard Charts** showing visual statistics using graphs
6. A **Bulk Operations** tool for admins to update many complaints at once
7. An **Advanced Search** panel with multi-filter capabilities

This document explains everything I built in Week 3, step by step, in terms simple enough for anyone to understand!

---

## 📮 The Post Office Analogy (Understanding the Notification System)

Let me explain the notification system using a post office analogy.

### The Old Way (Before Notifications)
Imagine you submitted a complaint at the school office by putting a letter in the principal's box. Now you have to go check the office every single day to see if anything happened. That is boring, slow, and frustrating!

### The New Way (Our Notification System)
Now imagine the school office has a **special post service**. The moment anyone touches your complaint — changes the status, adds a comment, or resolves it — they immediately **send you a special slip** into your mailbox (your notification inbox).

You see a **red circle** on your mailbox door (the bell icon in the header) saying "You have 3 new slips!" You open the mailbox and read them. Each slip says exactly what happened, when, and to which complaint.

You click a slip and it takes you directly to the complaint in question!

**That entire post office system is what I built in Week 3.**

---

## 🛠️ Technology Stack I Used

| Tool | Purpose |
|------|---------|
| **Next.js 16 App Router** | Framework for building pages and APIs |
| **MongoDB + Mongoose** | Database for storing notifications and history |
| **Recharts** | JavaScript library for drawing the dashboard charts |
| **React `useState` / `useEffect`** | Managing state and running code at the right time |
| **Next.js `formData()`** | Reading uploaded files in API routes |
| **Node.js `fs` module** | Writing uploaded files to the server's disk |
| **JavaScript `setInterval`** | Polling notifications every 30 seconds |
| **Tailwind CSS** | Styling all the UI components |

---

## 📂 Chapter 0: Folder Structure — Files I Created in Week 3

Here is every file I created in Week 3:

```
src/
├── app/
│   ├── api/
│   │   ├── notifications/
│   │   │   ├── route.js          ← GET all notifications (paginated)
│   │   │   ├── read-all/
│   │   │   │   └── route.js      ← PUT mark all as read
│   │   │   └── [id]/
│   │   │       └── route.js      ← PUT mark one read / DELETE one
│   │   ├── upload/
│   │   │   └── route.js          ← POST file upload (validates & saves)
│   │   └── complaints/
│   │       ├── [id]/
│   │       │   └── escalate/
│   │       │       └── route.js  ← POST escalate a complaint
│   │       └── bulk/
│   │           ├── status/
│   │           │   └── route.js  ← PUT bulk status update
│   │           ├── assign/
│   │           │   └── route.js  ← PUT bulk assign complaints
│   │           └── route.js      ← DELETE bulk soft-delete
│   │
│   └── dashboard/
│       └── notifications/
│           └── page.jsx          ← Full notifications page with tabs
│
├── components/
│   ├── notifications/
│   │   ├── NotificationBell.jsx  ← Bell icon in header with dropdown
│   │   └── NotificationList.jsx  ← List of notifications on the page
│   ├── complaints/
│   │   ├── AdvancedSearch.jsx    ← Search bar + filter panel
│   │   ├── HistoryTimeline.jsx   ← Visual timeline of all changes
│   │   ├── FileUpload.jsx        ← File picker with preview
│   │   ├── AttachmentGallery.jsx ← Image gallery + PDF viewer
│   │   └── EscalateButton.jsx    ← Escalation button + modal
│   └── charts/
│       ├── StatusPieChart.jsx    ← Pie chart: complaints by status
│       ├── CategoryBarChart.jsx  ← Bar chart: complaints by category
│       └── DailyLineChart.jsx    ← Line chart: daily complaints trend
│
├── lib/
│   ├── notifications.js          ← createNotification() helper functions
│   ├── history.js                ← recordHistory() helper functions
│   ├── upload.js                 ← saveFile(), validateFile() helpers
│   └── dateUtils.js              ← formatTimeAgo(), formatDate() helpers
│
└── models/
    ├── Notification.js           ← MongoDB Notification schema
    └── ComplaintHistory.js       ← MongoDB ComplaintHistory schema

public/
└── uploads/
    └── complaints/               ← Where uploaded files are saved
```

---

## 🔔 Chapter 1: The Notification System

### Part A: The Database Blueprint (`models/Notification.js`)

Before any notification can be sent or received, the database needs to know what information to store. I created `models/Notification.js` with these fields:

```javascript
// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {   // WHO should receive this notification?
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {    // Short headline: "Complaint Status Updated"
    type: String,
    required: true,
  },
  message: {  // Full text: "Your complaint CMP-20250115 changed to In Progress"
    type: String,
    required: true,
  },
  type: {     // What kind of notification is this?
    type: String,
    enum: ['STATUS_UPDATE', 'NEW_REMARK', 'COMPLAINT_ASSIGNED', 'COMPLAINT_RESOLVED', 'SYSTEM'],
    required: true,
  },
  complaintId: {  // Which complaint is this about? (clickable link)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    default: null,
  },
  isRead: {   // Has the user seen this yet?
    type: Boolean,
    default: false,     // All new notifications start as UNREAD
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Database indexes make queries faster!
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
```

**Why indexes?** When 1000 students all have 50 notifications each, that is 50,000 documents! Without an index, the database must scan all 50,000 to find one user's notifications. With the index, it jumps directly to the right ones instantly — like a book's index versus reading every page!

### Part B: The Notification Helper Functions (`lib/notifications.js`)

Instead of writing the same notification-creation code inside every API, I created a helper file:

```javascript
// lib/notifications.js

// The core function — creates ONE notification document
export async function createNotification(userId, title, message, type, complaintId) {
  await connectDB();
  await Notification.create({ userId, title, message, type, complaintId });
}

// Called automatically when an admin changes a complaint's status
export async function notifyStatusChange(complaintId, oldStatus, newStatus) {
  const complaint = await Complaint.findById(complaintId).select('userId ticketId');
  await createNotification(
    complaint.userId,
    'Complaint Status Updated',
    `Your complaint ${complaint.ticketId} status changed from ${oldStatus} to ${newStatus}.`,
    newStatus === 'RESOLVED' ? 'COMPLAINT_RESOLVED' : 'STATUS_UPDATE',
    complaintId
  );
}
```

**Why put it in a helper file?**
Imagine the status update API and the bulk status update API both need to send status notifications. Without a helper, we would copy-paste the same 10 lines of code twice. If we ever need to change the notification format, we update it in ONE place (the helper) and it automatically applies everywhere!

### Part C: The Notifications API (`app/api/notifications/route.js`)

```javascript
// GET /api/notifications — fetch the current user's notifications
export async function GET(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  // Run 3 database queries at the SAME TIME using Promise.all
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ userId: session.userId })
      .sort({ createdAt: -1 })  // Newest first
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments({ userId: session.userId }),
    Notification.countDocuments({ userId: session.userId, isRead: false }),
  ]);

  return NextResponse.json({ success: true, notifications, unreadCount, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
}
```

**What is `.skip()` and `.limit()`?**
These are how pagination works! If we have 100 notifications and want page 2 (limit: 20):
- `.skip(20)` means "jump over the first 20"
- `.limit(20)` means "only take the next 20"

So we get items 21-40, which is exactly page 2!

---

## 📎 Chapter 2: The File Upload System

### The Big Challenge With File Uploads
File uploads are tricky because unlike regular JSON requests (which just send text), file uploads send the actual file bytes. The browser sends it as `multipart/form-data` — a special format with boundaries separating each part.

### Part A: The Validation Rules (`lib/upload.js`)

```javascript
// lib/upload.js

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB in bytes

export function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, GIF, and PDF files allowed.' };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, error: 'File too large. Maximum size is 5MB.' };
  }
  return { valid: true };
}
```

**Why `5 * 1024 * 1024`?**
Computers measure file sizes in bytes. 1 Kilobyte = 1024 bytes. 1 Megabyte = 1024 KB = 1,048,576 bytes. So 5MB = `5 * 1024 * 1024` = 5,242,880 bytes. Writing it this way makes the code self-documenting!

### Part B: Saving Files to Disk

```javascript
export async function saveFile(file, folder = 'complaints') {
  // Where on the computer should we save it?
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);

  // Create the folder if it doesn't exist yet
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generate a unique filename to prevent overwriting!
  // e.g., "1708520400000-kj3h2.jpg"
  const ext = path.extname(file.name);
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const filePath = path.join(uploadDir, uniqueName);

  // Read the file bytes and write them to disk
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  // Return the public URL path (accessible from the browser)
  return `/uploads/${folder}/${uniqueName}`;
}
```

**Why a unique filename?** If two students both upload a file called `photo.jpg`, the second one would overwrite the first! By prepending the current timestamp (`Date.now()`) and a random string, every filename becomes unique forever.

**Why save to `public/` folder?** Files in Next.js's `public/` folder are automatically served as static files. So a file at `public/uploads/complaints/abc123.jpg` is accessible at `http://localhost:3000/uploads/complaints/abc123.jpg`. No extra configuration needed!

### Part C: The Upload API (`app/api/upload/route.js`)

```javascript
// POST /api/upload
export async function POST(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Read the uploaded file from the request
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  // Validate BEFORE saving — reject bad files early
  const validation = validateFile(file);
  if (!validation.valid) return NextResponse.json({ error: validation.error }, { status: 400 });

  // Save file to disk and get the public URL
  const filePath = await saveFile(file, 'complaints');

  return NextResponse.json({ success: true, filePath, fileName: file.name, fileType: file.type });
}
```

---

## 📜 Chapter 3: The Complaint History Timeline

### Why Track History At All?
Imagine a complaint goes from PENDING → IN_PROGRESS → REJECTED. If a student asks "Why was it rejected? And when?", without history there is no way to know. The history system creates a permanent audit trail of every change.

### The History Model (`models/ComplaintHistory.js`)

```javascript
const complaintHistorySchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true,
  },
  action: {
    type: String,
    // What kind of change was this?
    enum: ['CREATED', 'STATUS_CHANGED', 'REMARK_ADDED', 'ASSIGNED', 'PRIORITY_CHANGED', 'ATTACHMENT_ADDED'],
    required: true,
  },
  previousValue: { type: String, default: null }, // e.g., "PENDING"
  newValue: { type: String, default: null },       // e.g., "IN_PROGRESS"
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});
```

### The History Helper (`lib/history.js`)

```javascript
// Record any change to a complaint
export async function recordHistory(complaintId, action, previousValue, newValue, userId) {
  await ComplaintHistory.create({
    complaintId,
    action,
    previousValue,
    newValue,
    performedBy: userId,
  });
}
```

Example usage in the status update API:
```javascript
// Before: PENDING, After: IN_PROGRESS
await recordHistory(
  complaintId,
  'STATUS_CHANGED',
  'PENDING',   // previous value
  'IN_PROGRESS', // new value
  adminUserId  // who did it
);
```

### The `HistoryTimeline.jsx` Component

The timeline component receives the history array and draws a vertical timeline:

```
Today
  ●  🔄  Status changed from PENDING to IN_PROGRESS (by Admin)       2 hours ago
  ●  💬  Comment added (by Admin)                                    5 hours ago

Yesterday
  ●  📝  Complaint submitted (by Rahul Sharma)                       1 day ago
```

Each event gets a color-coded dot:
- 🟦 Blue = Created
- 🟩 Green = Status Changed
- 🟣 Purple = Remark Added
- 🟠 Orange = Assigned
- 🔴 Red = Priority Changed

---

## ⚠️ Chapter 4: The Escalation System

### What Is Escalation?
Imagine a student submits a broken water tap complaint. 5 days pass and nothing happens. The student should be able to "escalate" — meaning formally notify a higher authority that the complaint is being ignored!

### The Escalation API (`app/api/complaints/[id]/escalate/route.js`)

```javascript
export async function POST(req, { params }) {
  const { id } = await params;
  const { reason, escalateTo } = await req.json();

  // Must provide a reason
  if (!reason?.trim()) {
    return NextResponse.json({ error: 'Reason is required' }, { status: 400 });
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Security check: only the complaint's owner can escalate
  const isOwner = complaint.userId.toString() === session.userId;
  if (!isOwner && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  // Cannot escalate an already-escalated complaint
  if (complaint.status === 'ESCALATED') {
    return NextResponse.json({ error: 'Already escalated' }, { status: 400 });
  }

  // Update the status
  complaint.status = 'ESCALATED';
  await complaint.save();

  // Record this in history
  await recordHistory(id, 'STATUS_CHANGED', 'PENDING', 'ESCALATED', session.userId);

  // Send a notification to the complaint's owner
  await createNotification(complaint.userId, 'Complaint Escalated', `Your complaint ${complaint.ticketId} has been escalated. Reason: ${reason}`, 'STATUS_UPDATE', id);

  return NextResponse.json({ success: true });
}
```

The `EscalateButton.jsx` component shows the button only when it's possible to escalate (not already resolved/escalated/rejected), and shows a confirmation modal asking for a reason before sending the API call.

---

## 📊 Chapter 5: Dashboard Charts

### Why Charts?
Numbers like "Total: 45, Pending: 12, Resolved: 28" are hard to analyze at a glance. A visual pie chart or bar chart makes the distribution immediately obvious.

I used a library called **Recharts** to draw responsive, animated charts in React. Think of Recharts as a box of ready-made chart templates — I just hand it the data and it draws the picture.

### Installation
```bash
npm install recharts
```

### Status Pie Chart (`StatusPieChart.jsx`)
Shows the percentage split between Pending, In Progress, Resolved etc.

```jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// I first count how many complaints have each status
const chartData = complaints.reduce((acc, c) => {
  acc[c.status] = (acc[c.status] || 0) + 1;
  return acc;
}, {});
// Result: { PENDING: 12, RESOLVED: 28, IN_PROGRESS: 5 }

// Then convert to the format Recharts expects
const data = Object.entries(chartData).map(([name, value]) => ({ name, value }));
// Result: [{ name: 'PENDING', value: 12 }, { name: 'RESOLVED', value: 28 }, ...]

return (
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie data={data} dataKey="value" outerRadius={80}>
        {data.map((entry, i) => <Cell key={i} fill={STATUS_COLORS[entry.name]} />)}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);
```

**`ResponsiveContainer`** automatically adjusts the chart size to fit the screen — very important for mobile views!

### Category Bar Chart (`CategoryBarChart.jsx`)
Shows how many complaints came from each category (HOSTEL, LIBRARY, ACADEMIC etc.) as vertical bars.

### Daily Line Chart (`DailyLineChart.jsx`)
Shows how many complaints were submitted each day over the last 7 days. This helps admins spot if complaints are rising or falling.

```javascript
// Build the last 7 days as data points
function getLast7DaysData(complaints) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push({ date: d.toLocaleDateString(), fullDate: d, count: 0 });
  }

  // For each complaint, find its matching day and increment the counter
  complaints.forEach((c) => {
    const created = new Date(c.createdAt);
    created.setHours(0, 0, 0, 0);
    const day = days.find((d) => d.fullDate.getTime() === created.getTime());
    if (day) day.count++;
  });

  return days;
}
```

---

## 🗂️ Chapter 6: Bulk Operations for Admin

### The Problem Bulk Operations Solve
If a broken pipe affects 15 different classrooms and 15 different students each filed a separate complaint, the admin would normally have to open each complaint one-by-one and change the status 15 times! Bulk operations let them select all 15 at once and change the status in a single click.

### Bulk Status Update (`app/api/complaints/bulk/status/route.js`)

```javascript
// PUT /api/complaints/bulk/status
export async function PUT(req) {
  const { complaintIds, status, remark } = await req.json();

  // Uses MongoDB's updateMany — ONE operation updates ALL selected complaints
  await Complaint.updateMany(
    { _id: { $in: complaintIds } },  // Filter: match any of these IDs
    { $set: { status: status } }
  );

  // Send notifications to each affected user
  await Promise.all(complaints.map(async (c) => {
    await recordHistory(c._id, 'STATUS_CHANGED', c.status, status, session.userId);
    await createNotification(c.userId, 'Status Updated', `Complaint ${c.ticketId} → ${status}`, 'STATUS_UPDATE', c._id);
  }));

  return NextResponse.json({ success: true, updatedCount: complaintIds.length });
}
```

**`$in` MongoDB Operator:** The `{ $in: complaintIds }` filter means "match any document whose `_id` is IN this array." Instead of running 15 separate queries, ONE query handles all 15 IDs simultaneously!

### Soft Delete
The bulk delete uses "soft delete" — instead of truly removing the complaint from the database, we set `isActive: false`. This is much safer because:
1. Deleted complaints can be recovered if it was a mistake
2. Statistics are not lost
3. Legal requirements in real systems often require keeping records

---

## 🔍 Chapter 7: Advanced Search Component

The `AdvancedSearch.jsx` component gives users a powerful way to filter complaints. It has:
1. **Text search** — searches title, description, and ticket ID
2. **Status checkboxes** — can select multiple statuses at once
3. **Category checkboxes** — filter by HOSTEL, LIBRARY etc.
4. **Priority checkboxes** — filter by LOW/MEDIUM/HIGH/URGENT
5. **Date range picker** — see complaints filed between two dates
6. **Sort options** — Newest, Oldest, Priority High → Low

### Debouncing Explained
When the user types into the search box, we DON'T want to call the API for every single character. If someone types "library", that is 7 characters which would trigger 7 API calls!

**Debouncing** means: "Wait until the user stops typing for 300ms, THEN call the API."

```javascript
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);               // Cancel any previous pending call
    timer = setTimeout(() => fn(...args), delay); // Schedule a new one
  };
}

// Now this won't fire until 300ms after the last keystroke
const debouncedSearch = debounce(onSearchChange, 300);
```

### Active Filter Chips
When filters are active, I show small colored chips so the user always knows what they're filtering by:

```jsx
// STATUS: PENDING ×   CATEGORY: HOSTEL ×   PRIORITY: HIGH ×
{activeChips.map((chip, i) => (
  <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
    {chip.label}
    <button onClick={chip.remove}><X className="h-3 w-3" /></button>
  </span>
))}
```

Clicking the `×` on any chip immediately removes that filter!

---

## 📅 Chapter 8: The Date Formatting Helpers (`lib/dateUtils.js`)

Throughout the project, dates appear everywhere — in notification dropdowns, history timelines, and complaint cards. Instead of writing the same formatting code everywhere, I created a shared `dateUtils.js`:

```javascript
// "just now", "5 minutes ago", "3 hours ago", "2 days ago"
export function formatTimeAgo(date) {
  const diffMs = new Date() - new Date(date);
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// "15 Jan, 2025"
export function formatDate(date) { ... }

// "15 Jan, 2025 at 11:30 AM"
export function formatDateTime(date) { ... }
```

---

## 🔒 Chapter 9: Security in Week 3

Every single Week 3 API follows the same security pattern as Weeks 1 & 2:

### 1. Authentication First
Every API starts with:
```javascript
const session = await getSession();
if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
```
No session = immediate rejection.

### 2. Ownership Verification for Escalation
Only the complaint's owner OR an admin can escalate:
```javascript
const isOwner = complaint.userId.toString() === session.userId;
if (!isOwner && session.role !== 'ADMIN') {
  return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
}
```

### 3. File Type Validation Both Sides
The `FileUpload.jsx` component validates types in the browser (for fast feedback). The `POST /api/upload` route validates again on the server (for security). Together they prevent anyone from uploading `.exe`, `.js`, or other dangerous files.

### 4. Admin-Only Bulk Operations
All bulk operations check the role before doing anything:
```javascript
if (session.role !== 'ADMIN') {
  return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
}
```

---

## 🧪 Chapter 10: Testing My Features

### How I Tested the Notification Bell
1. Logged in as a user (Student A)
2. Logged into a separate browser window as admin
3. Changed Student A's complaint status as admin
4. Switched back to Student A's window
5. Verified the red unread count appeared on the bell icon
6. Clicked the bell and confirmed the correct notification appeared
7. Clicked the notification and verified it redirected to the complaint

### How I Tested File Upload
```
Test 1: Upload a valid JPG — Expected: success ✅
Test 2: Upload a .exe file — Expected: error "File type not allowed" ✅  
Test 3: Upload a 10MB image — Expected: error "File too large" ✅
Test 4: Upload 3 files — Expected: all 3 succeed ✅
Test 5: Try uploading 4th file — Expected: button disabled ✅
```

### How I Tested Charts
1. Made sure the Recharts library was installed (`npm install recharts`)
2. Went to the Admin Dashboard
3. Verified all 3 charts rendered (pie, bar, line)
4. Submitted a new complaint, refreshed, and verified the line chart updated
5. Tested on a narrow mobile screen — verified charts resize correctly

---

## 🐛 Chapter 11: Bugs I Fixed

### Bug #1: Recharts "You have not imported any charts" Error
When I first installed Recharts and used `<PieChart>`, I got a mysterious error.

**Root Cause:** I was importing from `recharts` directly in a Server Component. Recharts is a client-side library and uses browser APIs.

**Fix:** Added `'use client';` at the top of all three chart component files.

### Bug #2: Notification Bell Not Showing New Count
After an admin updated a status, the notification bell still showed the old unread count.

**Root Cause:** The bell was only fetching notifications once on page load and never again.

**Fix:** Added a `setInterval` to poll the API every 30 seconds:
```javascript
useEffect(() => {
  fetchNotifications();
  const interval = setInterval(fetchNotifications, 30000); // 30 seconds
  return () => clearInterval(interval); // Clean up on component unmount!
}, []);
```

The `return () => clearInterval(interval)` part is very important — it stops the timer when the user navigates away, preventing memory leaks!

### Bug #3: File Preview Didn't Show For Uploaded Images
After uploading successfully, the image preview wasn't appearing.

**Root Cause:** I was storing the `File` object in state, but after the API responded, I was replacing it with the URL string — but the preview was watching the old `File` object.

**Fix:** Stored the full attachment object returned from the API (containing `filePath`, `fileName`, `fileType`) in the attachments array, and used `filePath` for the preview `src`.

---

## 🌟 Chapter 12: What I Learned

### MongoDB Advanced Techniques
- `Promise.all()` for running multiple queries simultaneously
- `$in` operator for matching multiple IDs in one query
- `updateMany()` for updating multiple documents at once
- Database indexes and why they dramatically speed up queries
- Soft delete vs hard delete (why soft delete is safer)

### React & Next.js Patterns
- `'use client'` directive and how client-side vs server-side rendering affects libraries like Recharts
- `useEffect` cleanup functions (returning a function to stop timers/subscriptions)
- Debouncing user input to prevent excessive API calls
- `formData()` for reading file uploads in Next.js API routes

### File Systems
- Node.js `fs` module for reading and writing files
- `path.join()` vs string concatenation for cross-platform paths
- Why files saved to `public/` are automatically accessible as static URLs in Next.js

### Security
- Validating file types on BOTH client and server side
- Why ownership checks are critical for any user-specific action
- How soft delete preserves data integrity while still hiding records

---

## 🏁 Conclusion: The Full Week 3 Picture

Week 3 transformed our Complaint Management System from a simple data entry tool into a **smart, interactive platform**. Here is a summary of everything I delivered:

### Features Delivered

| Feature | What It Does |
|---------|-------------|
| **Notification System** | Automatically notifies users of every status change, comment, or resolution |
| **Notification Bell** | Live badge in header, dropdown with last 5 notifications, 30-second polling |
| **Notifications Page** | Full history with tabs (All/Unread/by type), pagination |
| **File Upload API** | Secure upload with file type + size validation |
| **FileUpload Component** | Drag-friendly picker with preview and remove buttons |
| **AttachmentGallery** | Image lightbox, PDF viewer/downloader |
| **History Timeline** | Color-coded vertical timeline of every complaint change |
| **Escalation System** | APIRoute + modal component for escalating stuck complaints |
| **Dashboard Charts** | Three responsive Recharts visualizations |
| **Bulk Operations** | Three admin APIs for bulk status update, assign, and soft-delete |
| **Advanced Search** | Debounced text + multi-filter panel + active filter chips |
| **Date Helpers** | `formatTimeAgo()`, `formatDate()`, `formatDateTime()` used everywhere |

### The Week 3 Data Flow

```
Admin changes complaint status
         ↓
Status Update API fires
         ↓
recordHistory() records the change in ComplaintHistory collection
         ↓  
notifyStatusChange() creates a Notification document for the student
         ↓
Student's NotificationBell polls /api/notifications every 30 seconds
         ↓
Red badge appears: "You have 1 new notification!"
         ↓
Student clicks bell → sees "Complaint CMP-20250115 → In Progress"
         ↓
Student clicks notification → navigates to the complaint detail page
         ↓
Student sees HistoryTimeline showing the full audit trail!
```

Every piece works together as a connected system, and I am very proud of what Week 3 has added to our group's project!

---

## 👥 Team Division Reference

| Team Member | Week 3 Tasks |
|-------------|--------------|
| **Atharva Bhujbal** | Notification model & APIs, File upload system, History model & APIs, Escalation API, All 3 chart components, Bulk operation APIs, AdvancedSearch component, All lib helpers (notifications.js, history.js, upload.js, dateUtils.js) |
| **Jayraj Nawhale** | Integrating NotificationBell into Sidebar, Integrating FileUpload into complaint form, Integrating AttachmentGallery into complaint detail page |
| **Shubham Mirarkar** | Connecting history recording & notifications to existing status/remarks APIs, Admin dashboard chart data aggregation queries |

---

*Prepared by: Atharva Bhujbal*
*Enrollment: 23211830502*
*JSPM's Jayawantrao Sawant Polytechnic, Pune*
*Computer Engineering Department — TYCO3*
*Academic Year 2025-26*
