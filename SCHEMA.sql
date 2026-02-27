-- Sanklap Event Platform - Database Schema
-- Copy and paste all of this into Supabase SQL Editor and run

-- ============================================
-- CREATE TABLES (safe to re-run)
-- ============================================

CREATE TABLE IF NOT EXISTS sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  situation TEXT NOT NULL,
  "constraint" TEXT NOT NULL,
  password TEXT NOT NULL,                -- used for Round 1
  password_round3 TEXT,                  -- optional separate password for Round 3
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- if file is rerun on an existing database ensure new columns exist
ALTER TABLE sectors ADD COLUMN IF NOT EXISTS password_round3 TEXT;

CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT UNIQUE NOT NULL,
  current_round INTEGER DEFAULT 1,
  round1_company TEXT,
  round2_image_link TEXT,
  round3_allocations JSONB,
  round3_sector UUID,
  round3_choice TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CREATE INDEXES (for better performance)
-- ============================================
-- wrap the index creation in a DO block so rerunning the file doesn't
-- fail when the index already exists (Supabase will stop at the first error).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'idx_team_sessions_team_name'
  ) THEN
    CREATE INDEX idx_team_sessions_team_name ON team_sessions(team_name);
  END IF;


  IF NOT EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'idx_submissions_team_name'
  ) THEN
    CREATE INDEX idx_submissions_team_name ON submissions(team_name);
  END IF;


  IF NOT EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'idx_submissions_round'
  ) THEN
    CREATE INDEX idx_submissions_round ON submissions(round);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'idx_submissions_created'
  ) THEN
    CREATE INDEX idx_submissions_created ON submissions(created_at);
  END IF;
END$$;

-- ============================================
-- EXAMPLE DATA (optional - for testing)
-- ============================================

-- Sample sectors
INSERT INTO sectors (name, situation, "constraint", password, password_round3) VALUES
('Healthcare', 'Your startup develops AI-powered diagnosis tools. You need to enter the Indian market where regulations are complex and trust is paramount.', 'Budget: $500K, Timeline: 6 months, Limited team resources', 'health123', 'health123'),
('Finance', 'You built a fintech platform for microfinance. How will you compete with established players and gain customer trust?', 'Budget: $1M, Timeline: 9 months, Compliance challenges', 'finance456', 'finance456'),
('E-Commerce', 'Your marketplace connects local artisans with global buyers. Scale your platform while maintaining quality.', 'Budget: $300K, Timeline: 6 months, Logistics complexity', 'ecomm789', 'ecomm789'),
('EdTech', 'You created an online learning platform. How will you acquire students in a saturated market?', 'Budget: $800K, Timeline: 12 months, Quality assurance required', 'edtech101', 'edtech101'),
('Energy', 'Your renewable energy startup wants to maximize impact. How will you scale operations sustainably?', 'Budget: $2M, Timeline: 18 months, Infrastructure needs', 'energy202', 'energy202'),
('AgriTech', 'You developed precision farming tools. How will you reach and convince rural farmers?', 'Budget: $400K, Timeline: 8 months, Infrastructure barriers', 'agri303', 'agri303'),
('Logistics', 'Your last-mile delivery platform disrupts traditional supply chains. Win the market.', 'Budget: $1.5M, Timeline: 12 months, Competition intense', 'logistics404', 'logistics404'),
('IoT', 'You built smart home devices. Enter the market and scale manufacturingcapabilities.', 'Budget: $1.2M, Timeline: 10 months, Supply chain risks', 'iot505', 'iot505'),
('SaaS', 'Your B2B SaaS tool improves workplace productivity. Acquire enterprise customers in a competitive landscape.', 'Budget: $900K, Timeline: 12 months, Sales cycle long', 'saas606', 'saas606'),
('Mobility', 'Your EV charging network solution addresses range anxiety. Scale infrastructure rapidly.', 'Budget: $3M, Timeline: 24 months, Capital intensive', 'mobility707', 'mobility707');

-- Sample channels for Round 3 (insert only if table empty)
INSERT INTO channels (name)
SELECT x FROM (VALUES
('Social Media'),
('Email Marketing'),
('Content Marketing'),
('Partnerships'),
('Paid Advertising')
) AS t(x)
WHERE NOT EXISTS (SELECT 1 FROM channels);

