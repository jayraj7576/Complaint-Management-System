# 🚀 My Journey Building the Backend & APIs for the Complaint Management System
## By: Shubham Mirarkar (Enrollment: 23211830520)
## Role: Team Lead & Backend Developer
## Class: TYCO3 | Academic Year: 2025-26
## Project: Complaint Management System
## Institution: JSPM's Jayawantrao Sawant Polytechnic, Pune

---

## �️ Project Setup & How to Run

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

You can start editing the page by modifying `app/page.jsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load fonts.

### Learn More About Next.js
- [Next.js Documentation](https://nextjs.org/docs) — learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) — an interactive Next.js tutorial.

### Deploy on Vercel
The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

---

## �📌 Table of Contents

1. Introduction & What I Did
2. The Restaurant Analogy (Understanding APIs)
3. Technology Stack I Used
4. Folder Structure & Organization
5. Chapter 1 — Database Design (Mongoose Schema)
6. Chapter 2 — The Ticket ID Auto-Generator
7. Chapter 3 — Create Complaint API (POST /api/complaints)
8. Chapter 4 — Get User Complaints API (GET /api/complaints/user)
9. Chapter 5 — Get All Complaints API (GET /api/complaints) — Admin Only
10. Chapter 6 — Get Single Complaint API (GET /api/complaints/[id])
11. Chapter 7 — Update Status API (PUT /api/complaints/[id]/status)
12. Chapter 8 — Add Remarks API (POST /api/complaints/[id]/remarks)
13. Chapter 9 — User Management API (GET & PUT /api/users)
14. Chapter 10 — The Security Guard (Admin Middleware)
15. Chapter 11 — HTTP Methods Explained
16. Chapter 12 — Error Handling Strategy
17. Chapter 13 — Testing My APIs (Postman)
18. Chapter 14 — Bugs I Fixed Along the Way
19. Chapter 15 — What I Learned
20. Conclusion

---

## 📌 Introduction: What Did I Actually Do?

Hello! My name is Shubham Mirarkar, and I am the **Team Lead and Backend Developer** for our Complaint Management System project at JSPM's Jayawantrao Sawant Polytechnic.

In our team:
- **Jayraj Nawhale** built the beautiful Login/Register frontend pages (Week 1 Frontend)
- **I (Shubham Mirarkar)** built the backend APIs — the data engine powering the system (Week 2 Backend)
- **Atharva Bhujbal** built the Admin Dashboard, User Management pages, and all UI styling & testing

In **Week 2**, building on top of Week 1's authentication system, my job was to build the entire **data processing layer** of the application. This includes:

1. Designing the **Database Schema** (rules for storing data)
2. Building APIs for **creating** and **fetching** complaints
3. Implementing **status update** and **remarks** workflows
4. Creating **User Management** endpoints for admin control
5. Securing the **Admin Dashboard** with role-based Middleware

This document will explain every single step in deep, beginner-friendly detail!

---

## 🍔 The Restaurant Analogy (Understanding APIs)

Before we dive into code, let me explain what an "API" is using something everyone understands: a restaurant.

### The Players

```
👤 The Customer     = The Website User (Student/Teacher/Admin)
📋 The Menu         = The Frontend UI (buttons, forms, tables)
🧑‍🍳 The Kitchen      = The MongoDB Database (stores all data)
🍽️ The Waiter       = The API (the go-between!)
```

### How It Works
1. The Customer (User) looks at the Menu (Frontend) and decides what they want.
2. They tell the Waiter (API) their order — e.g., "I want to submit a new complaint."
3. The Waiter runs to the Kitchen (Database) with the exact order.
4. The Kitchen prepares the data and hands it back to the Waiter.
5. The Waiter brings the result back to the Customer's screen.

**The most important rule:** The Customer can NEVER directly enter the Kitchen. All communication goes through the Waiter. This is why APIs exist — they are the controlled, secure communication channel!

**My job in Week 2 was to build all 8 Waiters (APIs) for our school's complaint restaurant!**

---

## 🛠️ Technology Stack I Used

| Tool | Purpose |
|------|---------|
| **Next.js 16 App Router** | Framework for building the API route files |
| **MongoDB** | The database (our Kitchen) running on MongoDB Atlas (cloud) |
| **Mongoose** | A JavaScript library to connect to MongoDB and define data rules |
| **next/headers cookies()** | For reading the session cookie in API routes |
| **JavaScript (ES6+)** | The coding language for all API logic |
| **JSON** | The format in which data travels between frontend and backend |
| **Postman** | The tool I used to test my APIs before the frontend was ready |

---

## 📂 Chapter 0: The Folder Structure I Built

My backend code lives entirely inside the `app/api/` folder. Next.js App Router automatically turns these folder paths into working URLs.

```
src/
├── app/
│   ├── api/                          <-- ALL backend routes live here
│   │   │
│   │   ├── complaints/
│   │   │   ├── route.js              <-- Handles: POST (create) & GET (admin list)
│   │   │   │                             URL: /api/complaints
│   │   │   │
│   │   │   ├── user/
│   │   │   │   └── route.js          <-- Handles: GET (current user's complaints)
│   │   │   │                             URL: /api/complaints/user
│   │   │   │
│   │   │   └── [id]/                 <-- Dynamic folder! [id] = any ticket ID
│   │   │       │
│   │   │       ├── route.js          <-- Handles: GET (single complaint details)
│   │   │       │                         URL: /api/complaints/12345
│   │   │       │
│   │   │       ├── status/
│   │   │       │   └── route.js      <-- Handles: PUT (change status)
│   │   │       │                         URL: /api/complaints/12345/status
│   │   │       │
│   │   │       └── remarks/
│   │   │           └── route.js      <-- Handles: POST (add comment)
│   │   │                                 URL: /api/complaints/12345/remarks
│   │   │
│   │   └── users/
│   │       ├── route.js              <-- Handles: GET (all users list — admin only)
│   │       │                             URL: /api/users
│   │       └── [id]/
│   │           └── route.js          <-- Handles: PUT (update user role)
│   │                                     URL: /api/users/userId123
│   │
│   └── admin/
│       └── middleware.js             <-- THE SECURITY GUARD for /admin pages
│
└── models/
    ├── User.js                       <-- Rules for how user data is stored
    └── Complaint.js                  <-- Rules for how complaint data is stored ← My BIG Week 2 file!
```

### Why `[id]` in Folder Names?
The brackets make the folder **dynamic**. Instead of making a separate folder for every single complaint (which would be thousands!), Next.js lets me say "whatever ID appears in the URL, catch it as a variable."

So when the URL is `/api/complaints/abc123/status`, Next.js catches `abc123` as the `id` variable in my code. I can then use it to query the right document in the database!

---

## 🗄️ Chapter 1: Database Design (Mongoose Schema)

Before any Waiter (API) can take an order to the Kitchen (Database), the Kitchen needs strict rules about what a "complaint order" looks like.

I wrote these rules in `models/Complaint.js` using Mongoose. Think of it as the Kitchen's official recipe book — without it, chefs have no idea what ingredients to use!

### The Complete Complaint Schema

```javascript
// models/Complaint.js

import mongoose from 'mongoose';

// The "Remark" sub-schema — rules for comments added to a complaint
const remarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',                        // Links to the User collection
    required: true
  },
  content: {
    type: String,
    required: [true, 'Remark content is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// The main Complaint schema
const complaintSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true                      // No two complaints can ever share a ticket ID!
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['INFRASTRUCTURE', 'ACADEMIC', 'ADMINISTRATIVE',
             'HOSTEL', 'LIBRARY', 'CANTEEN', 'OTHER']
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM'                 // If not specified, assume medium priority
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'ESCALATED'],
      default: 'PENDING'                // All new complaints start as PENDING
    },
    department: {
      type: String,
      required: [true, 'Department is required']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true                    // Every complaint MUST belong to a user!
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null                     // Not assigned to anyone initially
    },
    remarks: [remarkSchema],            // Array of remarks/comments
    resolvedAt: {
      type: Date,
      default: null                     // Set automatically when status → RESOLVED
    }
  },
  {
    timestamps: true                    // Auto-creates createdAt and updatedAt fields!
  }
);
```

### Key Design Decisions I Made

**1. Using `enum` for Categories and Statuses**
By listing exact allowed values, the database rejects any invalid input. A student cannot submit `category: "My Teacher Is Mean"` because that word is not in our approved list!

**2. `timestamps: true`**
This built-in Mongoose option automatically adds `createdAt` and `updatedAt` to every complaint document without me having to write any extra code. Pure convenience!

**3. Subdocument for Remarks**
Instead of creating a whole separate database collection for remarks, I embed them directly inside the complaint document as an array of `remarkSchema` objects. This means loading a complaint automatically includes all its comments — no extra database query needed!

**4. `ref: 'User'` — The Cross-Reference**
By storing `userId` as an ObjectId referencing the `User` collection, I enable Mongoose's `.populate()` feature. This lets me automatically replace the bare `userId` string with the actual user object containing their real name and email!

---

## 🎫 Chapter 2: The Ticket ID Auto-Generator (Pre-Save Hook)

This is the feature I am most proud of in the entire project! Every complaint needs a unique, human-readable ticket ID like `CMP-20250115001`.

I implemented this using a Mongoose **pre-save hook** — code that automatically runs BEFORE a new document gets saved to the database.

```javascript
// Still inside models/Complaint.js
complaintSchema.pre('save', async function(next) {
  // If this document already has a ticketId, skip generation and continue
  if (this.ticketId) {
    return next();
  }

  // Step 1: Get today's date in YYYYMMDD format
  const today = new Date();
  const year = today.getFullYear();            // e.g., 2025
  const month = String(today.getMonth() + 1).padStart(2, '0'); // e.g., "01" not "1"
  const day = String(today.getDate()).padStart(2, '0');         // e.g., "15" not "15"
  const dateString = `${year}${month}${day}`;  // Result: "20250115"

  // Step 2: Count how many complaints already exist for today
  const Model = mongoose.model('Complaint');
  const todayStart = new Date(today.setHours(0, 0, 0, 0));    // Start of today
  const todayEnd = new Date(today.setHours(23, 59, 59, 999)); // End of today

  const count = await Model.countDocuments({
    createdAt: { $gte: todayStart, $lte: todayEnd }
  });

  // Step 3: Generate the sequential number (3 digits, padded with zeros)
  const sequence = String(count + 1).padStart(3, '0'); // "001", "002", etc.

  // Step 4: Assemble the ticket ID!
  this.ticketId = `CMP-${dateString}${sequence}`;
  // e.g., "CMP-20250115001" for the 1st complaint today

  // Step 5: Proceed to save the document
  next();
});
```

**What `.padStart(2, '0')` does:** Ensures the number is at least 2 digits. So January (month 1) becomes "01" instead of "1". This is critical for consistent, readable ticket IDs.

**Why pre-save instead of doing it in the API?**
Because the hook runs at the database layer, it is impossible to bypass. Even if someone calls `Complaint.create()` directly, the hook fires. This guarantees 100% of complaints always have a valid ticket ID.

---

## 📬 Chapter 3: Create Complaint API (POST /api/complaints)

File: `src/app/api/complaints/route.js`

This is the most important API I built. It receives the form data from the New Complaint page and saves it to the database.

### The HTTP Method: POST
I use `POST` because we are **creating** something new that didn't exist before. Think of it like a POST office — you are delivering a new package (complaint) to be stored.

```javascript
// src/app/api/complaints/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Complaint from '@/models/Complaint';
import { getSession } from '@/lib/auth';

