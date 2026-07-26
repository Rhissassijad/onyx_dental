# Deployment Guide: Onyx Dental Office

This guide walks you through deploying your Next.js frontend, Express backend, and MongoDB database to production.

## Architecture Overview

```
                    onyx-dental-office.ma
                            |
            __________________+__________________
            |                                    |
        Vercel                              Render
    (Frontend - Next.js)              (Backend - Express API)
            |                                    |
            |________________________|________________________
                                     |
                            MongoDB Atlas
                            (Database)
```

## Prerequisites

- GitHub account (for version control)
- Vercel account (for frontend)
- Render account (for backend)
- MongoDB Atlas account (for database)
- Stripe account (for payments)
- Domain name (onyx-dental-office.ma)

---

# PART 1: Push Project to GitHub

## Step 1: Initialize Git & Create Repository

```bash
cd /Users/jadrhissassi/Desktop/Onyx\ Dental\ Office
git init
git add .
git commit -m "Initial commit: Onyx Dental Office - Frontend, Backend, Database setup"
```

## Step 2: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `onyx-dental-office`
3. Description: "Dental office web application with appointments and payments"
4. Choose **Public** or **Private**
5. Click **Create Repository**

## Step 3: Connect Local Repository to GitHub

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/onyx-dental-office.git
git branch -M main
git push -u origin main
```

✅ **Your project is now on GitHub!**

---

# PART 2: Deploy MongoDB Atlas (Database)

## Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Click **Sign Up with Google** or **Sign Up with GitHub**
3. Complete your profile

## Step 2: Create a Free Cluster

1. Click **Build a Cluster**
2. Choose **M0 Sandbox** (free tier)
3. Select your region (choose closest to your users):
   - If users are in **Africa/Europe**: `eu-west-1` (Ireland)
   - If users are in **Middle East**: `eu-central-1` (Frankfurt)
4. Cluster name: `onyx-cluster`
5. Click **Create Deployment**

## Step 3: Create Database User

1. Click **Database Access**
2. Click **Add New Database User**
3. Authentication Method: **Password**
4. Username: `onyxAdmin`
5. Password: Create a **strong password** (min 8 chars, mix of upper, lower, numbers, symbols)
   - Example: `Onyx@Dental2024!Secure`
6. Click **Add User**

⚠️ **SAVE YOUR PASSWORD SECURELY** - You'll need it later!

## Step 4: Configure Network Access

1. Click **Network Access**
2. Click **Add IP Address**
3. Choose **Allow Access from Anywhere**
   - This adds `0.0.0.0/0` (all IPs can connect)
4. Click **Confirm**

⚠️ _Later, you can restrict this to only your Render IP for more security_

## Step 5: Get Connection String

1. Go back to **Databases**
2. Click **Connect** on your cluster
3. Choose **Drivers**
4. Select **Node.js**
5. You'll see something like:

```
mongodb+srv://onyxAdmin:<password>@onyx-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. Replace `<password>` with your actual password
7. Add database name at the end:

```
mongodb+srv://onyxAdmin:YOUR_PASSWORD@onyx-cluster.xxxxx.mongodb.net/onyxDentalDB?retryWrites=true&w=majority
```

8. **Copy and save this connection string** - you'll need it for Render

---

# PART 3: Deploy Backend API on Render

## Step 1: Connect GitHub to Render

