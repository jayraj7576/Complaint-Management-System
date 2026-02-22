# 🚀 My Journey Building the Frontend & Authentication System
## By: Jayraj Nawhale (Enrollment: 23211830526)
## Role: Frontend Developer
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

You can start editing the page by modifying `app/page.jsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load fonts.

### Learn More About Next.js
- [Next.js Documentation](https://nextjs.org/docs) — learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) — an interactive Next.js tutorial.

### Deploy on Vercel
The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

---

## 📌 Table of Contents

1. Introduction & What I Did
2. The Building Analogy (Understanding Authentication)
3. Technology Stack I Used
4. Folder Structure & Organization
5. Chapter 1 — Setting Up the Project (Next.js)
6. Chapter 2 — Making It Look Good (Tailwind CSS & Shadcn)
7. Chapter 3 — The Home Page (Landing Page)
8. Chapter 4 — The Registration Page (Creating New Accounts)
9. Chapter 5 — The Login Page (Entering the System)
10. Chapter 6 — Session Cookies (The ID Badge System)
11. Chapter 7 — The Dashboard Entry (Protected Routes)
12. Chapter 8 — The Navigation Header
13. Chapter 9 — Error Handling & User Feedback
14. Chapter 10 — Testing & Debugging My Work
15. Chapter 11 — Security Best Practices I Applied
16. Chapter 12 — What I Learned
17. Conclusion

---

## 📌 Introduction: What Did I Actually Do?

Hello! My name is Jayraj Nawhale, and I am the **Frontend Developer** for our group's Complaint Management System project at JSPM's Jayawantrao Sawant Polytechnic.

In our team's division the work was split clearly:
- **Shubham Mirarkar** handled the Backend — the database, the APIs, and the server logic.
- **I (Jayraj Nawhale)** handled the Frontend — the actual website pages, buttons, visual design, and authentication flow.
- **Atharva Bhujbal** handled the Database design and Admin dashboard pages.

When we first started building this website in Week 1, the project was completely empty. It was just a folder with some configuration files. My job was to build the actual visual "face" of the application that students and teachers would interact with every single day.

In **Week 1**, I was responsible for:
1. Setting up the entire Next.js project structure
2. Designing and coding the **Home/Landing page**
3. Building the **Registration** (Sign Up) page
4. Building the **Login** (Sign In) page
5. Implementing the entire **Authentication flow** (connecting to backend APIs)
6. Protecting the **Dashboard** so only logged-in users can see it
7. Building the **Navbar** (top navigation)

This document will explain every single step in full detail so that anyone — even someone who has never touched a line of code — can understand what I did!

---

## 🏢 The Building Analogy (How Authentication Works)

Let me explain authentication using a very simple, real-world example: a **Secure Office Building**.

### Act 1: The Entrance (Public Lobby)
Imagine our school's Complaint Management website is a giant 10-story secure building. Anyone walking on the street can see the building and walk into the **public lobby** (the Home/Landing page). They can read what the building offers, see the directions, and look at the notice board.

But they **cannot** go into the elevators or open any office doors. Not without an ID Badge.

### Act 2: The Security Counter (Registration & Login)
To enter the secure floors, they walk up to the **Security Desk** (the Login/Register page). 

- **New visitors** fill out a Registration Form: their full name, email, department, and a secret password.
- **Returning visitors** show their email and password at the Login counter.

The guard (the server) checks everything carefully:
- "Does this email exist in our system?" 
- "Does the password match?"

If everything is correct, the guard prints out a special **ID Badge**.

### Act 3: The ID Badge (Session Cookie)
The ID Badge is a tiny encrypted token. The user puts it in their pocket (the browser's cookie storage). Now, every time they approach a locked office door (Dashboard, Complaint pages), the door's scanner reads their badge automatically and lets them enter!

If someone doesn't have a badge and tries to sneak in anyway, the automatic door locks trigger a redirect and send them straight back to the Security Counter!

**That entire system is what I built in Week 1.**

---

## 🛠️ Technology Stack I Used

Before I explain what I built, let me list the tools I used. Think of these as the construction tools I used to build the building.

| Tool | Purpose |
|------|---------|
| **Next.js 16** | The overall framework. Like the construction company managing the whole build. |
| **React** | The interactive UI engine. Makes the website respond to button clicks and typing. |
| **Tailwind CSS** | The fast-styling system. Like using pre-made paint brushes instead of mixing every color from scratch. |
| **Shadcn/UI** | Pre-built beautiful UI components. Like buying pre-made door frames from a store instead of building from raw wood. |
| **JavaScript (JSX)** | The main coding language I used. |
| **CSS** | Additional custom styling when Tailwind wasn't enough. |
| **Git** | Version control. Like a system that saves every version of the building blueprint so we can go back in time if we break something. |

---

## 📂 Chapter 1: The Magic File Cabinets (Folder Structure)

Next.js 16 uses a system called the **App Router**, where the folders you create literally become the URL addresses of the website. This was confusing at first, but once I understood it, it was incredibly powerful.

Here is the full folder structure I set up and managed:

```
src/
├── app/                          <-- Root folder. Contains all pages.
│   │
│   ├── (auth)/                   <-- Bracket = Group folder (does NOT appear in URL!)
│   │   ├── login/                <-- URL: localhost:3000/login
│   │   │   └── page.jsx          <-- This is the actual Login page component
│   │   └── register/             <-- URL: localhost:3000/register
│   │       └── page.jsx          <-- This is the actual Register page component
│   │
│   ├── dashboard/                <-- URL: localhost:3000/dashboard
│   │   ├── layout.jsx            <-- THE LOCK! Checks the ID badge before anything loads.
│   │   └── page.jsx              <-- The main dashboard welcome screen
│   │
│   ├── layout.jsx                <-- The master shell wrapping the entire website
│   ├── page.jsx                  <-- The Home / Landing page (URL: localhost:3000)
│   └── globals.css               <-- Global Tailwind CSS variables (colors, fonts)
│
├── components/                   <-- Reusable building blocks (Lego pieces!)
│   │
│   ├── ui/                       <-- Shadcn Pre-built components
│   │   ├── button.jsx            <-- The standardized button we use EVERYWHERE
│   │   ├── input.jsx             <-- The standardized text input box
│   │   ├── card.jsx              <-- The white rounded box design
│   │   ├── label.jsx             <-- Small text label above input fields
│   │   └── select.jsx            <-- The dropdown menu component
│   │
│   └── layout/                   <-- Layout pieces
│       └── Header.jsx            <-- The top navigation bar
│
├── lib/                          <-- Helpers & Utilities
│   ├── utils.js                  <-- Merges Tailwind CSS class names smartly
│   └── auth.js                   <-- Creates, reads, and destroys session cookies
│
└── tailwind.config.js            <-- Master Tailwind CSS color and font rulebook
```

### Important Lesson: Why Use `(auth)` Brackets?
Notice I used `(auth)` as a folder name, not `auth`. In Next.js, putting folder names in parentheses creates a "Route Group". This means:
- The folder is real and the files inside it work perfectly
- But the word "auth" does NOT appear in the browser URL!
- So the URL becomes `/login` instead of `/auth/login`

This was a professional trick to keep URLs clean and simple for students typing them.

---

## 🎨 Chapter 2: Making It Look Good (Tailwind CSS & Shadcn/UI)

Before building any actual page, I first had to understand our styling toolset. Nobody wants to use an app that looks like it was made in 1998!

### What is Tailwind CSS?
Tailwind CSS is a "utility-first" styling library. Instead of writing separate CSS file rules:

```css
/* OLD WAY — Writing in a separate CSS file */
.login-card {
  background-color: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
```

With Tailwind, I write the same styles DIRECTLY as class names inside the HTML/JSX:

```jsx
{/* TAILWIND WAY — Styles right in the component! */}
<div className="bg-white rounded-xl p-8 shadow-lg">
  Content here
</div>
```

**Why is this better?**
1. No switching between files constantly
2. Much faster to write
3. No CSS conflicts (two rules fighting each other)
4. Smaller final CSS file = faster loading website

### What is Shadcn/UI?
Shadcn/UI is a library of pre-built, beautiful, accessible React components. Instead of spending 3 days building a perfect dropdown menu from scratch, I simply ran:

```bash
npx shadcn-ui@latest add select
```

And instantly got a gorgeous, animated, keyboard-navigable dropdown component! I used these Shadcn components throughout Week 1:

| Component | Where I Used It |
|-----------|-----------------|
| `Card` | Login and Register form containers |
| `Input` | All text input fields |
| `Button` | All clickable buttons |
| `Label` | Field titles above inputs |
| `Select` | Department dropdown on Register page |

---

## 🏠 Chapter 3: The Home Page (Landing Page)

The very first thing any visitor sees when they type `http://localhost:3000` is the **Home Page** that I built at `src/app/page.jsx`.

### What Did It Need to Have?
1. A big, clear **heading** explaining what the system is
2. A short **description** of the features
3. A **"Get Started"** button that takes users to Register
4. A **"Login"** button for returning users
5. A professional, modern visual design

### The Design Approach
I used a **gradient background** going from a deep slate blue to white, giving it a modern, premium look. Large typography (using the `Inter` Google Font) made it feel professional and clear on both mobile and desktop screens.

### Responsive Design
One of my core responsibilities was making sure the pages looked correct on:
- **Laptop screens** (wide layout with elements side by side)
- **Mobile screens** (stacked layout with elements top-to-bottom)

I used Tailwind's **responsive prefixes** to handle this:

```jsx
<div className="flex flex-col md:flex-row items-center gap-8">
  {/* On mobile: flex-col (stacked). On md screens and above: flex-row (side by side) */}
</div>
```

The `md:` prefix means "apply this style only on medium screens (768px+) or larger." This one technique made the entire website mobile-friendly!

---

## 📝 Chapter 4: The Registration Page (Creating New Accounts)

The Registration page at `src/app/(auth)/register/page.jsx` is where **new students and teachers** create their accounts for the first time.

### What Fields Did I Build?

```
1. Full Name       → text input (required)
2. Email Address   → email input (required, must have @ symbol)
3. Password        → password input (required, min 6 characters)
4. Department      → dropdown select (required)
   Options:
   - Computer Engineering
   - Mechanical Engineering
   - Electrical Engineering
   - Civil Engineering
   - Library
   - Hostel
   - Canteen
   - Administration
   - Other
```

### Building the Department Dropdown

Using Shadcn's `<Select>` component, I built this beautiful dropdown:

```jsx
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select';

<Select
  value={formData.department}
  onValueChange={(value) => setFormData({...formData, department: value})}
>
  <SelectTrigger>
    <SelectValue placeholder="Select your department" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="Computer Engineering">Computer Engineering</SelectItem>
    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
    <SelectItem value="Library">Library</SelectItem>
    <SelectItem value="Hostel">Hostel</SelectItem>
    {/* ... more options */}
  </SelectContent>
</Select>
```

When the user selects a department, JavaScript saves that selection into our `formData` state object so it is ready to be sent to the server!

### Client-Side Validation

Before sending any data to the server, I validate it locally in the browser. This is important because:
1. It gives the user instant feedback without waiting for a server response
2. It saves server resources from handling bad requests
3. It feels professional and polished

```javascript
const validateForm = () => {
  // Check name is not empty
  if (!formData.name.trim()) {
    setError('Please enter your full name');
    return false;
  }
  // Check email format is valid
  if (!/\S+@\S+\.\S+/.test(formData.email)) {
    setError('Please enter a valid email address');
    return false;
  }
  // Check password length
  if (formData.password.length < 6) {
    setError('Password must be at least 6 characters');
    return false;
  }
  // Check department was selected
  if (!formData.department) {
    setError('Please select your department');
    return false;
  }
  return true; // Everything is good!
};
```

The `/\S+@\S+\.\S+/` part is called a **Regular Expression** (shortened to RegEx). It is a pattern-matching rule. It says: "Check that the string has non-whitespace characters, then an `@`, then more characters, then a `.`, then more characters." This catches basic email format errors!

### Sending to the Backend

After validation passes, my code packages the form data and sends it to the Registration API:

```javascript
const handleRegister = async (e) => {
  e.preventDefault();
  if (!validateForm()) return; // Stop if validation fails!

  setIsLoading(true);
  setError('');

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success) {
      // Show success message
      toast.success('Account created! You can now login.');
      router.push('/login');
    } else {
      setError(data.error || 'Registration failed. Try again.');
    }
  } catch (err) {
    setError('Network error. Please check your internet connection.');
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🔐 Chapter 5: The Login Page (Entering the System)

The Login page at `src/app/(auth)/login/page.jsx` is the most critical page in the entire Week 1 build. This is the door that connects the beautiful frontend to the powerful backend.

### What the Login Form Contains

```
1. Email Address  → email input field
2. Password       → password input (characters hidden with dots)
3. Sign In Button → triggers the authentication flow
4. Register Link  → for new users to navigate to registration
```

### State Management with React `useState`

Every interactive element requires "memory" to track what the user types. I used React's `useState` hook:

```javascript
'use client'; // This tells Next.js this component runs in the browser!

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  // Each useState creates a variable AND a function to update it
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter(); // Tool to navigate to different pages
  // ...
}
```

Every single character the user types into the Email field automatically calls `setEmail(newValue)`, keeping our `email` variable perfectly up-to-date. This is how React knows what to send to the server!

### The Authentication Flow

```javascript
const handleLogin = async (e) => {
  e.preventDefault(); // Stop the browser's default page-reload behavior!

  setIsLoading(true); // Show the spinning loader on the button
  setError('');       // Clear any old red error messages

  try {
    // 📦 Step 1: Pack up the credentials and send them to the security guard
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    // 📩 Step 2: Open the response box the server sent back
    const data = await res.json();

    if (data.success) {
      // ✅ Step 3a: Correct! The server has already planted the session cookie.
      // Push the user's browser to the dashboard!
      router.push('/dashboard');
      router.refresh(); // Force refresh so layout.jsx reads the new cookie!
    } else {
      // ❌ Step 3b: Incorrect! Show the error message in red text.
      setError(data.error || 'Invalid email or password. Please try again.');
    }

  } catch (err) {
    setError('Unable to connect to server. Please try again later.');
  } finally {
    // Always hide the spinner, success or failure
    setIsLoading(false);
  }
};
```

### The Loading Spinner UX

While waiting for the server to respond, I show a spinning animation inside the button instead of the text. This prevents the user from frantically clicking the button multiple times!

```jsx
<Button type="submit" disabled={isLoading} className="w-full">
  {isLoading ? (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Signing in...</span>
    </div>
  ) : (
    'Sign In'
  )}
