# Deployment Guide - Complaint Management System

This document explains how to deploy the **JSPM's Complaint Management System** to a production environment.

---

## 🌩️ Recommended Host: Vercel (Frontend & API)

Since the project is built with **Next.js**, Vercel is the natural choice for the frontend and serverless API.

### 1. Preparation
- Ensure your code is pushed to a GitHub, GitLab, or Bitbucket repository.
- Ensure all sensitive keys are removed from the codebase and moved to Environment Variables.

### 2. Deployment Steps
- Log in to [Vercel](https://vercel.com).
- Click **"New Project"** and import your repository.
- In the **"Environment Variables"** section, add the following:
    - `MONGODB_URI`: (Your MongoDB Atlas connection string)
    - `JWT_SECRET`: (Random string for secure sessions)
    - `NEXT_PUBLIC_APP_URL`: (Your production URL, e.g., `https://cms.jspm.edu`)
- Click **"Deploy"**.

---

## 🗄️ Database Host: MongoDB Atlas

- Create a new **Free Tier (Shared)** cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Go to **"Database Access"** and create a user with "Read and Write" permissions.
- Go to **"Network Access"** and whitelist the IP address `0.0.0.0/0` (or the specific IP of your deployment server).
- Copy the **Connection String** and use it as `MONGODB_URI`.

---

## 📁 File Uploads in Production

By default, this system saves uploads to the local `public/uploads` directory. On platforms like Vercel (which uses serverless functions), this file system is **ephemeral** and will be wiped periodically.

### For Production Scale:
- **Cloudinary / AWS S3**: It is highly recommended to update `lib/upload.js` to use a cloud storage provider to ensure files persist across deployments.
- **Node.js Server**: If deploying to a VPS (e.g., DigitalOcean, AWS EC2), you can continue using local disk storage by configuring a persistent volume.

---

## 🛠️ Production Build Command

To manually verify the production build locally before deploying:
```bash
npm run build
npm start
```

### Build Checklist:
- [ ] No `console.log` statements in production code.
- [ ] No hardcoded development URLs.
- [ ] MongoDB indexes are correctly applied (automatic on first run).
- [ ] All environment variables are correctly set in the hosting provider dashboard.
- [ ] Custom `404` and `Error` pages are functional.

---

*JSPM's Jayawantrao Sawant Polytechnic, Pune*