-- ============================================
-- Additional table for market events (idempotent)
-- ============================================

-- ============================================
-- Additional table for market events (idempotent)
-- ============================================

CREATE TABLE IF NOT EXISTS market_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  choice TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  impact TEXT NOT NULL CHECK (impact IN ('positive','negative','neutral')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure market events reference sectors (one A/B/C event per sector)
ALTER TABLE market_events ADD COLUMN IF NOT EXISTS sector_id UUID REFERENCES sectors(id) ON DELETE CASCADE;

-- Insert A, B, C market events for each sector
INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'A' as choice, 'Regulatory Approval Breakthrough', 'Your aggressive approach to regulatory compliance paid off. Indian health authorities fast-tracked your certification, giving you first-mover advantage.', 'positive'
FROM sectors s WHERE s.name = 'Healthcare'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'B' as choice, 'Gradual Market Adoption', 'Your conservative, trusted approach resonated with healthcare providers. You achieved steady inroads with 15% market penetration.', 'positive'
FROM sectors s WHERE s.name = 'Healthcare'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'C' as choice, 'Partnership Expansion Delayed', 'Your partnership strategy faced unexpected roadblocks. Negotiations stalled, delaying market entry by 4 months.', 'negative'
FROM sectors s WHERE s.name = 'Healthcare'
ON CONFLICT DO NOTHING;

-- Finance Sector
INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'A' as choice, 'Digital Revolution Secured', 'Your aggressive growth strategy disrupted traditional finance. Downloaded by 100K users in 3 months.', 'positive'
FROM sectors s WHERE s.name = 'Finance'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'B' as choice, 'Trust Building Success', 'By focusing on compliance and security, you won over cautious customers. 8% market share in first year.', 'positive'
FROM sectors s WHERE s.name = 'Finance'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'C' as choice, 'RBI Compliance Issue', 'Your partnership strategy revealed regulatory gaps. RBI imposed temporary restrictions on your platform.', 'negative'
FROM sectors s WHERE s.name = 'Finance'
ON CONFLICT DO NOTHING;

-- E-Commerce Sector
INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'A' as choice, 'Scale Success Achieved', 'Your aggressive expansion led to 50K artisans on platform. Revenue exceeded projections by 40%.', 'positive'
FROM sectors s WHERE s.name = 'E-Commerce'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'B' as choice, 'Quality Consistency Praised', 'Your focus on quality control earned premium customer loyalty. NPS score of 72, highest in category.', 'positive'
FROM sectors s WHERE s.name = 'E-Commerce'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'C' as choice, 'Logistics Partnership Collapses', 'Your primary logistics partner defaulted, affecting 20% of orders. Customer satisfaction dropped 25%.', 'negative'
FROM sectors s WHERE s.name = 'E-Commerce'
ON CONFLICT DO NOTHING;

-- EdTech Sector
INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'A' as choice, 'Market Dominance', 'Your aggressive marketing captured 12% of online learning market. Competitors lost share to your platform.', 'positive'
FROM sectors s WHERE s.name = 'EdTech'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'B' as choice, 'Quality Excellence Recognition', 'Your rigorous QA process earned government recognition. Eligible for education ministry grants.', 'positive'
FROM sectors s WHERE s.name = 'EdTech'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'C' as choice, 'Content Provider Disputes', 'Partnership tensions with content creators led to 30% reduction in course offerings.', 'negative'
FROM sectors s WHERE s.name = 'EdTech'
ON CONFLICT DO NOTHING;

-- Energy Sector
INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'A' as choice, 'Green Energy Boom', 'Your aggressive infrastructure build-out positioned you as energy sector leader. 50MWh capacity installed.', 'positive'
FROM sectors s WHERE s.name = 'Energy'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'B' as choice, 'Sustainable Growth Validated', 'Conservative approach earned government validation. Awarded multi-year Solar Power contracts.', 'positive'
FROM sectors s WHERE s.name = 'Energy'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'C' as choice, 'Supply Chain Disruption', 'Partner sourcing issues delayed equipment delivery. Project timelines slipped 6 months.', 'negative'
FROM sectors s WHERE s.name = 'Energy'
ON CONFLICT DO NOTHING;

-- AgriTech Sector
INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'A' as choice, 'Farmer Adoption Surge', 'Your aggressive outreach reached 5000 farmers. Yield improvements averaged 22%.', 'positive'
FROM sectors s WHERE s.name = 'AgriTech'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'B' as choice, 'Trust & Credibility Built', 'Slow, methodical approach earned farmer trust. Long-term contracts secured with 500+ farmers.', 'positive'
FROM sectors s WHERE s.name = 'AgriTech'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'C' as choice, 'Infrastructure Partnership Failed', 'Key irrigation partner withdrew support. Rural distribution network collapsed temporarily.', 'negative'
FROM sectors s WHERE s.name = 'AgriTech'
ON CONFLICT DO NOTHING;

-- Logistics Sector
INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'A' as choice, 'Market Share Capture', 'Your aggressive pricing and service quality won 18% of last-mile market. Revenue ₹50Cr annually.', 'positive'
FROM sectors s WHERE s.name = 'Logistics'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'B' as choice, 'Customer Lifetime Value Optimized', 'Your focus on service quality and operations efficiency reduced costs by 20%. Margins improved.', 'positive'
FROM sectors s WHERE s.name = 'Logistics'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'C' as choice, 'Fleet Partner Bankruptcy', 'Your outsourced fleet partner faced financial crisis. Operational disruptions affected 35% of deliveries.', 'negative'
FROM sectors s WHERE s.name = 'Logistics'
ON CONFLICT DO NOTHING;

-- IoT Sector
INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'A' as choice, 'Smart Home Revolution', 'Your aggressive manufacturing scaling produced 100K units. Smart homes adoption reached 8% of market.', 'positive'
FROM sectors s WHERE s.name = 'IoT'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'B' as choice, 'Premium Quality Brand Built', 'Your quality-first approach earned luxury segment acclaim. 40% margin achieved vs 15% competitors.', 'positive'
FROM sectors s WHERE s.name = 'IoT'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'C' as choice, 'Supply Chain Crisis', 'Critical semiconductor supplier had production issues. Manufacturing capacity reduced by 60% for 2 quarters.', 'negative'
FROM sectors s WHERE s.name = 'IoT'
ON CONFLICT DO NOTHING;

-- SaaS Sector
INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'A' as choice, 'Enterprise Deals Accelerated', 'Your aggressive sales strategy won 50 enterprise customers. ARR reached ₹10Cr.', 'positive'
FROM sectors s WHERE s.name = 'SaaS'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'B' as choice, 'Customer Success Excellence', 'Your focus on customer success achieved 95% retention. Net Revenue Retention at 125%.', 'positive'
FROM sectors s WHERE s.name = 'SaaS'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'C' as choice, 'Partners Demand Renegotiation', 'Channel partner disputes over margins caused 25% loss of distribution revenue.', 'negative'
FROM sectors s WHERE s.name = 'SaaS'
ON CONFLICT DO NOTHING;

-- Mobility Sector
INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'A' as choice, 'EV Infrastructure Boom', 'Your aggressive expansion installed 500 charging stations across 10 cities. Market leader status achieved.', 'positive'
FROM sectors s WHERE s.name = 'Mobility'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'B' as choice, 'Profitable Operations Achieved', 'Your focus on optimal site selection and operational efficiency achieved positive unit economics.', 'positive'
FROM sectors s WHERE s.name = 'Mobility'
ON CONFLICT DO NOTHING;

INSERT INTO market_events (sector_id, choice, title, description, impact)
SELECT s.id, 'C' as choice, 'City Authority Conflicts', 'Land acquisition disputes with municipal authorities delayed expansion in 5 cities.', 'negative'
FROM sectors s WHERE s.name = 'Mobility'
ON CONFLICT DO NOTHING;


-- ============================================
-- NOTES
-- ============================================
-- 1. If you don't want sample data, you can delete the INSERT statements above
-- 2. Change passwords for each sector (in the INSERT statement) to your preferences
-- 3. You can always add/remove sectors and channels later from the admin panel
-- 4. Team sessions and submissions are created automatically as teams participate