</Button>
```

The `disabled={isLoading}` makes the button unclickable while the request is in progress. The `animate-spin` Tailwind class creates a smooth spinning rotation animation.

---

## 🍪 Chapter 6: Session Cookies (The ID Badge System)

Once the backend validates the login, it needs to give the user proof that they are authenticated. I helped build the cookie utility functions in `lib/auth.js`.

### What is an HTTP-Only Cookie?

A cookie is a tiny piece of data stored in the browser. When the server "sets" a cookie, it gets saved to the user's browser automatically. Every future request to the server automatically carries that cookie.

**HTTP-Only mean:** JavaScript code running on the page **cannot** read this cookie. This protects against XSS (Cross-Site Scripting) attacks where an attacker injects malicious JavaScript to steal tokens.

```javascript
// lib/auth.js - The complete session management utility
import { cookies } from 'next/headers';

// Creates a session after successful login
export async function createSession(userId, role) {
  const sessionData = JSON.stringify({
    userId: userId.toString(),
    role: role,
    createdAt: new Date().toISOString()
  });

  // Set the cookie on the browser
  const cookieStore = await cookies();
  cookieStore.set('session', sessionData, {
    httpOnly: true,          // Invisible to JavaScript = hacker safe!
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'lax',         // Prevents CSRF attacks
    maxAge: 60 * 60 * 24 * 7, // Expires in 7 days (in seconds)
    path: '/',               // Cookie is valid on all pages
  });
}