export async function POST(req) {
  try {
    // ══════════════════════════
    // STEP 1: Authenticate the user
    // ══════════════════════════
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Please login to submit a complaint' },
        { status: 401 } // 401 = Unauthorized
      );
    }

    // ══════════════════════════
    // STEP 2: Connect to database
    // ══════════════════════════
    await connectDB();

    // ══════════════════════════
    // STEP 3: Extract form data from the request body
    // ══════════════════════════
    const { title, description, category, priority, department } = await req.json();

    // ══════════════════════════
    // STEP 4: Validate required fields
    // ══════════════════════════
    if (!title || !description || !category || !department) {
      return NextResponse.json(
        { success: false, error: 'Title, description, category, and department are required' },
        { status: 400 } // 400 = Bad Request
      );
    }

    // ══════════════════════════
    // STEP 5: Create the complaint in the database
    // (The pre-save hook will auto-generate the ticketId!)
    // ══════════════════════════
    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority: priority || 'MEDIUM', // Default to MEDIUM if not specified
      department,
      userId: session.userId,          // Securely taken from cookie, not user input!
      status: 'PENDING',              // ALWAYS starts as PENDING — no exceptions!
    });

    // ══════════════════════════
    // STEP 6: Return success response with the new complaint data
    // ══════════════════════════
    return NextResponse.json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint: {
        _id: complaint._id,
        ticketId: complaint.ticketId,
        title: complaint.title,
        status: complaint.status,
        priority: complaint.priority,
        createdAt: complaint.createdAt
      }
    }, { status: 201 }); // 201 = Created

  } catch (error) {
    console.error('Create complaint error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again.' },
      { status: 500 } // 500 = Internal Server Error
    );
  }
}
```

### Why I Force `status: 'PENDING'`
A determined hacker could send a POST request with `"status": "RESOLVED"` in the body. If my API blindly trusted the frontend data, a fake "resolved" complaint would appear. By forcing the status server-side, this attack is completely impossible.

---

## 📋 Chapter 4: Get User Complaints API (GET /api/complaints/user)

File: `src/app/api/complaints/user/route.js`

When a student opens their "My Complaints" page, this API fetches only THEIR complaints — nobody else's.

```javascript
export async function GET(req) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Filter by userId — only get THIS USER's complaints
    const complaints = await Complaint.find({ userId: session.userId })
      .sort({ createdAt: -1 })  // Newest first (time goes backward = -1)
      .lean();                   // .lean() returns plain JS objects (faster!)

    return NextResponse.json({ success: true, complaints });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
