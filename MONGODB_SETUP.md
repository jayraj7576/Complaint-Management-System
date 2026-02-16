# MongoDB Connection Issue - README

## Problem
The application is trying to connect to MongoDB at `localhost:27017`, but MongoDB is not running.

## Solutions

### Option 1: Use MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/complaint-management?retryWrites=true&w=majority
   ```

### Option 2: Install and Run MongoDB Locally
1. Download MongoDB from [mongodb.com/download](https://www.mongodb.com/try/download/community)
2. Install MongoDB
3. Start MongoDB service:
   - Windows: `net start MongoDB`
   - Mac/Linux: `sudo systemctl start mongod`
4. Keep the current `.env.local` setting

### Option 3: Use Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Current Configuration
The `.env.local` file is set to:
```
MONGODB_URI=mongodb://localhost:27017/complaint-management
```

This requires MongoDB to be running locally on port 27017.
