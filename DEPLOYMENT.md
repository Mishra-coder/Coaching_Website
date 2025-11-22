# 🚀 Vercel Deployment Guide - Success Mantra

Complete step-by-step guide to deploy Success Mantra Institute to Vercel.

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- ✅ GitHub account (create at github.com)
- ✅ Vercel account (create at vercel.com - use GitHub to sign up)
- ✅ MongoDB Atlas database URL
- ✅ Git installed on your computer

---

## 🎯 Deployment Overview

You will deploy **TWO separate projects** on Vercel:
1. **Backend API** → `success-mantra-backend`
2. **Frontend Website** → `success-mantra-frontend`

Each will get its own URL:
- Backend: `https://your-backend.vercel.app`
- Frontend: `https://your-frontend.vercel.app`

---

## 📦 STEP 1: Prepare Git Repository

### 1.1 Check if Git is initialized
```bash
cd /Users/devendramishra/Desktop/success-mantra-react
git status
```

**If you see "not a git repository"**, initialize Git:
```bash
git init
git add .
git commit -m "Initial commit - Success Mantra Institute"
```

**If Git is already initialized**, commit any changes:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `success-mantra-react`
3. Make it **Private** (recommended)
4. **DO NOT** initialize with README (we already have code)
5. Click "Create repository"

### 1.3 Push to GitHub

Copy the commands from GitHub (they look like this):
```bash
git remote add origin https://github.com/YOUR-USERNAME/success-mantra-react.git
git branch -M main
git push -u origin main
```

✅ **Checkpoint**: Your code should now be on GitHub!

---

## 🔧 STEP 2: Deploy Backend to Vercel

### 2.1 Import Backend Project

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `success-mantra-react` repository
4. **IMPORTANT**: Click "Configure Project"
5. Set **Root Directory** to: `backend`
6. **Framework Preset**: Other
7. Click "Continue"

### 2.2 Configure Environment Variables

Before deploying, add these environment variables:

Click "Environment Variables" and add:

| Name | Value |
|------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Any random secret (e.g., `my-super-secret-jwt-key-2024`) |
| `JWT_EXPIRE` | `7d` |
| `NODE_ENV` | `production` |
| `PORT` | `5001` |
| `FRONTEND_URL` | Leave empty for now (we'll update after frontend deployment) |

**MongoDB URI Example:**
```
mongodb+srv://username:password@cluster.mongodb.net/success-mantra?retryWrites=true&w=majority
```

### 2.3 Deploy Backend

1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Once done, you'll see: ✅ "Congratulations!"
4. **COPY YOUR BACKEND URL** (e.g., `https://success-mantra-backend.vercel.app`)

### 2.4 Test Backend

Open your backend URL in browser:
```
https://your-backend-url.vercel.app/api/health
```

You should see:
```json
{
  "success": true,
  "message": "Success Mantra API is running"
}
```

✅ **Checkpoint**: Backend is live!

---

## 🎨 STEP 3: Deploy Frontend to Vercel

### 3.1 Update Frontend API URL

**IMPORTANT**: Before deploying frontend, update the API URL.

Open: `frontend/src/services/api.js`

Find this line:
```javascript
const API_URL = 'http://localhost:5001/api';
```

Change it to:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.vercel.app/api';
```

Replace `your-backend-url.vercel.app` with your actual backend URL from Step 2.3.

**Commit this change:**
```bash
git add frontend/src/services/api.js
git commit -m "Update API URL for production"
git push
```

### 3.2 Import Frontend Project

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `success-mantra-react` repository again
4. **IMPORTANT**: Click "Configure Project"
5. Set **Root Directory** to: `frontend`
6. **Framework Preset**: Vite
7. Click "Continue"

### 3.3 Configure Frontend Environment Variables (Optional)

If you want to use environment variables:

| Name | Value |
|------|-------|
| `VITE_API_URL` | Your backend URL + `/api` |

Example: `https://success-mantra-backend.vercel.app/api`

### 3.4 Deploy Frontend

1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Once done, you'll see: ✅ "Congratulations!"
4. **COPY YOUR FRONTEND URL** (e.g., `https://success-mantra.vercel.app`)

✅ **Checkpoint**: Frontend is live!

---

## 🔄 STEP 4: Update Backend CORS

Now that frontend is deployed, update backend to allow requests from frontend domain.

### 4.1 Update Backend Environment Variables

1. Go to your **Backend project** on Vercel
2. Click "Settings" → "Environment Variables"
3. Find `FRONTEND_URL` (or add it if missing)
4. Set value to your frontend URL: `https://your-frontend-url.vercel.app`
5. Click "Save"

### 4.2 Redeploy Backend

1. Go to "Deployments" tab
2. Click the three dots on the latest deployment
3. Click "Redeploy"
4. Wait for redeployment

✅ **Checkpoint**: CORS is configured!

---

## 🧪 STEP 5: Test Your Deployment

### 5.1 Test Frontend
Visit your frontend URL: `https://your-frontend-url.vercel.app`

### 5.2 Test User Registration
1. Click "Login" → "Register"
2. Create a test account
3. If successful, backend is working!

### 5.3 Test Quiz System
1. Login with your account
2. Go to "Quiz"
3. Take a quiz
4. Check if XP updates

### 5.4 Test Enrollment
1. Click "Enroll Now"
2. Fill the admission form
3. Submit
4. Check if it saves

---

## 🎉 SUCCESS!

Your Success Mantra Institute is now live on Vercel!

**Your URLs:**
- 🌐 Frontend: `https://your-frontend-url.vercel.app`
- 🔧 Backend API: `https://your-backend-url.vercel.app`

---

## 🔧 Common Issues & Solutions

### Issue 1: "Cannot connect to database"
**Solution**: Check MongoDB Atlas
- Ensure IP whitelist includes `0.0.0.0/0` (allow all)
- Verify connection string in Vercel environment variables

### Issue 2: "CORS error"
**Solution**: 
- Make sure `FRONTEND_URL` is set in backend environment variables
- Redeploy backend after updating

### Issue 3: "API calls failing"
**Solution**:
- Check if backend URL in frontend is correct
- Test backend health endpoint: `/api/health`

### Issue 4: "Environment variables not working"
**Solution**:
- After adding/changing env vars, always redeploy
- For frontend, env vars must start with `VITE_`

---

## 📝 Post-Deployment Checklist

- [ ] Backend health check works
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Quiz system works
- [ ] Enrollment form works
- [ ] XP system updates
- [ ] All pages are responsive

---

## 🔄 Future Updates

To update your deployed app:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. Vercel will **automatically redeploy** both projects!

---

## 📞 Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables
4. Test backend API endpoints directly

---

**Happy Deploying! 🚀**