```

### Why `.lean()`?
By default, Mongoose returns documents as special Mongoose objects with extra methods attached. `.lean()` strips all that and returns a simple plain JavaScript object. This is significantly faster — up to 10x faster — when you only need to read data, not modify it.

### Why `.sort({ createdAt: -1 })`?
The `-1` means "descending order." Dates are numbers under the hood, so listing them from largest (newest) to smallest (oldest) shows the most recent complaint at the top of the page.

---

## 👁️ Chapter 5: Get All Complaints API (Admin Only)

File: `src/app/api/complaints/route.js` — the same file as Chapter 3, but the `GET` function

When an Admin opens the "All Complaints" management panel, they need to see EVERY complaint ever filed at the school, with filtering options.

```javascript
export async function GET(req) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // ══════════════════════════
    // CRITICAL: Only ADMIN can see all complaints!
    // ══════════════════════════
    if (session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Access denied. Admins only.' }, { status: 403 });
    }

    await connectDB();

    // ══════════════════════════
    // Dynamic filter based on URL query parameters
    // ══════════════════════════
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');       // e.g., ?status=PENDING
    const category = searchParams.get('category');   // e.g., ?category=HOSTEL
    const priority = searchParams.get('priority');   // e.g., ?priority=HIGH

    // Build a filter object dynamically
    const filter = {};
    if (status && status !== 'ALL') filter.status = status;
    if (category && category !== 'ALL') filter.category = category;
    if (priority && priority !== 'ALL') filter.priority = priority;

    // Fetch complaints with the filter
    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email department') // Replace ID with actual user data!
      .lean();

    // ══════════════════════════
    // Count by status for the dashboard stats cards
    // ══════════════════════════
    const [total, pending, inProgress, resolved] = await Promise.all([
      Complaint.countDocuments({}),
      Complaint.countDocuments({ status: 'PENDING' }),
      Complaint.countDocuments({ status: 'IN_PROGRESS' }),
      Complaint.countDocuments({ status: 'RESOLVED' }),
    ]);

    return NextResponse.json({
      success: true,
      complaints,
      stats: { total, pending, inProgress, resolved }
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
```

### The Power of `.populate()`
Without `.populate()`:
```json
{ "userId": "664a3bcd1e2f3a4b5c6d7e8f" }
```
With `.populate('userId', 'name email')`:
```json
{ "userId": { "name": "Rahul Sharma", "email": "rahul@jspm.edu" } }
```
Mongoose automatically runs a second query against the User collection and replaces the raw ID with the full user document!

### `Promise.all()` — Running 4 Queries Simultaneously
Instead of waiting for 4 separate count queries to run one after another (slow!), `Promise.all()` launches all 4 at the same time and waits for all of them to finish. This can be 4x faster when network/disk latency is a factor.

---

## 🔍 Chapter 6: Get Single Complaint API (GET /api/complaints/[id])

File: `src/app/api/complaints/[id]/route.js`

This API returns the full details of ONE specific complaint, including its entire history of remarks.

```javascript
export async function GET(req, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // The dynamic [id] from the folder name is available in params!
    const { id } = await params;

    // Fetch the complaint with ALL related data populated
    const complaint = await Complaint.findById(id)
      .populate('userId', 'name email department')    // Who filed it
      .populate('assignedTo', 'name email')           // Who is handling it
      .populate('remarks.userId', 'name role');       // Who wrote each comment

    // If no complaint found with that ID
    if (!complaint) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
    }

    // ══════════════════════════
    // SECURITY: Can this user see this complaint?
    // Only the OWNER or an ADMIN is allowed!
    // ══════════════════════════
    const isOwner = complaint.userId._id.toString() === session.userId;
    const isAdmin = session.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to view this complaint' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, complaint });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
```

### Why Compare `.toString()`?
MongoDB ObjectIDs are special binary objects, not simple strings. Two ObjectIDs can point to the same user but fail an `===` comparison if we compare the raw objects! Calling `.toString()` on both converts them to plain strings ("664a3bcd...") for correct equality comparison.

---

## 🔄 Chapter 7: Update Status API (PUT /api/complaints/[id]/status)

File: `src/app/api/complaints/[id]/status/route.js`

This is the API that makes our system actually *work* — when an admin changes a complaint from "Pending" to "In Progress" or "Resolved."

```javascript
export async function PUT(req, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Only ADMIN or DEPARTMENT_HEAD can update statuses
    if (!['ADMIN', 'DEPARTMENT_HEAD'].includes(session.role)) {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;
    const { status, remark } = await req.json();

    // Validate the new status is a real value
    const validStatuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'ESCALATED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status value' }, { status: 400 });
    }

    // Build the update object
    const updateData = {
      $set: { status }  // Change the status
    };

    // If a remark/comment was provided, append it to the remarks array
    if (remark && remark.trim()) {
      updateData.$push = {
        remarks: {
          userId: session.userId,
          content: remark.trim(),
          createdAt: new Date()
        }
      };
    }

    // If the complaint is being RESOLVED, stamp the exact resolution time!
    if (status === 'RESOLVED') {
      updateData.$set.resolvedAt = new Date();
    }

    // Execute the update in one database operation
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return the UPDATED document, not the old one
    ).populate('userId', 'name email');

    if (!updatedComplaint) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Complaint status updated to ${status}`,
      complaint: updatedComplaint
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
```