1. Go to [render.com](https://render.com)
2. Click **Sign up** with GitHub
3. Authorize GitHub access
4. Click **New** → **Web Service**

## Step 2: Select Repository

1. Under **GitHub**, find `onyx-dental-office`
2. Click **Connect**
3. (Render will ask for permission to access your GitHub repos)

## Step 3: Configure Web Service

Fill in these settings:

| Setting            | Value          |
| ------------------ | -------------- |
| **Name**           | `onyx-backend` |
| **Root Directory** | `backend`      |
| **Environment**    | `Node`         |
| **Build Command**  | `npm install`  |
| **Start Command**  | `npm start`    |
| **Instance Type**  | `Free`         |

## Step 4: Add Environment Variables

1. Scroll down to **Environment**
2. Click **Add Environment Variable**
3. Add these variables:

| Key                 | Value                                                      |
| ------------------- | ---------------------------------------------------------- |
| `MONGO_URI`         | Your MongoDB connection string from Part 2                 |
| `PORT`              | `5000`                                                     |
| `STRIPE_SECRET_KEY` | Your Stripe secret key (from .env)                         |
| `FRONTEND_URL`      | `https://onyx-dental-office.ma` (you'll update this later) |

⚠️ **Do NOT include quotes around values**

## Step 5: Deploy

1. Click **Create Web Service**
2. Render will deploy automatically
3. Wait for deployment to complete (takes 2-3 minutes)
4. You'll see a URL like: `https://onyx-backend.onrender.com`

## Step 6: Test Your Backend

1. Go to `https://onyx-backend.onrender.com` in your browser
2. You should see a simple response
3. Test API: `https://onyx-backend.onrender.com/api/appointments`

✅ **Backend is deployed!**

---

# PART 4: Deploy Frontend on Vercel

## Step 1: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign up** with GitHub
3. Authorize GitHub access

## Step 2: Import Project

1. Click **Add New...** → **Project**
2. Under GitHub, find `onyx-dental-office`
3. Click **Import**

## Step 3: Configure Project

| Setting            | Value      |
| ------------------ | ---------- |
| **Framework**      | `Next.js`  |
| **Root Directory** | `frontend` |

## Step 4: Add Environment Variables

1. Scroll to **Environment Variables**
2. Add:

| Key                             | Value                               |
| ------------------------------- | ----------------------------------- |
| `NEXT_PUBLIC_API_URL`           | `https://onyx-backend.onrender.com` |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Your Stripe public key (pk\_...)    |

## Step 5: Deploy

1. Click **Deploy**
2. Vercel will build and deploy automatically
3. Wait for deployment (takes 3-5 minutes)
4. You'll get a URL like: `https://onyx-dental.vercel.app`

## Step 6: Test Your Frontend

1. Go to `https://onyx-dental.vercel.app`
2. Test the appointment booking form
3. Verify API calls work by checking browser DevTools → Network tab

✅ **Frontend is deployed!**

---

# PART 5: Connect Your Domain

## Step 1: Buy Domain

1. Go to your domain registrar (NinjaHost, GoDaddy, NameCheap, etc.)
2. Search for `onyx-dental-office.ma`
3. Buy the domain (usually $5-20/year)
4. Complete payment

## Step 2: Add Domain to Vercel

1. Go to **Vercel Dashboard**
2. Click your project → **Settings** → **Domains**
3. Click **Add** and enter: `onyx-dental-office.ma`
4. Vercel will show you DNS records needed:

```
A Record:        onyx-dental-office.ma → 76.76.21.21
CNAME Record:    www.onyx-dental-office.ma → cname.vercel-dns.com
```

(Your actual IP/CNAME may differ)

## Step 3: Update DNS at Your Registrar

1. Go to your domain registrar (NinjaHost DNS panel)
2. Find **DNS Settings** or **Manage Records**
3. Add/Update these records:

   **A Record**
   - Name: `@` (or your domain name)
   - Type: `A`
   - Value: `76.76.21.21` (from Vercel)
   - TTL: `3600`

   **CNAME Record**
   - Name: `www`
   - Type: `CNAME`
   - Value: `cname.vercel-dns.com` (from Vercel)
   - TTL: `3600`

4. Click **Save** or **Update**

⏳ **Wait for DNS propagation** (5-48 hours, usually 15-30 minutes)

## Step 4: Verify Domain Works

```bash
# After DNS propagates
curl https://onyx-dental-office.ma
# Should load your site
```

✅ **Your domain is live!**

---

# PART 6: Update Environment Variables

## Update Render Backend

Now that your domain is live, update Render environment variables:

1. Go to **Render Dashboard**
2. Click `onyx-backend` service
3. Click **Environment**
4. Edit `FRONTEND_URL` → `https://onyx-dental-office.ma`
5. Click **Save**
6. Service will redeploy automatically

## Update Vercel Frontend

1. Go to **Vercel Dashboard**
2. Click your project → **Settings** → **Environment Variables**
3. Verify `NEXT_PUBLIC_API_URL` is set to `https://onyx-backend.onrender.com`

---

# PART 7: Security Checklist

Before going live, ensure security:

- ✅ Never commit `.env` files
- ✅ Use strong MongoDB password
- ✅ Enable HTTPS (Vercel & Render do this automatically)
- ✅ Restrict MongoDB network access (later, only allow Render IP)
- ✅ Use environment variables for all secrets
- ✅ Keep Stripe keys secure (never expose public in backend)

### Later: Restrict MongoDB Access

1. Go to MongoDB Atlas
2. **Network Access** → Find Render's IP
3. Remove `0.0.0.0/0`
4. Add Render IP only for better security

---

# PART 8: Testing Production

## Verify Everything Works

1. **Frontend**: Go to `https://onyx-dental-office.ma`
2. **API**: Call backend from browser DevTools console:
   ```javascript
   fetch("https://onyx-backend.onrender.com/api/appointments")
     .then((r) => r.json())
     .then(console.log);
   ```
3. **Payments**: Test Stripe payment with test card `4242 4242 4242 4242`
4. **Database**: Verify appointments are saved in MongoDB Atlas

## Check Performance

- Mobile responsiveness at https://onyx-dental-office.ma
- Images load correctly
- Forms submit without errors
- Stripe checkout works

---

# PART 9: Monitoring & Maintenance

## Daily Checks

- Monitor Vercel logs: Vercel Dashboard → Deployments
- Monitor Render logs: Render Dashboard → Logs
- Check MongoDB Atlas: Monitoring dashboard

## Automatic Deployments

- **Frontend**: Vercel auto-deploys on `git push` to main
- **Backend**: Render auto-deploys on `git push` to main

Just push code to GitHub and it deploys automatically!

## Troubleshooting

### Site Not Loading

- Check Vercel deployment status
- Check DNS propagation: `nslookup onyx-dental-office.ma`
- Clear browser cache

### API Not Responding

- Check Render logs: `https://dashboard.render.com/`
- Verify MongoDB connection string
- Check CORS settings in backend

### Database Connection Fails

- Verify `MONGO_URI` environment variable
- Check MongoDB password contains no special characters
- Verify IP whitelist: `0.0.0.0/0` in MongoDB Atlas

---

# Summary

| Component       | Hosted On     | URL                                 |
| --------------- | ------------- | ----------------------------------- |
| **Frontend**    | Vercel        | `onyx-dental-office.ma`             |
| **Backend API** | Render        | `https://onyx-backend.onrender.com` |
| **Database**    | MongoDB Atlas | Cloud (managed)                     |

Your Onyx Dental Office app is now live! 🚀

---

## Quick Reference Commands

```bash
# Deploy changes
git add .
git commit -m "Your changes"
git push origin main

# Check backend locally
curl http://localhost:5000/api/appointments

# Check frontend locally
npm --prefix frontend run dev
```

---

## Support

If you need help:

1. Check Vercel logs
2. Check Render logs
3. Check MongoDB Atlas monitoring
4. Review error messages in browser console

Deployment complete! 🎉
