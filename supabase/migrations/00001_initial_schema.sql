-- Campus Hustle PostgreSQL Initial Database Schema
-- Restricts commerce strictly to Pondicherry University authenticated users

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Campuses
CREATE TABLE IF NOT EXISTS campuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pilot')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Approved Email Domains
CREATE TABLE IF NOT EXISTS approved_email_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  domain TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Academic Hierarchy: Schools
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(campus_id, slug)
);

-- 4. Academic Hierarchy: Departments
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(school_id, slug)
);

-- 5. Academic Hierarchy: Programmes
CREATE TABLE IF NOT EXISTS programmes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('UG', 'PG', 'Integrated', 'M.Phil', 'Ph.D', 'Diploma')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  campus_id UUID NOT NULL REFERENCES campuses(id),
  display_name TEXT NOT NULL CHECK (char_length(trim(display_name)) >= 2),
  username TEXT UNIQUE CHECK (username IS NULL OR (char_length(username) >= 3 AND username ~ '^[a-zA-Z0-9_]+$')),
  avatar_path TEXT,
  bio TEXT CHECK (bio IS NULL OR char_length(bio) <= 500),
  school_id UUID REFERENCES schools(id),
  department_id UUID REFERENCES departments(id),
  programme_id UUID REFERENCES programmes(id),
  year_of_study INT CHECK (year_of_study IS NULL OR (year_of_study >= 1 AND year_of_study <= 6)),
  expected_graduation_year INT CHECK (expected_graduation_year IS NULL OR expected_graduation_year >= 2024),
  verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deactivated')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. User Roles (RBAC)
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student_user', 'moderator', 'campus_admin', 'platform_admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, role)
);

-- 8. Buyer Profiles
CREATE TABLE IF NOT EXISTS buyer_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_categories JSONB DEFAULT '[]'::jsonb,
  preferred_pickup_zones JSONB DEFAULT '[]'::jsonb,
  notification_preferences JSONB DEFAULT '{"email": true, "push": true}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Seller Profiles
CREATE TABLE IF NOT EXISTS seller_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  shop_name TEXT NOT NULL CHECK (char_length(trim(shop_name)) >= 2),
  seller_type TEXT NOT NULL DEFAULT 'individual' CHECK (seller_type IN ('individual', 'student_business', 'club_organization')),
  description TEXT,
  logo_path TEXT,
  response_time TEXT DEFAULT 'within_few_hours',
  pickup_preferences TEXT,
  seller_status TEXT NOT NULL DEFAULT 'active' CHECK (seller_status IN ('active', 'paused', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Service Provider Profiles
CREATE TABLE IF NOT EXISTS service_provider_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  provider_name TEXT NOT NULL CHECK (char_length(trim(provider_name)) >= 2),
  description TEXT NOT NULL,
  primary_category_id UUID,
  pricing_model TEXT NOT NULL DEFAULT 'fixed' CHECK (pricing_model IN ('fixed', 'hourly', 'custom', 'contact_for_price')),
  availability TEXT,
  service_mode TEXT NOT NULL DEFAULT 'in_person' CHECK (service_mode IN ('in_person', 'online', 'hybrid')),
  service_zone TEXT,
  provider_status TEXT NOT NULL DEFAULT 'active' CHECK (provider_status IN ('active', 'paused', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  is_prohibited BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Pickup Zones (Safe Meetup Zones)
CREATE TABLE IF NOT EXISTS pickup_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_safe_zone BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(campus_id, name)
);

-- 13. Listings
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campus_id UUID NOT NULL REFERENCES campuses(id),
  listing_type TEXT NOT NULL CHECK (listing_type IN ('item', 'service', 'rental')),
  category_id UUID NOT NULL REFERENCES categories(id),
  title TEXT NOT NULL CHECK (char_length(trim(title)) >= 3 AND char_length(title) <= 120),
  description TEXT NOT NULL CHECK (char_length(trim(description)) >= 10),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  pricing_model TEXT DEFAULT 'fixed' CHECK (pricing_model IN ('fixed', 'negotiable', 'hourly', 'contact_for_price')),
  condition TEXT CHECK (condition IS NULL OR condition IN ('new', 'like_new', 'good', 'fair')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'reserved', 'sold', 'paused', 'expired')),
  pickup_zone_id UUID REFERENCES pickup_zones(id),
  available_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- 14. Listing Images
CREATE TABLE IF NOT EXISTS listing_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  scan_status TEXT NOT NULL DEFAULT 'pending' CHECK (scan_status IN ('pending', 'clean', 'rejected')),
  width INT,
  height INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'blocked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. Conversation Members
CREATE TABLE IF NOT EXISTS conversation_members (
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);

-- 17. Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(trim(body)) >= 1 AND char_length(body) <= 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  moderation_status TEXT NOT NULL DEFAULT 'approved' CHECK (moderation_status IN ('approved', 'flagged', 'removed'))
);

-- 18. Offers
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'countered', 'accepted', 'rejected', 'withdrawn', 'expired', 'cancelled')),
  message TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. Reservations
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  offer_id UUID REFERENCES offers(id),
  pickup_zone_id UUID NOT NULL REFERENCES pickup_zones(id),
  meetup_date DATE NOT NULL,
  meetup_time_window TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  provider_or_seller_id UUID NOT NULL REFERENCES profiles(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('item_sale', 'service_delivery')),
  agreed_price DECIMAL(10, 2) NOT NULL CHECK (agreed_price >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'disputed')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  reviewee_id UUID NOT NULL REFERENCES profiles(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  tags JSONB DEFAULT '[]'::jsonb,
  comment TEXT CHECK (comment IS NULL OR char_length(comment) <= 1000),
  moderation_status TEXT NOT NULL DEFAULT 'approved' CHECK (moderation_status IN ('approved', 'flagged', 'removed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (transaction_id, reviewer_id),
  CONSTRAINT no_self_review CHECK (reviewer_id <> reviewee_id)
);

-- 22. Saved Listings
CREATE TABLE IF NOT EXISTS saved_listings (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, listing_id)
);

-- 23. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 24. Reports
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('listing', 'user', 'message', 'review', 'service')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved', 'dismissed')),
  assigned_to UUID REFERENCES profiles(id),
  resolution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 25. Blocked Users
CREATE TABLE IF NOT EXISTS blocked_users (
  blocker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_id)
);