### `$set` vs `$push` — MongoDB Operators
In MongoDB, you don't directly assign values (`complaint.status = 'NEW'`). You use special operators:

- **`$set`**: Replaces a field value. Like using White-Out on a form.
- **`$push`**: Adds a new item to an array. Like adding a new row at the bottom of a table.

Using both in the same `findByIdAndUpdate` call means ONE database round-trip performs both operations simultaneously — very efficient!

---

## 💬 Chapter 8: Add Remarks API (POST /api/complaints/[id]/remarks)

File: `src/app/api/complaints/[id]/remarks/route.js`

Both students AND admins can add text comments to a complaint's history log.

```javascript
export async function POST(req, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, error: 'Remark content cannot be empty' }, { status: 400 });
    }

    // Push the new remark into the complaint's remarks array
    await Complaint.findByIdAndUpdate(
      id,
      {
        $push: {
          remarks: {
            userId: session.userId,
            content: content.trim(),
            createdAt: new Date()
          }
        }
      }
    );

    return NextResponse.json({ success: true, message: 'Remark added successfully' });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
```

The `$push` operator safely appends the new remark object into the existing array without overwriting or reading the full array first. MongoDB handles this atomically at the database engine level!

---

## 👥 Chapter 9: User Management APIs

File: `src/app/api/users/route.js` and `src/app/api/users/[id]/route.js`

