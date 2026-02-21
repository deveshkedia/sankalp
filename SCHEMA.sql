-- Sanklap Event Platform - Database Schema
-- Copy and paste all of this into Supabase SQL Editor and run

-- ============================================
-- CREATE TABLES
-- ============================================

CREATE TABLE sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  situation TEXT NOT NULL,
  "constraint" TEXT NOT NULL,
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

-- ============================================
-- CREATE INDEXES (for better performance)
-- ============================================

CREATE INDEX idx_team_sessions_team_name ON team_sessions(team_name);
CREATE INDEX idx_submissions_team_name ON submissions(team_name);
CREATE INDEX idx_submissions_round ON submissions(round);
CREATE INDEX idx_submissions_created ON submissions(created_at);

-- ============================================
-- EXAMPLE DATA (optional - for testing)
-- ============================================

-- Sample sectors
INSERT INTO sectors (name, situation, "constraint", password) VALUES
('Healthcare', 'Your startup develops AI-powered diagnosis tools. You need to enter the Indian market where regulations are complex and trust is paramount.', 'Budget: $500K, Timeline: 6 months, Limited team resources', 'health123'),
('Finance', 'You built a fintech platform for microfinance. How will you compete with established players and gain customer trust?', 'Budget: $1M, Timeline: 9 months, Compliance challenges', 'finance456'),
('E-Commerce', 'Your marketplace connects local artisans with global buyers. Scale your platform while maintaining quality.', 'Budget: $300K, Timeline: 6 months, Logistics complexity', 'ecomm789'),
('EdTech', 'You created an online learning platform. How will you acquire students in a saturated market?', 'Budget: $800K, Timeline: 12 months, Quality assurance required', 'edtech101'),
('Energy', 'Your renewable energy startup wants to maximize impact. How will you scale operations sustainably?', 'Budget: $2M, Timeline: 18 months, Infrastructure needs', 'energy202'),
('AgriTech', 'You developed precision farming tools. How will you reach and convince rural farmers?', 'Budget: $400K, Timeline: 8 months, Infrastructure barriers', 'agri303'),
('Logistics', 'Your last-mile delivery platform disrupts traditional supply chains. Win the market.', 'Budget: $1.5M, Timeline: 12 months, Competition intense', 'logistics404'),
('IoT', 'You built smart home devices. Enter the market and scale manufacturingcapabilities.', 'Budget: $1.2M, Timeline: 10 months, Supply chain risks', 'iot505'),
('SaaS', 'Your B2B SaaS tool improves workplace productivity. Acquire enterprise customers in a competitive landscape.', 'Budget: $900K, Timeline: 12 months, Sales cycle long', 'saas606'),
('Mobility', 'Your EV charging network solution addresses range anxiety. Scale infrastructure rapidly.', 'Budget: $3M, Timeline: 24 months, Capital intensive', 'mobility707');

-- Sample channels for Round 3
INSERT INTO channels (name) VALUES
('Social Media'),
('Email Marketing'),
('Content Marketing'),
('Partnerships'),
('Paid Advertising');

-- ============================================
-- NOTES
-- ============================================
-- 1. If you don't want sample data, you can delete the INSERT statements above
-- 2. Change passwords for each sector (in the INSERT statement) to your preferences
-- 3. You can always add/remove sectors and channels later from the admin panel
-- 4. Team sessions and submissions are created automatically as teams participate
