-- Makana v0 Foundation - Initial Database Schema
-- This migration creates all tables, indexes, and Row-Level Security policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USER PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- RLS Policies for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);


-- ============================================================================
-- SETUPS TABLE (Preset Configurations)
-- ============================================================================
CREATE TABLE IF NOT EXISTS setups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    default_session_duration INTEGER NOT NULL, -- minutes
    emphasis TEXT NOT NULL, -- "rest", "continuity", "health"
    is_preset BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for name lookups
CREATE INDEX idx_setups_name ON setups(name);

-- RLS Policies for setups (read-only for all authenticated users)
ALTER TABLE setups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view setups"
    ON setups FOR SELECT
    TO authenticated
    USING (true);


-- ============================================================================
-- USER SETUPS TABLE (Active Configuration per User)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_setups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    setup_id UUID NOT NULL REFERENCES setups(id) ON DELETE CASCADE,
    activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for user lookups (most recent first)
CREATE INDEX idx_user_setups_user_activated ON user_setups(user_id, activated_at DESC);

-- RLS Policies for user_setups
ALTER TABLE user_setups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own setups"
    ON user_setups FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own setups"
    ON user_setups FOR INSERT
    WITH CHECK (auth.uid() = user_id);


-- ============================================================================
-- DAILY CHECKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS daily_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    check_date DATE NOT NULL,
    responses JSONB NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Unique constraint: one check per day per user
    CONSTRAINT unique_daily_check_per_user_per_day UNIQUE (user_id, check_date)
);

-- Index for user and date lookups
CREATE INDEX idx_daily_checks_user_date ON daily_checks(user_id, check_date DESC);

-- RLS Policies for daily_checks
ALTER TABLE daily_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own daily checks"
    ON daily_checks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily checks"
    ON daily_checks FOR INSERT
    WITH CHECK (auth.uid() = user_id);


-- ============================================================================
-- SESSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    setup_id UUID NOT NULL REFERENCES setups(id) ON DELETE RESTRICT,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    next_step TEXT,
    status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'abandoned')),
    reduced_mode_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for user and status lookups
CREATE INDEX idx_sessions_user_status ON sessions(user_id, status);

-- Index for user and created_at lookups (recent sessions)
CREATE INDEX idx_sessions_user_created ON sessions(user_id, created_at DESC);

-- RLS Policies for sessions
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions"
    ON sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
    ON sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
    ON sessions FOR UPDATE
    USING (auth.uid() = user_id);


-- ============================================================================
-- WEEKLY CHECKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS weekly_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    responses JSONB NOT NULL,
    insight TEXT,
    scope_recommendation TEXT,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for user and week lookups
CREATE INDEX idx_weekly_checks_user_week ON weekly_checks(user_id, week_start_date DESC);

-- RLS Policies for weekly_checks
ALTER TABLE weekly_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own weekly checks"
    ON weekly_checks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly checks"
    ON weekly_checks FOR INSERT
    WITH CHECK (auth.uid() = user_id);


-- ============================================================================
-- REDUCED MODE STATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS reduced_mode_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT false,
    activated_at TIMESTAMPTZ,
    deactivated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for user lookups
CREATE INDEX idx_reduced_mode_user ON reduced_mode_states(user_id);

-- RLS Policies for reduced_mode_states
ALTER TABLE reduced_mode_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reduced mode state"
    ON reduced_mode_states FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reduced mode state"
    ON reduced_mode_states FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reduced mode state"
    ON reduced_mode_states FOR UPDATE
    USING (auth.uid() = user_id);


-- ============================================================================
-- SEED DATA: Preset Setups
-- ============================================================================
INSERT INTO setups (id, name, description, default_session_duration, emphasis, is_preset)
VALUES
    (
        '00000000-0000-0000-0000-000000000001',
        'Calm',
        'Default 25 minutes, emphasis on rest. For balanced practice.',
        25,
        'rest',
        true
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'Reduced',
        'Default 15 minutes, emphasis on continuity. For low-capacity periods.',
        15,
        'continuity',
        true
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'Vitality',
        'Default 30 minutes, emphasis on health. For energy-focused practice.',
        30,
        'health',
        true
    )
ON CONFLICT (name) DO NOTHING;


-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for sessions
CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for reduced_mode_states
CREATE TRIGGER update_reduced_mode_states_updated_at
    BEFORE UPDATE ON reduced_mode_states
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ============================================================================
-- VERIFICATION QUERIES (for testing)
-- ============================================================================

-- Verify tables exist
DO $$
BEGIN
    ASSERT (SELECT COUNT(*) FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN (
                'user_profiles', 'setups', 'user_setups', 
                'daily_checks', 'sessions', 'weekly_checks', 
                'reduced_mode_states'
            )) = 7, 'Not all tables were created';
    
    RAISE NOTICE 'All tables created successfully';
END $$;

-- Verify preset setups exist
DO $$
BEGIN
    ASSERT (SELECT COUNT(*) FROM setups WHERE is_preset = true) = 3, 
           'Preset setups not seeded correctly';
    
    RAISE NOTICE 'Preset setups seeded successfully';
END $$;

-- Verify RLS is enabled
DO $$
BEGIN
    ASSERT (SELECT COUNT(*) FROM pg_tables 
            WHERE schemaname = 'public' 
            AND rowsecurity = true) = 7, 
           'RLS not enabled on all tables';
    
    RAISE NOTICE 'RLS enabled on all tables';
END $$;

RAISE NOTICE 'Migration 001_initial_schema.sql completed successfully';
