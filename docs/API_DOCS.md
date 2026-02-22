# 📡 API Documentation
## Complaint Management System
### JSPM's Jayawantrao Sawant Polytechnic, Pune | TYCO3 | 2025-26

---

## Base URL
```
http://localhost:3000/api
```
All endpoints require an active session cookie (set on login). Unauthorized requests return `401`.

---

## 🔐 Authentication

### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{ "name": "Rahul Sharma", "email": "rahul@example.com", "password": "pass123", "role": "USER" }
```

**Response:**
```json
{ "success": true, "message": "Registration successful" }
```

---

### POST `/api/auth/login`
Log in and create a session.

**Request Body:**
```json
{ "email": "rahul@example.com", "password": "pass123" }
```

**Response:**
```json
{ "success": true, "user": { "_id": "...", "name": "Rahul", "role": "USER" } }
```

---

### POST `/api/auth/logout`
Destroy session and log out.

**Response:**
```json
{ "success": true }
```

---

## 📋 Complaints

### POST `/api/complaints`
Create a new complaint.  
**Auth:** Required | **Role:** USER

**Request Body:**
```json
{
  "title": "Broken AC",
  "description": "AC in room 204 is not working.",
  "category": "INFRASTRUCTURE",
  "priority": "HIGH",
  "department": "Maintenance",
  "attachments": []
}
```

**Response (201):**
```json
{ "success": true, "complaint": { "_id": "...", "ticketId": "CMP-20250115001", ... } }
```

---

### GET `/api/complaints`
Get all complaints (filtered).  
**Auth:** Required | **Role:** ADMIN

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status |
| `category` | string | Filter by category |
| `priority` | string | Filter by priority |
| `search` | string | Text search (title, description, ticketId) |
| `dateFrom` | date | Start date filter |
| `dateTo` | date | End date filter |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 10) |

**Response:**
```json
{ "success": true, "complaints": [...], "total": 50, "pending": 12, "resolved": 30 }
```

---

### GET `/api/complaints/user`
Get complaints belonging to the logged-in user.  
**Auth:** Required | **Role:** USER

**Response:**
```json
{ "success": true, "complaints": [...] }
```

---

### GET `/api/complaints/[id]`
Get a single complaint by ID.  
**Auth:** Required

**Response:**
```json
{ "success": true, "complaint": { ... } }
```

---

### PUT `/api/complaints/[id]/status`
Update complaint status.  
**Auth:** Required | **Role:** ADMIN or DEPARTMENT_HEAD

**Request Body:**
```json
{ "status": "RESOLVED", "remark": "Issue has been resolved." }
```

**Response:**
```json
{ "success": true, "complaint": { ... } }
```

---

### POST `/api/complaints/[id]/remarks`
Add a remark to a complaint.  
**Auth:** Required

**Request Body:**
```json
{ "content": "We are working on this." }
```

**Response:**
```json
{ "success": true, "message": "Remark added successfully" }
```

---

### POST `/api/complaints/[id]/escalate`
Escalate a complaint.  
**Auth:** Required | **Role:** Complaint owner or ADMIN

**Request Body:**
```json
{ "reason": "No action taken for 7 days." }
```

**Response:**
```json
{ "success": true, "message": "Complaint escalated successfully" }
```

---

### GET `/api/complaints/[id]/history`
Get complaint history/audit trail.  
**Auth:** Required

**Response:**
```json
{ "success": true, "history": [{ "action": "STATUS_CHANGED", "previousValue": "PENDING", "newValue": "IN_PROGRESS", "timestamp": "..." }] }
```

---

## 📦 Bulk Operations (Admin Only)

### PUT `/api/complaints/bulk/status`
Update status for multiple complaints.  
**Auth:** Required | **Role:** ADMIN

**Request Body:**
```json
{ "complaintIds": ["id1", "id2"], "status": "RESOLVED", "remark": "Batch resolved" }
```

---

### PUT `/api/complaints/bulk/assign`
Assign multiple complaints to a user.  
**Auth:** Required | **Role:** ADMIN

**Request Body:**
```json
{ "complaintIds": ["id1", "id2"], "assignTo": "userId" }
```

---

### DELETE `/api/complaints/bulk`
Soft delete multiple complaints (sets `isActive: false`).  
**Auth:** Required | **Role:** ADMIN

**Request Body:**
```json
{ "complaintIds": ["id1", "id2"] }
```

---

## 🔔 Notifications

### GET `/api/notifications`
Get current user's notifications (paginated).  
**Auth:** Required

**Query Params:** `page`, `limit`

**Response:**
```json
{
  "success": true,
  "notifications": [...],
  "unreadCount": 3,
  "pagination": { "total": 20, "page": 1, "pages": 2 }
}
```

---

### PUT `/api/notifications/read-all`
Mark all notifications as read.  
**Auth:** Required

---

### PUT `/api/notifications/[id]`
Mark one notification as read.  
**Auth:** Required

---

### DELETE `/api/notifications/[id]`
Delete one notification.  
**Auth:** Required

---

## 📎 File Upload

### POST `/api/upload`
Upload a file attachment.  
**Auth:** Required  
**Content-Type:** `multipart/form-data`

**Form Field:** `file` (JPG, PNG, GIF, PDF | max 5MB)

**Response:**
```json
{ "success": true, "filePath": "/uploads/complaints/abc123.jpg", "fileName": "photo.jpg", "fileType": "image/jpeg" }
```

---

## 📊 Reports (Phase 4 — Shubham)

### GET `/api/reports/overview`
Comprehensive report data for the reports page.  
**Auth:** Required | **Role:** ADMIN

**Query Params:** `startDate`, `endDate`

**Response:**
```json
{
  "success": true,
  "overview": { "totalComplaints": 150, "resolved": 120, "pending": 20, "resolutionRate": 80, "avgResolutionTime": "2.5 days" },
  "byCategory": [...],
  "byStatus": [...],
  "monthlyTrend": [...]
}
```

---

### GET `/api/reports/export/pdf`
Download a PDF report.  
**Auth:** Required | **Role:** ADMIN  
**Response:** `application/pdf` binary download

---

### GET `/api/reports/export/excel`
Download an Excel report.  
**Auth:** Required | **Role:** ADMIN  
**Response:** `.xlsx` binary download

---

## 👤 User Profile (Phase 4 — Shubham)

### PUT `/api/users/profile`
Update user profile (name, phone).  
**Auth:** Required

**Request Body:**
```json
{ "name": "New Name", "phone": "9876543210" }
```

---

### PUT `/api/users/password`
Change password.  
**Auth:** Required

**Request Body:**
```json
{ "currentPassword": "oldpass", "newPassword": "newpass" }
```

---

### POST `/api/users/avatar`
Upload profile avatar.  
**Auth:** Required  
**Content-Type:** `multipart/form-data`

---

## ⚙️ Admin Settings (Phase 4 — Shubham)

### GET `/api/admin/settings`
Get all settings.  
**Auth:** Required | **Role:** ADMIN

### PUT `/api/admin/settings`
Update settings.  
**Auth:** Required | **Role:** ADMIN

**Request Body:**
```json
{ "category": "general", "settings": { "appName": "CMS", "timezone": "Asia/Kolkata" } }
```

---

### GET `/api/admin/departments`
List all departments.

### POST `/api/admin/departments`
Create a department.

### PUT `/api/admin/departments/[id]`
Update a department.

### DELETE `/api/admin/departments/[id]`
Delete a department.

---

## 📝 Status & Role Reference

**Complaint Statuses:** `PENDING` | `IN_PROGRESS` | `RESOLVED` | `REJECTED` | `ESCALATED`

**Categories:** `INFRASTRUCTURE` | `ACADEMIC` | `ADMINISTRATIVE` | `HOSTEL` | `LIBRARY` | `CANTEEN` | `OTHER`

**Priorities:** `LOW` | `MEDIUM` | `HIGH` | `URGENT`

**User Roles:** `USER` | `ADMIN` | `DEPARTMENT_HEAD`

---

*Prepared by: Atharva Bhujbal (23211830502)*  
*JSPM's Jayawantrao Sawant Polytechnic, Pune | TYCO3 | 2025-26*