### GET All Users
```javascript
export async function GET(req) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    await connectDB();

    const users = await User.find({})
      .select('-password')       // ⚠️ NEVER send passwords to the frontend!
      .sort({ createdAt: -1 })
      .lean();

    // Attach complaint count to each user
    const usersWithCounts = await Promise.all(
      users.map(async (user) => ({
        ...user,
        totalComplaints: await Complaint.countDocuments({ userId: user._id })
      }))
    );

    return NextResponse.json({ success: true, users: usersWithCounts });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
```

### PUT Update User (Promote/Demote Roles)
```javascript
export async function PUT(req, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;
    const { role, department, isActive } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { role, department, isActive } },
      { new: true }
    ).select('-password');

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
```

### The Password Security Rule
Using `.select('-password')` strips the password field before sending user data to the browser. The minus sign (`-`) means "exclude this field." Even though bcrypt passwords are hashed and unreadable, sending them is a bad security practice — we never expose them.

---

## 🔐 Chapter 10: The Security Guard (Admin Middleware)

File: `src/app/admin/middleware.js`

Even with APIs protected, I needed to protect the **page routes** themselves. A student who navigates to `localhost:3000/admin` should be immediately blocked, not just shown empty data.

```javascript
// src/app/admin/middleware.js

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(request) {
  // Check for a valid session cookie
  const session = await getSession();

  // Case 1: Not logged in at all
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Case 2: Logged in but not an admin
  if (session.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Case 3: Confirmed admin — allow full access
  return NextResponse.next();
}

// This middleware only fires for URLs matching these patterns
export const config = {
  matcher: ['/admin/:path*'] // Protects /admin, /admin/complaints, /admin/users, etc.
};
```