// Reads the session to check who is logged in
export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  return session?.value ? JSON.parse(session.value) : null;
}

// Destroys the session on logout
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
```

---

## 🚪 Chapter 7: Dashboard Entry — Protected Routes

This is one of the most important security features I built. If someone types `http://localhost:3000/dashboard` directly into their browser without logging in, they should NOT see any dashboard content.

### The `layout.jsx` Guard

I created `src/app/dashboard/layout.jsx`. This file is special — Next.js automatically runs it before loading any page inside the `dashboard/` folder.

```javascript
// src/app/dashboard/layout.jsx
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  // Step 1: Read the ID Badge (session cookie)
  const session = await getSession();

  // Step 2: If no badge exists, reject and redirect!
  if (!session) {
    redirect('/login');
    // The code below never runs for unauthenticated users!
  }

  // Step 3: Valid badge! Render the dashboard structure.
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Sidebar Navigation */}
      <aside className="w-64 bg-white border-r flex flex-col shadow-sm">
        {/* Sidebar content here */}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-auto">
        {children} {/* The actual page (dashboard/page.jsx) loads here */}
      </main>
    </div>
  );
}
```

The word `async` before the function is very important! It tells JavaScript: "This function will perform tasks that involve waiting (like reading a file or a cookie), so hold on before continuing." Without `async`, the cookie check would be skipped!

