# Sanklap Event Management Platform

A complete multi-round event management system built with Next.js, React, and Supabase.

## Features

### For Participants

- **Round 1**: Team registration → Sector selection with password protection → Company name submission
- **Round 2**: Google Drive image/document link submission
- **Round 3**: Terra coin allocation across channels → Sector selection → Final A/B/C choice
- Session resumption: Teams can close browser and come back where they left off

### For Organizers

- **Admin Setup**: Configure sectors (with situation/constraint/password) and channels
- **Admin Dashboard**: Real-time submission tracking, team progress stats, CSV export
- Single unified link for all rounds
- Secure admin login

## Tech Stack

- **Frontend**: Next.js 15+ with React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Hosting**: Vercel (frontend) + Supabase (database)

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project and note your URL and anon key
3. In the SQL Editor, run these commands to create tables:

```sql
-- Sectors table
CREATE TABLE sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  situation TEXT NOT NULL,
  constraint TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Channels table
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team sessions table
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

-- Submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT NOT NULL,
  round INTEGER NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Setup Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace with your actual Supabase credentials from your project settings.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## URLs

- **Event Link (for participants)**: `http://localhost:3000/`
- **Admin Home**: `http://localhost:3000/admin`
- **Admin Setup**: `http://localhost:3000/admin/setup` (password: secure)
- **Admin Dashboard**: `http://localhost:3000/admin/dashboard` (password: secure)

## Event Flow

### Round 1

1. Teams enter their name
2. See 10 sectors, select one
3. Enter password for that sector (set by organizer)
4. View situation & constraint
5. Enter company name
6. Submit

### Round 2

1. Teams submit Google Drive link to their image/presentation
2. Submit and move to next round

### Round 3

1. Allocate 100 terra coins across 5 channels
2. Select a sector (same as Round 1)
3. Choose A, B, or C (final decision - irreversible)
4. Complete event

## Admin Setup Walkthrough

1. Login to Admin Setup (`/admin/setup`) with your admin password
2. Add all 10 sectors with:
   - **Name**: e.g., "Healthcare"
   - **Situation**: Business scenario description
   - **Constraint**: Limitations teams must work within
   - **Password**: Secret code for teams to unlock this sector
3. Add all 5 channels for Round 3 allocation

> Tip: when adding sectors you may now supply an **optional second password** used during the Round 3 sector unlock. Leave it blank to reuse the Round 1 password.

> You can also configure **market event cards** (A/B/C outcomes) under the new "Market Events" tab in the setup panel.
4. Share event link with teams
5. Monitor progress in Admin Dashboard (`/admin/dashboard`)
6. Export submissions as CSV anytime

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel settings
4. Deploy!

## Production Checklist

- [ ] Change admin password in `/app/admin/setup/page.tsx` and `/app/admin/dashboard/page.tsx`
- [ ] Add Supabase RLS policies for security if needed
- [ ] Test all three rounds thoroughly
- [ ] Backup your Supabase database
- [ ] Set up custom domain

## Modifying Admin Password

Edit the password check in:

- `/app/admin/setup/page.tsx` (line ~35)
- `/app/admin/dashboard/page.tsx` (line ~52)

Change `if (password === 'admin123')` to your desired password.

## Troubleshooting

- **Teams can't see sectors**: Check if sectors are added in Admin Setup
- **Submissions not saving**: Verify Supabase URL and anon key in `.env.local`
- **Admin login fails**: Check admin password matches your configuration
- **Database error**: Ensure all tables are created in Supabase SQL Editor

## Project Structure

```
sanklap/
├── app/
│   ├── admin/
│   │   ├── page.tsx (admin home)
│   │   ├── setup/page.tsx (configure sectors & channels)
│   │   └── dashboard/page.tsx (view submissions)
│   ├── page.tsx (main event flow)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── TeamNameInput.tsx
│   ├── Round1.tsx
│   ├── Round2.tsx
│   └── Round3.tsx
├── lib/
│   └── supabase.ts (database client)
├── .env.local (environment variables)
└── package.json
```

## Support

For issues or questions, check the Supabase documentation or Next.js documentation.

---

Built with ❤️ for Sanklap Event
# sankalp
