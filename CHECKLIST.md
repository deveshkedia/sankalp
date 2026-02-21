# 🚀 Sanklap Event Platform - Launch Checklist

## Pre-Launch Setup (Do This First)

### ✅ Environment Setup

- [ ] Node.js 20+ installed (`node --version`)
- [ ] Supabase account created at supabase.com
- [ ] `.env.local` file has your Supabase URL and Anon Key
- [ ] Project dependences installed (`npm install`)

### ✅ Database Setup

- [ ] Supabase project created
- [ ] SQL schema copied and ran (from SCHEMA.sql file)
- [ ] All 4 tables exist: sectors, channels, team_sessions, submissions
- [ ] Sample sectors added (or your own)
- [ ] 5 channels added

### ✅ Admin Configuration

- [ ] Changed admin password (in `/app/admin/setup/page.tsx` and `/app/admin/dashboard/page.tsx`)
- [ ] Logged into `/admin/setup` and verified it works
- [ ] Added all 10 sectors (or however many you need)
- [ ] Added sector passwords for each
- [ ] Tested sector unlock with correct password
- [ ] Added all 5 channels for Round 3

---

## Pre-Event Testing

### ✅ Participant Flow

- [ ] Test as Team 1:
  - [ ] Enter team name
  - [ ] See all sectors
  - [ ] Click a sector
  - [ ] Enter wrong password → See error ✓
  - [ ] Enter correct password → Unlock ✓
  - [ ] See situation and constraint
  - [ ] Enter company name
  - [ ] Click "Done" → Move to Round 2
- [ ] Test Round 2:
  - [ ] See Google Drive link input
  - [ ] Enter invalid link → See error ✓
  - [ ] Enter valid Google Drive link
  - [ ] Click "Submit" → Move to Round 3
- [ ] Test Round 3:
  - [ ] See 100 terra coins available
  - [ ] Allocate across 5 channels
  - [ ] Total must equal 100 to proceed
  - [ ] Select a sector
  - [ ] Choose A, B, or C
  - [ ] Confirm choice (can't go back)
  - [ ] See completion screen

- [ ] Test Session Resume:
  - [ ] Close browser window mid-way
  - [ ] Reopen localhost:3000
  - [ ] Enter same team name
  - [ ] Should resume where left off ✓

### ✅ Admin Dashboard

- [ ] Login to `/admin/dashboard`
- [ ] See stats: Total Teams, Round 1 Complete, etc.
- [ ] See all submissions in table
- [ ] Filter by Round 1/2/3
- [ ] Click "View Details" on a submission
- [ ] Click "Download CSV" and verify data
- [ ] Click "Refresh" button

---

## Production Deployment (Optional)

### ✅ Prepare for Vercel

- [ ] Push code to GitHub (public or private)
- [ ] Remove any hardcoded sensitive data
- [ ] Ensure `.env.local` is in `.gitignore` (it is)
- [ ] Build locally and test: `npm run build` then `npm run preview`

### ✅ Deploy to Vercel

- [ ] Create account at Vercel.com
- [ ] Import GitHub repository
- [ ] Add environment variables in Vercel dashboard:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Deploy
- [ ] Test at `your-domain.vercel.app`

### ✅ Setup Custom Domain (Optional)

- [ ] Buy domain (GoDaddy, Namecheap, etc.)
- [ ] Point to Vercel (Vercel shows instructions)
- [ ] Setup SSL certificate (Vercel does automatically)

---

## Event Day

### ✅ Day Before Event

- [ ] Verify database is live
- [ ] Test all three rounds one more time
- [ ] Backup Supabase database (optional but recommended)
- [ ] Clear any test data from submissions table
- [ ] Prepare event link to share
- [ ] Check admin password works
- [ ] Have admin dashboard open and ready

### ✅ Event Start

- [ ] Share this link with teams: `https://your-event.com/`
- [ ] Admin keeps dashboard open to monitor
- [ ] Check submissions coming in (Refresh button)
- [ ] No need to do anything - platform is automated!

### ✅ After Event

- [ ] Download CSV with all submissions
- [ ] Save database backup
- [ ] Celebrate! 🎉

---

## Important URLs Reference

```
Team Link:          https://your-domain.com/
Admin Home:         https://your-domain.com/admin
Admin Setup:        https://your-domain.com/admin/setup
Admin Dashboard:    https://your-domain.com/admin/dashboard
```

All except Team Link require the admin password.

---

## File Locations for Customization

### Change Colors/Branding

- `/app/globals.css` - Modify Tailwind classes
- `/components/TeamNameInput.tsx` - Round 1 colors
- `/components/Round1.tsx` - Round 1 colors
- `/components/Round2.tsx` - Round 2 colors
- `/components/Round3.tsx` - Round 3 colors

### Change Admin Password

- `/app/admin/setup/page.tsx` - Line with `if (password === 'admin123')`
- `/app/admin/dashboard/page.tsx` - Line with `if (password === 'admin123')`

### Change Event Name

- `/components/TeamNameInput.tsx` - "Sanklap Event"
- `/components/Round1.tsx` - "Sanklap Event"
- `/components/Round2.tsx` - "Sanklap Event"
- `/components/Round3.tsx` - "Sanklap Event"
- `/app/page.tsx` - Completion message

---

## Troubleshooting During Event

| Issue                   | Quick Fix                                                         |
| ----------------------- | ----------------------------------------------------------------- |
| Site won't load         | Check `.env.local` has correct Supabase URL & key                 |
| "Team not found" error  | Verify team name spelled correctly                                |
| Submissions not showing | Refresh admin dashboard or check database directly                |
| Sector passwords wrong  | Go to admin setup and edit sector password                        |
| Admin login fails       | Use correct admin password (not public)                           |
| Site is slow            | Check Supabase database isn't rate limited (free tier has limits) |

---

## Important Notes for Organizers

1. **Passwords**: Each sector has its own password. Only teams with correct password can see situation/constraint.

2. **One Sector Per Team**: Team selects one sector in Round 1, same sector must be selected in Round 3.

3. **Terra Coins (Round 3)**: Teams have exactly 100 coins. Must allocate all 100 across 5 channels to proceed.

4. **Final Choice**: A/B/C choice is IRREVERSIBLE - once clicked, cannot change.

5. **Session Persistence**: Teams can close browser and resume by entering same team name.

6. **Data Privacy**: All submissions stored in Supabase. You can export anytime.

---

## Going Live - Final Checklist

Before sharing link with teams:

- [ ] All sectors added and passwords set
- [ ] All channels added
- [ ] Admin dashboard working
- [ ] Test team can complete all 3 rounds
- [ ] CSV download works
- [ ] Custom domain setup (if using)
- [ ] Communicated event link to teams
- [ ] Admin password changed and only shared privately

---

## Questions?

Check these files:

- `README.md` - Overall platform info
- `SETUP.md` - Step-by-step setup guide
- `SCHEMA.sql` - Database structure

Good luck with your event! 🎯

---

**Event Platform Built**: February 2026
**Platform Status**: Production Ready ✅
**Support**: See technical documentation in README.md