-- 26. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES for Full-Text Search and High-Performance Access
CREATE INDEX IF NOT EXISTS idx_listings_campus ON listings(campus_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_fts ON listings USING gin (to_tsvector('english', title || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);

-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE approved_email_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Public / Authenticated Read Policies for Academic Metadata & Public Catalog
CREATE POLICY "Public campuses read" ON campuses FOR SELECT USING (true);
CREATE POLICY "Public email domains read" ON approved_email_domains FOR SELECT USING (true);
CREATE POLICY "Public schools read" ON schools FOR SELECT USING (true);
CREATE POLICY "Public departments read" ON departments FOR SELECT USING (true);
CREATE POLICY "Public programmes read" ON programmes FOR SELECT USING (true);
CREATE POLICY "Public categories read" ON categories FOR SELECT USING (true);
CREATE POLICY "Public pickup zones read" ON pickup_zones FOR SELECT USING (true);

-- 2. Profiles RLS
CREATE POLICY "Profiles read policy" ON profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Profiles insert policy" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Profiles update policy" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Role-specific Profiles RLS
CREATE POLICY "Buyer profiles read" ON buyer_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Buyer profiles mutate" ON buyer_profiles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Seller profiles read" ON seller_profiles FOR SELECT USING (true);
CREATE POLICY "Seller profiles mutate" ON seller_profiles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Service provider profiles read" ON service_provider_profiles FOR SELECT USING (true);
CREATE POLICY "Service provider profiles mutate" ON service_provider_profiles FOR ALL USING (auth.uid() = user_id);

-- 4. Listings & Images RLS
CREATE POLICY "Listings select policy" ON listings FOR SELECT USING (status = 'active' OR auth.uid() = owner_id);
CREATE POLICY "Listings insert policy" ON listings FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Listings update policy" ON listings FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Listings delete policy" ON listings FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Listing images select policy" ON listing_images FOR SELECT USING (true);
CREATE POLICY "Listing images mutate policy" ON listing_images FOR ALL USING (
  EXISTS (SELECT 1 FROM listings WHERE listings.id = listing_images.listing_id AND listings.owner_id = auth.uid())
);

-- 5. Conversations & Messages RLS
CREATE POLICY "Conversations select policy" ON conversations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversation_members
    WHERE conversation_members.conversation_id = conversations.id
    AND conversation_members.user_id = auth.uid()
  )
);

CREATE POLICY "Conversation members select policy" ON conversation_members FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM conversation_members cm
    WHERE cm.conversation_id = conversation_members.conversation_id
    AND cm.user_id = auth.uid()
  )
);

CREATE POLICY "Messages select policy" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversation_members
    WHERE conversation_members.conversation_id = messages.conversation_id
    AND conversation_members.user_id = auth.uid()
  )
);

CREATE POLICY "Messages insert policy" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM conversation_members
    WHERE conversation_members.conversation_id = messages.conversation_id
    AND conversation_members.user_id = auth.uid()
  )
);

-- 6. Offers & Reservations & Transactions RLS
CREATE POLICY "Offers select policy" ON offers FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Offers insert policy" ON offers FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Offers update policy" ON offers FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Reservations select policy" ON reservations FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Reservations mutate policy" ON reservations FOR ALL USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Transactions select policy" ON transactions FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = provider_or_seller_id);

-- 7. Reviews, Saved Listings, Notifications, Reports, Blocked Users, Audit Logs RLS
CREATE POLICY "Reviews select policy" ON reviews FOR SELECT USING (moderation_status = 'approved' OR reviewer_id = auth.uid() OR reviewee_id = auth.uid());
CREATE POLICY "Reviews insert policy" ON reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Saved listings policy" ON saved_listings FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Notifications policy" ON notifications FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Blocked users policy" ON blocked_users FOR ALL USING (blocker_id = auth.uid());

CREATE POLICY "Reports insert policy" ON reports FOR INSERT WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "Reports select policy" ON reports FOR SELECT USING (
  reporter_id = auth.uid() OR EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('moderator', 'campus_admin', 'platform_admin')
  )
);

CREATE POLICY "Audit logs select policy" ON audit_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('moderator', 'campus_admin', 'platform_admin')
  )
);
