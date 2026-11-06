-- =========================================================================
-- XCircle Platform Database Schema (PostgreSQL / Supabase)
-- Reconnection Architecture: Academic + Employer + Apartment & Local Circles
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 1. ENUMS
-- =========================================================================
DO $$ BEGIN
  CREATE TYPE circle_category_type AS ENUM ('academic', 'employer', 'apartment_local');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_badge_type AS ENUM ('peer_confirmed', 'document_reviewed', 'self_declared', 'document_submitted');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE request_status_type AS ENUM ('pending', 'reviewing', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE member_role_type AS ENUM ('member', 'admin', 'moderator');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =========================================================================
-- 2. USER PROFILES
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone_country_code VARCHAR(8) DEFAULT '+91',
  phone_number VARCHAR(10),
  phone_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  bio TEXT DEFAULT 'Reconnecting with batch friends and alumni on XCircle',
  institution TEXT DEFAULT 'DPS Noida',
  batch TEXT DEFAULT 'Batch 2019',
  academic_year VARCHAR(10) DEFAULT '2019',
  joining_year VARCHAR(10),
  employer TEXT,
  apartment_community TEXT,
  location TEXT DEFAULT 'New Delhi / NCR',
  trust_score INTEGER DEFAULT 88 CHECK (trust_score >= 0 AND trust_score <= 100),
  is_profile_completed BOOLEAN DEFAULT FALSE,
  privacy_setting VARCHAR(24) DEFAULT 'public',
  auth_provider VARCHAR(24) DEFAULT 'password',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone_country_code, phone_number);
CREATE INDEX IF NOT EXISTS idx_profiles_batch ON public.profiles(batch);
CREATE INDEX IF NOT EXISTS idx_profiles_institution ON public.profiles(institution);

-- =========================================================================
-- 3. PHONE VERIFICATION & OTP AUDIT
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.phone_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(10) NOT NULL,
  country_code VARCHAR(8) NOT NULL DEFAULT '+91',
  otp_hash TEXT NOT NULL,
  attempts INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_phone_verif_lookup ON public.phone_verifications(country_code, phone_number, verified);

-- =========================================================================
-- 4. CIRCLES (Academic, Employer, and Apartment & Local)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category circle_category_type NOT NULL,
  type VARCHAR(32) NOT NULL DEFAULT 'school',
  category_tag VARCHAR(32),
  verification_status verification_badge_type DEFAULT 'peer_confirmed',
  description TEXT NOT NULL,
  cover_image TEXT,
  established_year VARCHAR(10),
  batch VARCHAR(64) NOT NULL,
  members_count INTEGER DEFAULT 1,
  reunion_due BOOLEAN DEFAULT FALSE,
  recent_activity TEXT,
  
  -- Employer Circle Specific Attributes
  company_name TEXT,
  company_info TEXT,
  employee_community TEXT,
  department_cohort TEXT,
  workplace_domain TEXT,

  -- Apartment & Local Circle Specific Attributes (Privacy-First)
  locality TEXT,
  city TEXT,
  society_name TEXT,
  community_rules TEXT[],
  privacy_notice TEXT DEFAULT 'Individual apartment numbers are strictly confidential and masked.',

  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_circles_category ON public.circles(category);
CREATE INDEX IF NOT EXISTS idx_circles_name ON public.circles(name);
CREATE INDEX IF NOT EXISTS idx_circles_company ON public.circles(company_name);
CREATE INDEX IF NOT EXISTS idx_circles_locality ON public.circles(locality, city);

-- =========================================================================
-- 5. CIRCLE MEMBERSHIPS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.circle_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role member_role_type DEFAULT 'member',
  batch TEXT,
  verification_status verification_badge_type DEFAULT 'peer_confirmed',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(circle_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_circle_members_circle ON public.circle_members(circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_members_user ON public.circle_members(user_id);

-- =========================================================================
-- 6. JOIN REQUESTS & VERIFICATIONS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  batch TEXT NOT NULL,
  status request_status_type DEFAULT 'pending',
  memory_answers JSONB DEFAULT '[]'::jsonb,
  gesture_verified BOOLEAN DEFAULT FALSE,
  document_url TEXT,
  admin_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_join_requests_circle_status ON public.join_requests(circle_id, status);
CREATE INDEX IF NOT EXISTS idx_join_requests_applicant ON public.join_requests(applicant_id);

-- =========================================================================
-- 7. COMMUNITY POSTS & REACTIONS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  tag VARCHAR(32) DEFAULT 'General',
  likes_count INTEGER DEFAULT 0,
  reactions JSONB DEFAULT '{"heart": 0, "nostalgia": 0, "highFive": 0}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_circle_created ON public.posts(circle_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 8. MEMORY VAULT & REUNIONS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  year VARCHAR(8) NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  event_tag VARCHAR(32) DEFAULT 'Campus Life',
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reunion_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  tagline TEXT,
  milestone_years INTEGER DEFAULT 5,
  location TEXT NOT NULL,
  description TEXT,
  confirmed_date VARCHAR(64),
  rsvps JSONB DEFAULT '{"going": 0, "maybe": 0, "cantGo": 0}'::jsonb,
  organizer TEXT,
  banner_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 9. SSO ORGANIZATIONS DIRECTORY
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.sso_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  protocol VARCHAR(16) DEFAULT 'oidc',
  sso_configured BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reunion_events ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can read profiles; users can update own profile
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Circles: Viewable by everyone; created by authenticated users
CREATE POLICY "Circles are viewable by all users" ON public.circles
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create circles" ON public.circles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Posts: Viewable by members of the circle or public circles
CREATE POLICY "Posts are viewable by all authenticated users" ON public.posts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Circle members can create posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);
