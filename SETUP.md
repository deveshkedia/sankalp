# Sanklap Event Platform - Complete Setup Guide

## 🎯 Quick Summary

You now have a **complete, production-ready event management system** with:

✅ **Round 1**: Team registration → Sector selection (password-protected) → Company name submission
✅ **Round 2**: Google Drive image/link submission  
✅ **Round 3**: Terra coin allocation (100 coins across 5 channels) → Sector selection → A/B/C choice
✅ **Admin Control**: Setup panel to configure sectors & channels
✅ **Admin Dashboard**: Real-time stats, submission tracking, CSV export
✅ **Session Persistence**: Teams can resume anytime using browser localStorage

---

## 📋 Prerequisites

1. **Supabase Account** (free tier works): https://supabase.com
2. **Node.js 20+** (your current is 16.15.1, need to upgrade)
3. **Git** (for version control)
4. **Vercel Account** (optional, for hosting)

---

## 🚀 Step-by-Step Setup

### Step 1: Upgrade Node.js

You need Node.js 20 or higher.

**Option A: Using Homebrew (macOS)**

```bash
brew install node@20
brew link node@20 --force
node --version  # Should show v20.x.x
```

**Option B: Using nvm (recommended)**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

---

### Step 2: Create Supabase Database

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Save your **Project URL** and **Anon Key** (from Settings > API Keys)
4. Go to **SQL Editor** and run this SQL:

```sql
-- Create tables
CREATE TABLE sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  situation TEXT NOT NULL,
  constraint TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT UNIQUE NOT NULL,
  current_round INTEGER DEFAULT 1,
  round1_sector UUID,
  round1_company TEXT,
  round2_image_link TEXT,
  round3_allocations JSONB,
  round3_sector UUID,
  round3_choice TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT NOT NULL,
  round INTEGER NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### Step 3: Configure Environment Variables

In the project directory, open `.env.local` and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual Supabase credentials from Step 2.

---

### Step 4: Install Dependencies

```bash
cd /Users/deveshkedia/Development/Projects/Doing/sanklap
npm install
```

---

### Step 5: Run Development Server

```bash
npm run dev
```

Your app will be available at: **http://localhost:3000**

---

## 📱 Testing the Event

### Register as a Team

1. Open http://localhost:3000
2. Enter team name → Click "Next"
3. You're in Round 1

### Admin Setup

1. Open http://localhost:3000/admin/setup
2. Password: `admin123`
3. Add sectors:
   - **Name**: Healthcare
   - **Situation**: Your company develops health monitoring devices. You need to decide your go-to-market strategy...
   - **Constraint**: You have a budget of only $500K and 3 months to launch
   - **Password**: health123
4. Add 5 channels:
   - Social Media
   - Email Marketing
   - Website
   - Partnerships
   - Paid Advertising

### Admin Dashboard

1. Open http://localhost:3000/admin/dashboard
2. Password: `admin123`
3. Monitor team progress in real-time
4. Download CSV with all submissions

---

## 🌐 Deployment to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial Sanklap event platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sanklap.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/import
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click Deploy

Your event will be live at: `https://sanklap-event.vercel.app`

---

## 🔐 Security: Change Admin Password

Before going live, change the admin password in BOTH files:

**File 1**: `/app/admin/setup/page.tsx`

```tsx
if (password === 'admin123') {  // Change this to your password
```

**File 2**: `/app/admin/dashboard/page.tsx`

```tsx
if (password === 'admin123') {  // Change this to your password
```

---

## 📊 Event Flow

### **Participant Timeline**

```
┌─────────────────────────────────────┐
│  ROUND 1: Sector Selection          │
├─────────────────────────────────────┤
│ 1. Enter Team Name                  │
│ 2. Select Sector (1 of 10)          │
│ 3. Enter Sector Password            │
│ 4. Read Situation & Constraint      │
│ 5. Enter Company Name               │
│ 6. Submit → Move to Round 2         │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│  ROUND 2: Image Submission          │
├─────────────────────────────────────┤
│ 1. Provide Google Drive Link        │
│ 2. Submit → Move to Round 3         │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│  ROUND 3: Coin Allocation & Choice  │
├─────────────────────────────────────┤
│ 1. Allocate 100 Terra Coins         │
│    across 5 Channels (auto-saves)   │
│ 2. Select Sector                    │
│ 3. Choose A, B, or C (FINAL)        │
│ 4. Submit → Event Complete          │
└─────────────────────────────────────┘
```

---

## 💾 Data Storage

All submissions are stored in Supabase and visible in the Admin Dashboard:

### **What We Collect**:

**Round 1**:

- Team Name
- Selected Sector
- Company Name

**Round 2**:

- Google Drive Link

**Round 3**:

- Channel Allocations (JSON)
- Selected Sector
- A/B/C Choice

### **Download Submissions**:

Admin Dashboard → Click "Download CSV" → Get Excel file with all data

---

## 🔧 Troubleshooting

| Problem                      | Solution                                      |
| ---------------------------- | --------------------------------------------- |
| "Node version error"         | Upgrade to Node 20+: `nvm install 20`         |
| "Supabase connection failed" | Check `.env.local` has correct URL & key      |
| "Teams can't see sectors"    | Login to admin and add sectors first          |
| "Admin login not working"    | Password is `admin123` (before you change it) |
| "Show me submissions"        | Go to `/admin/dashboard` and login            |

---

## 📚 File Structure

```
sanklap/
├── app/
│   ├── page.tsx                (Main event flow)
│   ├── admin/
│   │   ├── page.tsx           (Admin home)
│   │   ├── setup/page.tsx     (Configure sectors & channels)
│   │   └── dashboard/page.tsx (View submissions & stats)
│   └── layout.tsx
├── components/
│   ├── TeamNameInput.tsx       (Round 1 registration)
│   ├── Round1.tsx             (Sector selection)
│   ├── Round2.tsx             (Image submission)
│   └── Round3.tsx             (Coin allocation & choice)
├── lib/
│   └── supabase.ts            (Database client)
├── .env.local                 (YOUR SECRETS - don't share!)
└── package.json
```

---

## 🎉 You're All Set!

Your event platform is complete. To launch:

1. ✅ Upgrade Node.js
2. ✅ Create Supabase database (copy-paste SQL)
3. ✅ Add `.env.local` with Supabase credentials
4. ✅ Run `npm install` then `npm run dev`
5. ✅ Go to `/admin/setup` and configure sectors
6. ✅ Share event link with teams!

---

## 📞 Quick Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install
```

---

**Questions?** Check your `.env.local`, Supabase tables, and admin password! 🚀