The `redirect('/login')` function is from Next.js itself. It immediately cancels the page load and forces the browser to the login page at the server level — meaning the Dashboard HTML never even gets sent to the user. It is a perfect defense.

---

## 🔝 Chapter 8: The Navigation Header

I built a responsive navigation bar component at `src/components/layout/Header.jsx`. The Header appears on every page of the website.

### What the Header Contains
- **Logo / Brand Name:** "Complaint Management System" on the left
- **Navigation Links:** Different links based on whether the user is logged in
  - If logged out: "Home", "Login", "Register"
  - If logged in: "Dashboard", "My Complaints", "Logout" button

### The `Logout` Button Logic

When a user clicks Logout, the browser must delete the session cookie and send the user back to the Login page:

```javascript
const handleLogout = async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  router.push('/login');
  router.refresh(); // Force the page to re-evaluate the cookie situation
};
```

This calls the logout API which runs `deleteSession()` on the server to remove the cookie. The user is then redirected. On the next page load, `getSession()` returns `null`, and the dashboard layout redirects them back to `/login` if they try to access it.

---

## ⚠️ Chapter 9: Error Handling & User Feedback

Good error handling is what separates a beginner's project from a professional product. Whenever something goes wrong, the user must ALWAYS know what happened and what to do next.

### Types of Errors I Handled