This middleware is called a **route interceptor**. It sits in front of every single `/admin/*` URL like a security checkpoint. No page code runs until this passes.

---

## 📡 Chapter 11: HTTP Methods Explained

Throughout my APIs, I use different HTTP "verbs" to signal the intention of the request. This is standard internet convention:

| HTTP Method | What It Means | Where I Used It |
|-------------|---------------|-----------------|
| `GET` | Retrieve/read data | Fetching complaints, users |
| `POST` | Create new data | Submitting a complaint, adding a remark |
| `PUT` | Update existing data | Changing status, updating user role |
| `DELETE` | Remove data | (Not implemented this week) |

Using the correct method is important because:
1. It makes the code self-documenting (other developers immediately understand the intent)
2. Browsers and caches treat `GET` requests differently (they may cache them)
3. REST convention is an industry standard that all teams follow

---

## ⚠️ Chapter 12: Error Handling Strategy

Every single API I built follows the same three-tier error response pattern:

### Tier 1: Authentication Errors (401)
```json
{ "success": false, "error": "Please login to continue" }
```
HTTP Status `401 Unauthorized` — the request lacks valid credentials.

### Tier 2: Permission Errors (403)
```json
{ "success": false, "error": "Admin access required" }
```
HTTP Status `403 Forbidden` — credentials are valid but user lacks permission.

### Tier 3: Server Errors (500)
```json
{ "success": false, "error": "Internal server error. Please try again." }
```
HTTP Status `500 Internal Server Error` — something broke on the server side.

Using proper HTTP status codes is important because:
- Frontend code can check the status number to decide how to display the error
- Browser developer tools (F12) clearly show what went wrong during debugging
- Search engines and other automatic tools understand the meaning correctly

---

## 🧪 Chapter 13: Testing My APIs (Using Postman)

Before the frontend was built, I had no buttons to click to test my APIs! I used a professional tool called **Postman** to simulate browser requests.

### What is Postman?
Postman is a desktop application that lets you send HTTP requests to any URL and inspect the response. It is like having a manual remote control for every API endpoint.

### How I Used It

**Example: Testing the Create Complaint API**

1. Open Postman, select method: `POST`
2. Enter URL: `http://localhost:3000/api/complaints`
3. Set Body to `raw` → `JSON`
4. Type the test data:
```json
{
  "title": "Library AC Not Working",
  "description": "The air conditioning in the library has not been working for 3 days. Students cannot study properly due to the heat.",
  "category": "LIBRARY",
  "priority": "HIGH",
  "department": "Library"
}
```
5. Click Send
6. Check the response to see if `success: true` and a Ticket ID were returned!

If I saw an error, I would check the terminal where `npm run dev` was running to see the actual error message printed by the `console.error()` lines I placed in my catch blocks.

---

## 🐛 Chapter 14: Bugs I Fixed Along the Way

Real development always involves debugging. Here are the actual problems I faced:

### Bug #1: The 403 That Should Have Been 200
When I first tested the admin complaints API, I got `403 Forbidden` even when logged in as admin.

**Investigation:** I added `console.log(session)` and saw: `{ userId: '...', role: 'user' }` — lowercase 'u'!
**Root Cause:** My seed script had created the admin with role `"user"` (lowercase), but my middleware checked for `"ADMIN"` (uppercase).
**Fix:** Updated the check to `session.role.toUpperCase() === 'ADMIN'` temporarily, then fixed the seed data to properly set `role: 'ADMIN'`.

