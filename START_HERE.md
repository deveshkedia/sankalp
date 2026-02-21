# 🎯 Sanklap Event Platform - README

Welcome! You have a **complete, production-ready event management system** built with Next.js and Supabase.

## 📖 Getting Started in 3 Steps

### 1️⃣ Upgrade Node.js (if needed)

```bash
# Check your Node version
node --version

# If below 20, upgrade using Homebrew:
brew install node@20
brew link node@20 --force
```

### 2️⃣ Setup Database

1. Go to https://supabase.com
2. Create a project (free tier works!)
3. Copy `SCHEMA.sql` from this repo into Supabase SQL Editor
4. Run it to create all tables
5. Copy your Project URL and Anon Key

### 3️⃣ Configure & Run

```bash
# Update .env.local with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here

# Install and run
npm install
npm run dev
```

Visit `http://localhost:3000` 🚀

---

## 📚 Documentation Files

| File           | Purpose                            |
| -------------- | ---------------------------------- |
| `README.md`    | This file - Overview               |
| `SETUP.md`     | Detailed setup instructions        |
| `CHECKLIST.md` | Launch checklist & troubleshooting |
| `SCHEMA.sql`   | Database schema (copy to Supabase) |

---

## 🎮 How the Event Works

### For Teams

```
1. Register with team name
2. Select a sector (password protected)
3. Read business scenario
4. Submit company name
   ↓
5. Submit Google Drive link (image/presentation)
   ↓
6. Allocate 100 "terra coins" across 5 channels
7. Select same sector again
8. Choose A, B, or C (final, irreversible choice)
✓ Event complete!
```

### For Organizers

```
1. Go to /admin/setup
2. Add 10 sectors with situations, constraints, passwords
3. Add 5 channels for Round 3
4. Share event link with teams
5. Monitor in /admin/dashboard (live stats, CSV export)
```

---

## 🗂️ Project Structure

```
sanklap/
├── app/
│   ├── page.tsx                    # Main event flow (3 rounds)
│   ├── admin/
│   │   ├── page.tsx               # Admin home
│   │   ├── setup/page.tsx         # Configure sectors & channels
│   │   └── dashboard/page.tsx     # View submissions & stats
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── TeamNameInput.tsx          # Round 1: Team registration
│   ├── Round1.tsx                 # Round 1: Sector selection
│   ├── Round2.tsx                 # Round 2: Image submission
│   └── Round3.tsx                 # Round 3: Coins & choice
├── lib/
│   └── supabase.ts                # Database client
├── .env.local                     # Your secrets (don't commit!)
├── README.md                      # This file
├── SETUP.md                       # Detailed setup guide
├── CHECKLIST.md                   # Pre-launch checklist
└── SCHEMA.sql                     # Database schema
```

---

## 🔗 Key URLs

| URL                              | Purpose                       | Auth           |
| -------------------------------- | ----------------------------- | -------------- |
| `localhost:3000`                 | Event link (share with teams) | None           |
| `localhost:3000/admin`           | Admin home                    | Admin password |
| `localhost:3000/admin/setup`     | Configure event               | Admin password |
| `localhost:3000/admin/dashboard` | View submissions              | Admin password |

**Default admin password**: Changed during setup (contact organizer)

---

## 📊 What Gets Stored

### Round 1

- Team name
- Selected sector
- Company name

### Round 2

- Google Drive link

### Round 3

- Coin allocation (JSON)
- Selected sector
- A/B/C choice

**All data accessible in admin dashboard → Download CSV**

---

## ⚙️ Tech Stack

- **Frontend**: Next.js 16 + React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Hosting**: Vercel (optional - free)
- **Icons**: Lucide React

---

## 🚀 Deploy to Production

### Option 1: Vercel (Easiest - FREE)

```bash
# Push to GitHub
git init && git add . && git commit -m "Initial"
git remote add origin https://github.com/your-username/sanklap.git
git push -u origin main

# Go to https://vercel.com/import
# Select your GitHub repo
# Add environment variables
# Deploy!
```