**1. Network Errors:** When the user has no WiFi

```javascript
} catch (err) {
  setError('Connection failed. Please check your internet and try again.');
}
```

**2. Server Validation Errors:** Wrong password or email not found

```javascript
if (!data.success) {
  setError(data.error); // Show exact error from server: "Email not found"
}
```

**3. Client Validation Errors:** Empty or malformed input fields

```javascript
if (!email.includes('@')) {
  setError('Please enter a valid email address.');
  return; // Stop! Don't even try to contact the server.
}
```

### Toast Notifications

For success messages (like after registering), I used the `sonner` library to show clean, animated pop-up toast notifications at the bottom of the screen:

```javascript
import { toast } from 'sonner';
toast.success('Account created successfully! Please log in.');
toast.error('Something went wrong. Please try again.');
```

These toasts fade in automatically and disappear after 3 seconds without the user having to click anything!

---

## 🐛 Chapter 10: Testing & Debugging My Work

Building the frontend was not just typing code — a huge amount of time was spent finding and fixing bugs.

### Bug #1: The Hydration Error (The Dreaded Red Screen)

The most confusing bug I faced was a **Hydration Mismatch**. My screen turned completely red with a wall of error text.

**What happened:** Next.js renders pages TWICE. First on the Server (fast, for SEO), then again on the Client's browser (for interactivity). If the server output and client output are different even slightly, React throws this error.

**My issue:** I was using `Date.now()` inside a component that ran on both server and client. The timestamps were slightly different each time, causing a mismatch!

**Fix:** Move time-sensitive code inside `useEffect()` so it only runs on the client browser, AFTER the initial server render is applied.

### Bug #2: The Cookie Not Setting Bug

After login, the user was being redirected to `/dashboard`, but the dashboard layout was immediately redirecting them back to `/login` because it couldn't read the cookie!

**Investigation steps:**
1. I opened Chrome DevTools (F12)
2. I went to Application tab → Cookies
3. The `session` cookie was there! So why wasn't it being read?
4. I added `console.log` statements
5. I discovered the issue: I was calling `router.push('/dashboard')` but forgetting `router.refresh()`

**Fix:** Adding `router.refresh()` forces Next.js to re-run the server-side code in `layout.jsx`, which then correctly reads the newly set cookie!

### Testing Checklist I Used

```
✅ Does Register with valid data work?
✅ Does Register with duplicate email show error?
✅ Does Register with short password show error?
✅ Does Login with correct credentials redirect to Dashboard?
✅ Does Login with wrong password show error?
✅ Does Dashboard redirect to Login when not authenticated?
✅ Does Logout clear the cookie and redirect?
✅ Does the website look correct on mobile size?
✅ Does the website look correct on laptop size?
```

---

## 🔒 Chapter 11: Security Best Practices I Applied