### Bug #2: Populate Not Working
When I called `.populate('userId', 'name email')`, the response still showed a plain ID string.

**Root Cause:** I forgot to import the User model in my complaints route file! Mongoose needs the User model to be loaded to perform the join.
**Fix:** Added `import User from '@/models/User';` at the top of the file. Once Mongoose knew the User schema existed, populate worked perfectly.

### Bug #3: Duplicate Ticket IDs
During testing, two complaints created at the exact same millisecond got the same Ticket ID (`CMP-20250115001` twice).

**Root Cause:** The `countDocuments()` query in the pre-save hook is not atomic — two simultaneous saves both counted zero documents and both got `001`.
**Fix:** Added a `unique: true` index on the `ticketId` field in the schema. Now, if a duplicate is generated, MongoDB throws an error. I then added retry logic that increments the count by a random number and retries.

---

## 🌟 Chapter 15: What I Learned

Week 2 was my deepest dive into server-side programming. Here are the major concepts I now understand:

### Backend Architecture
- REST API design conventions (correct use of GET/POST/PUT)
- How Next.js App Router handles API routes via folder-based routing
- Server-side authentication with session cookies

### MongoDB & Mongoose
- Schema design with validation, enums, and defaults
- Pre-save hooks for computed fields
- The `$set` and `$push` MongoDB update operators
- `.populate()` for joining related collections
- `.select()` for excluding sensitive fields
- `Promise.all()` for parallel database queries

### Security Concepts
- Why we never trust client-provided status values
- Role-based access control (RBAC) with ADMIN vs USER
- Middleware route protection in Next.js
- The importance of never exposing password hashes

---

## 🏁 Conclusion: The Complete Week 2 Picture

In Week 2, I built the entire data backbone of the Complaint Management System. Here is the full picture of what I created:

### APIs Created (8 total)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/complaints` | POST | Student submits new complaint |
| `/api/complaints` | GET | Admin views all complaints with filters |
| `/api/complaints/user` | GET | Student views their own complaints |
| `/api/complaints/[id]` | GET | Anyone views one complaint's full details |
| `/api/complaints/[id]/status` | PUT | Admin changes complaint status |
| `/api/complaints/[id]/remarks` | POST | Anyone adds a comment to complaint |
| `/api/users` | GET | Admin lists all users |
| `/api/users/[id]` | PUT | Admin updates a user's role |

### Security Layers Implemented
1. **Session check** on every API — unauthenticated users blocked at step 1
2. **Role check** on admin-only APIs — non-admins get 403
3. **Ownership check** on single complaint — only the owner or admin can view
4. **Status forced to PENDING** on creation — hackers cannot manipulate initial state
5. **Middleware route guard** — /admin pages blocked at the routing level itself

### Data Flow I Built

```
User fills form → React sends POST /api/complaints
                  ↓
           API checks session cookie
                  ↓
         Validates required fields
                  ↓
    Mongoose Schema pre-save hook fires
    Auto-generates CMP-YYYYMMDDXXX ticket ID
                  ↓
  Complaint saved to MongoDB Atlas cloud DB
                  ↓
    API returns { success: true, ticketId }
                  ↓
  User sees "Your ticket number is CMP-2025..." message!
```

By building all these APIs, I truly became a Backend Developer. I understand how data flows securely from a user's screen through an API all the way into a cloud database and back again. I am incredibly proud of what I built in Week 2!

---

## 👥 Team Division Reference

| Team Member | Week 2 Tasks |
|-------------|--------------|
| **Shubham Mirarkar** | ALL complaint APIs, status update logic, admin middleware, user management APIs |
| **Jayraj Nawhale** | New Complaint Form UI, User Dashboard, Sidebar component |
| **Atharva Bhujbal** | Admin Dashboard pages, ComplaintTable, StatsCard components |
| **Raj Vairat** | StatusBadge, PriorityBadge, color styling, end-to-end testing |

---

*Prepared by: Shubham Mirarkar*
*Enrollment: 23211830520*
*JSPM's Jayawantrao Sawant Polytechnic, Pune*
*Computer Engineering Department — TYCO3*
*Academic Year 2025-26*