### Option 2: Other Hosting

Any Node.js 20+ compatible host works (AWS, Railway, Render, etc.).

---

## 🔒 Security Notes

1. **Change Admin Password** (before launch!)
   - `/app/admin/setup/page.tsx` - Line ~35
   - `/app/admin/dashboard/page.tsx` - Line ~52
   - Change admin password in code before deployment

2. **Keep .env.local Private**
   - It's in `.gitignore` (don't accidentally commit it!)
   - On production (Vercel), set vars in dashboard

3. **Database Access**
   - Only anon key is exposed (safe)
   - Configure Supabase RLS if needed (optional)

---

## 🐛 Common Issues

| Problem                 | Solution                                          |
| ----------------------- | ------------------------------------------------- |
| Site won't load         | Check `.env.local` has correct Supabase URL & key |
| "Node version error"    | Upgrade to Node 20+: `nvm install 20`             |
| "Can't lock sectors"    | Admin hasn't added sectors yet (/admin/setup)     |
| Submissions not showing | Go to admin → Dashboard → Click Refresh           |
| Admin password wrong    | Check with event organizer for credentials        |

See `CHECKLIST.md` for more help.

---

## 📝 Customization

### Change Event Name

Search-replace "Sanklap Event" throughout components

### Change Colors

Modify `/app/globals.css` or Tailwind class names

### Add More Rounds

Duplicate Round1.tsx/2/3 pattern in `/components` and `/app/page.tsx`

### Custom Sectors/Channels

Add via admin dashboard (/admin/setup) - no code changes needed!

---

## 💡 Tips for Event Success

1. **Test Everything First**
   - Complete all 3 rounds as a test team
   - Test session resume (close/reopen browser)
   - Download CSV to verify data

2. **Configure in Advance**
   - Add all 10 sectors before event starts
   - Set unique passwords for each
   - Test sector unlock with correct password

3. **Monitor Live**
   - Keep admin dashboard open
   - Refresh occasionally to see submissions
   - Respond to any issues quickly

4. **After Event**
   - Download CSV with all submissions
   - Optional: backup Supabase database
   - Share results with teams

---

## 📞 Quick Reference Commands

```bash
# Development
npm install              # Install dependencies
npm run dev             # Start dev server (localhost:3000)

# Production
npm run build           # Build for production
npm run preview         # Preview production build

# Utilities
npm run lint            # Run ESLint
```

---

## 🎓 How Teams Experience It

```
Team opens: https://your-domain.com/

Round 1 (5 min):
├─ Enter team name
├─ See 10 sectors, click one
├─ Enter password to unlock
├─ Read situation & constraint
└─ Submit company name

Round 2 (2 min):
├─ Paste Google Drive link
└─ Submit

Round 3 (5 min):
├─ Drag to allocate 100 coins
├─ Select sector
├─ Choose A, B, or C (FINAL)
└─ See completion message

✓ Done! (12 mins total per team)
```

---

## 📧 Event Link to Share

Share this link with your teams:

```
👉 https://your-domain.com
```

(Replace with your actual domain after hosting)

---

## ✅ Pre-Launch Checklist

Before sharing event link:

- [ ] Node.js 20+ installed
- [ ] Supabase database created with schema
- [ ] `.env.local` configured with Supabase credentials
- [ ] All sectors added in admin (/admin/setup)
- [ ] All channels added in admin (/admin/setup)
- [ ] Admin password changed (security!)
- [ ] Tested all 3 rounds as a team
- [ ] Downloaded CSV to verify
- [ ] Admin dashboard working

See `CHECKLIST.md` for detailed pre-launch guide.

---

## 🎉 You're Ready!

Your event platform is **production-ready**.

Follow `SETUP.md` for step-by-step instructions, then come back here for final checks.

Questions? Check the docs or review your Supabase database structure.

Good luck with your event! 🚀

---

**Made with ❤️ for Sanklap Event**  
**Last Updated**: February 2026
