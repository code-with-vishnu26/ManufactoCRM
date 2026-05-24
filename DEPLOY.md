# 🚀 ManufactoCRM AI — Production Deployment Guide

> Deploy to **Vercel** (frontend) + **Railway** (backend) + **MongoDB Atlas** (database)

---

## Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account
- MongoDB Atlas account (free at [mongodb.com/atlas](https://mongodb.com/atlas))
- Railway account (free at [railway.app](https://railway.app))
- Vercel account (free at [vercel.com](https://vercel.com))

---

## Step 1: MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and create a free account
2. Click **"Build a Cluster"** → Choose **M0 Free Tier** → Select region closest to you
3. Create a database user:
   - Click **"Database Access"** → **"Add New Database User"**
   - Username: `manufactocrm`
   - Password: Generate a secure password (save it!)
   - Role: **"Read and Write to Any Database"**
4. Allow network access:
   - Click **"Network Access"** → **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (for Railway compatibility)
5. Get your connection string:
   - Click **"Connect"** → **"Connect your application"**
   - Copy the URI: `mongodb+srv://manufactocrm:<password>@cluster0.xxxxx.mongodb.net/manufactocrm`
   - Replace `<password>` with your actual password

---

## Step 2: Push to GitHub

```bash
cd manufacto-crm-ai
git init
git add .
git commit -m "feat: ManufactoCRM AI initial commit"
git remote add origin https://github.com/yourusername/manufacto-crm-ai.git
git push -u origin main
```

---

## Step 3: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub Repo"**
3. Select your `manufacto-crm-ai` repository
4. Railway auto-detects it — click **"Add Service"** → select the `server` folder
5. Set **Root Directory** to `/server`
6. Add Environment Variables (click "Variables" tab):

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://manufactocrm:yourpassword@cluster0.xxxxx.mongodb.net/manufactocrm
JWT_SECRET=ManufactoCRM_Super_Secret_Key_2026_Enterprise_Grade
JWT_EXPIRE=30d
CLIENT_URL=https://your-app.vercel.app
SERVER_URL=https://your-backend.railway.app

# Optional: Email Setup (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=ManufactoCRM AI <your-email@gmail.com>

# Optional: Social Authentication (OAuth)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

7. Railway will automatically deploy. Note your backend URL:
   `https://manufacto-crm-ai-production.up.railway.app`

8. Test it: Visit `https://your-backend.railway.app/api/health`
   You should see: `{"status":"ok","message":"ManufactoCRM AI Server is running 🚀"}`

9. Seed the database:
   ```bash
   curl -X POST https://your-backend.railway.app/api/seed
   ```

---

## Step 4: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"** → Import your repository
3. Set **Root Directory** to `client`
4. Vercel auto-detects Vite — set **Build Command**: `npm run build`
5. Set **Output Directory**: `dist`
6. Add Environment Variables:

```
VITE_API_URL=https://your-backend.railway.app/api
```

7. Click **"Deploy"** 🚀
8. Your app will be live at: `https://manufacto-crm-ai.vercel.app`

---

## Step 5: Update CORS in Backend

Once you have your Vercel URL, update Railway environment variables:
```
CLIENT_URL=https://manufacto-crm-ai.vercel.app
```

---

## Step 6: Seed Production Database

```bash
# Using curl
curl -X POST https://your-backend.railway.app/api/seed

# Or using the app
# Login with demo credentials after visiting your Vercel URL
```

---

## Demo Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@manufactocrm.com | admin123 |
| Team Lead | teamlead@manufactocrm.com | lead123 |
| Sales Executive | rahul@manufactocrm.com | exec123 |
| Sales Manager | priya@manufactocrm.com | lead123 |
| Ops Director | arjun@manufactocrm.com | lead123 |
| Support Specialist | kavya@manufactocrm.com | exec123 |
| Viewer | ravi@manufactocrm.com | exec123 |

---

## Local Development

```bash
# Backend
cd server
npm install
npm run dev  # Runs on http://localhost:5000

# Frontend (new terminal)
cd client
npm install
npm run dev  # Runs on http://localhost:5173

# Seed local database
curl -X POST http://localhost:5000/api/seed
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error | Verify `CLIENT_URL` in Railway matches your Vercel URL exactly |
| MongoDB connection failed | Check Atlas Network Access allows 0.0.0.0/0 |
| Build fails on Vercel | Ensure `VITE_API_URL` is set in Vercel env vars |
| 404 on page refresh | Verify `vercel.json` rewrites are correct |
| Auth token invalid | Check `JWT_SECRET` is at least 32 chars |

---

## Architecture

```
User Browser
    ↕ HTTPS
Vercel (React + Vite)
    ↕ HTTPS API calls
Railway (Node.js + Express)
    ↕ MongoDB Atlas URI
MongoDB Atlas (Cloud DB)
```

---

## Estimated Costs

| Service | Free Tier Limit | Cost After |
|---------|-----------------|------------|
| MongoDB Atlas | 512MB storage | $9/month |
| Railway | $5 credit/month | $5+/month |
| Vercel | 100GB bandwidth | $20/month |

> **Total for startup**: ~$0-5/month on free tiers 🎉

---

*Built with ❤️ by ManufactoCRM AI — v2.0*
