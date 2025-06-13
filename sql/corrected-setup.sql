-- =====================================================
-- DEBTRIX CORRECTED DATABASE SETUP
-- This fixes all schema mismatches and issues
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Clean up any existing tables/policies (start fresh)
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.chat_history CASCADE;
DROP TABLE IF EXISTS public.progress_tracking CASCADE;
DROP TABLE IF EXISTS public.debt_assessment CASCADE;
DROP TABLE IF EXISTS public.debts CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- =====================================================
-- 1. CREATE CORRECTED TABLES (matches TypeScript interfaces)
-- =====================================================

-- Users table (extends auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Debts table (matches TypeScript interface exactly)
CREATE TABLE public.debts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    debt_name TEXT NOT NULL,  -- Matches TypeScript
    debt_type TEXT NOT NULL CHECK (debt_type IN ('credit_card', 'student_loan', 'personal', 'mortgage', 'auto_loan')),
    current_balance DECIMAL(12,2) NOT NULL CHECK (current_balance >= 0),  -- Matches TypeScript
    original_balance DECIMAL(12,2) NOT NULL CHECK (original_balance >= 0),  -- Matches TypeScript
    interest_rate DECIMAL(5,2) NOT NULL CHECK (interest_rate >= 0),
    minimum_payment DECIMAL(10,2) NOT NULL CHECK (minimum_payment >= 0),  -- Fixed precision
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment table (corrected column names)
CREATE TABLE public.debt_assessment (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    stress_level INTEGER NOT NULL CHECK (stress_level BETWEEN 1 AND 10),
    financial_knowledge TEXT NOT NULL CHECK (financial_knowledge IN ('beginner', 'intermediate', 'advanced')),
    monthly_income DECIMAL(12,2) NOT NULL CHECK (monthly_income >= 0),  -- Fixed precision
    monthly_expenses DECIMAL(12,2) NOT NULL CHECK (monthly_expenses >= 0),  -- Fixed precision
    available_for_debt DECIMAL(12,2) NOT NULL CHECK (available_for_debt >= 0),  -- Added missing column
    emergency_fund DECIMAL(12,2),
    debt_consolidation_interest BOOLEAN DEFAULT FALSE,
    extra_payment_capacity DECIMAL(10,2) DEFAULT 0,
    primary_goal TEXT NOT NULL CHECK (primary_goal IN ('minimize_interest', 'psychological_wins', 'fastest_payoff', 'balanced_approach')),
    preferred_strategy TEXT CHECK (preferred_strategy IN ('snowball', 'avalanche', 'custom')),  -- Added missing column
    risk_tolerance TEXT NOT NULL CHECK (risk_tolerance IN ('low', 'medium', 'high')),
    recommended_method TEXT NOT NULL CHECK (recommended_method IN ('snowball', 'avalanche', 'hybrid')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress tracking table (corrected)
CREATE TABLE public.progress_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    debt_id UUID REFERENCES public.debts(id) ON DELETE CASCADE NOT NULL,
    payment_amount DECIMAL(10,2) NOT NULL CHECK (payment_amount > 0),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_type TEXT NOT NULL DEFAULT 'regular' CHECK (payment_type IN ('regular', 'extra', 'minimum')),
    balance_after DECIMAL(12,2) NOT NULL CHECK (balance_after >= 0),  -- Matches TypeScript
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat history table (corrected)
CREATE TABLE public.chat_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_id TEXT,  -- Simplified from UUID
    message_type TEXT NOT NULL CHECK (message_type IN ('user', 'assistant')),
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table (corrected)
CREATE TABLE public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author TEXT,  -- Added missing column
    category TEXT NOT NULL CHECK (category IN ('debt_elimination', 'budgeting', 'credit_improvement', 'financial_planning')),  -- Fixed categories
    tags TEXT[],  -- Added missing column
    featured_image TEXT,  -- Matches TypeScript (not featured_image_url)
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debt_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. CREATE SECURITY POLICIES
-- =====================================================

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Debts policies
CREATE POLICY "Users can manage their own debts" ON public.debts 
    FOR ALL USING (auth.uid() = user_id);

-- Allow demo users for testing
CREATE POLICY "Allow demo users for debts" ON public.debts 
    FOR ALL USING (user_id::text LIKE 'demo-%');

-- Assessment policies
CREATE POLICY "Users can manage their own assessment" ON public.debt_assessment 
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Allow demo users for assessment" ON public.debt_assessment 
    FOR ALL USING (user_id::text LIKE 'demo-%');

-- Progress tracking policies
CREATE POLICY "Users can manage their own progress" ON public.progress_tracking 
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Allow demo users for progress" ON public.progress_tracking 
    FOR ALL USING (user_id::text LIKE 'demo-%');

-- Chat history policies
CREATE POLICY "Users can manage their own chat history" ON public.chat_history 
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Allow demo users for chat" ON public.chat_history 
    FOR ALL USING (user_id::text LIKE 'demo-%');

-- Blog posts policies (public read access)
CREATE POLICY "Anyone can read published blog posts" ON public.blog_posts 
    FOR SELECT USING (published = true);

-- =====================================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_debts_user_id ON public.debts(user_id);
CREATE INDEX idx_debts_created_at ON public.debts(created_at);
CREATE INDEX idx_debt_assessment_user_id ON public.debt_assessment(user_id);
CREATE INDEX idx_progress_tracking_user_id ON public.progress_tracking(user_id);
CREATE INDEX idx_progress_tracking_debt_id ON public.progress_tracking(debt_id);
CREATE INDEX idx_chat_history_user_id ON public.chat_history(user_id);
CREATE INDEX idx_chat_history_session_id ON public.chat_history(session_id);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);

-- =====================================================
-- 5. CREATE TRIGGER FUNCTIONS
-- =====================================================

-- Function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables that need updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_debts_updated_at
    BEFORE UPDATE ON public.debts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_debt_assessment_updated_at
    BEFORE UPDATE ON public.debt_assessment
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 6. INSERT SAMPLE DATA
-- =====================================================

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, content, excerpt, category, published, author) 
VALUES 
(
    'Getting Started with Debt Freedom',
    'getting-started-debt-freedom',
    'Learn the fundamental principles of debt elimination and take your first steps toward financial freedom. This comprehensive guide covers the basics of debt management, budgeting, and creating a sustainable plan for becoming debt-free.',
    'Start your journey to financial freedom with these essential debt elimination strategies.',
    'debt_elimination',
    true,
    'Debtrix Team'
),
(
    'Debt Snowball vs Avalanche: Which Method is Right for You?',
    'snowball-vs-avalanche-method',
    'Discover the pros and cons of both popular debt elimination strategies. The snowball method focuses on psychological wins by paying off smallest debts first, while the avalanche method saves money by targeting highest interest rates first.',
    'Compare the two most popular debt elimination strategies to find your perfect fit.',
    'debt_elimination',
    true,
    'Debtrix Team'
);

-- Success message
SELECT 'Debtrix database setup completed successfully! All tables created with correct schema.' as status; 