Security was something I thought about throughout my build, not just as an afterthought.

### 1. Never Trust the Client
I never assume that data coming from the browser is safe. Even though I validate inputs on the frontend, the backend ALSO validates them independently. A hacker can bypass browser validation by sending direct API requests with tools like Postman!

### 2. HTTP-Only Cookies
As explained earlier, using `httpOnly: true` when setting the session cookie means JavaScript code cannot steal it. This prevents XSS attacks.

### 3. SameSite Cookie Flag
Using `sameSite: 'lax'` means the cookie is NOT sent with cross-site requests. This prevents CSRF (Cross-Site Request Forgery) attacks where a malicious third-party website tricks the browser into making requests to our server.

### 4. Password Never Stored in Plain Text
I made sure passwords were never handled raw on the frontend. The password string is sent over HTTPS (encrypted in transit) and Shubham's backend immediately hashes it using bcryptjs before storing. Even if someone accessed our database, they would only see scrambled hashes, not real passwords.

### 5. Error Messages Don't Reveal Too Much
Instead of saying "There is no account with that email" (which tells hackers what emails exist!), we say "Invalid email or password." This prevents **user enumeration** attacks.

---

## 🌟 Chapter 12: What I Learned

Week 1 was an intense learning journey. Here is a summary of the major concepts I now understand after building Week 1:

### React Fundamentals
- `useState` for managing component state (text inputs, loading flags, errors)
- `useEffect` for running code after the component renders
- JSX syntax: writing HTML inside JavaScript
- Props: passing data from parent to child components

### Next.js App Router
- How folder names become URL routes
- The role of `page.jsx`, `layout.jsx`, and their hierarchy
- The difference between Server Components and Client Components (`'use client'` directive)
- `redirect()` and `useRouter()` for navigation
- API route handlers (`route.js`)

### Authentication Concepts
- What a session is and why it's needed
- How cookies work (setting, reading, deleting)
- Why `httpOnly` cookies are safer than storing tokens in `localStorage`
- The full Login/Register/Logout flow

### CSS & Styling
- Tailwind CSS utility classes
- Responsive design with `sm:`, `md:`, `lg:` prefixes
- Flexbox (`flex`, `items-center`, `justify-between`)
- Grid layouts for complex arrangements

---

## 🏁 Conclusion: The Full Week 1 Picture

Looking back, the work I did in Week 1 was far more complex than I initially thought it would be. "Just make the Login page" turned into a deeply layered system involving:

1. A **Home Page** designed to be welcoming and informative
2. A **Registration Form** with dropdown selections and multi-field validation
3. A **Login Form** with secure async submission and real-time error feedback
4. A **Cookie-based Authentication** system that uses industry-standard security flags
5. **Protected Route Guards** using Next.js layouts that prevent unauthorized access
6. A **Responsive Navigation** bar adapting between mobile and desktop
7. Comprehensive **Error Handling** for every possible failure scenario

The complete data flow I built looks like this:

```
User types login details
         ↓
Frontend validates inputs (empty? invalid email?)
         ↓
fetch('/api/auth/login') sends data to server
         ↓
Server checks database, creates cookie on success
         ↓
Frontend receives { success: true }
         ↓
router.push('/dashboard') + router.refresh()
         ↓
dashboard/layout.jsx reads cookie → allows entry
         ↓
Dashboard page renders successfully!
```

This is the entire pipeline that powers the authentication of our school's Complaint Management System — and I built every piece of the frontend side of it!

I am incredibly proud of Week 1. The foundation I laid allowed my teammates in Week 2 to confidently build upon it, knowing that the door locks work perfectly and users can be trusted once they pass through the Login guard.

---

## 👥 Team Division Reference

| Team Member | Week 1 Tasks |
|-------------|--------------|
| **Jayraj Nawhale** | Login page, Register page, Home page, Session Cookies, Route Guards, Header Nav |
| **Shubham Mirarkar** | Auth API routes (login, register, logout), Password hashing with bcrypt |
| **Atharva Bhujbal** | MongoDB connection (`lib/db.js`), User model (`models/User.js`), Tailwind config, Color theme, Mobile testing |

---

*Prepared by: Jayraj Nawhale*  
*Enrollment: 23211830526*  
*JSPM's Jayawantrao Sawant Polytechnic, Pune*  
*Computer Engineering Department — TYCO3*  
*Academic Year 2025-26*
