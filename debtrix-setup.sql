-- =====================================================
-- DEBTRIX COMPLETE DATABASE SETUP
-- Run this ONCE in Supabase SQL Editor
-- This will create everything from scratch
-- =====================================================

-- Clean up any existing tables/policies (start fresh)
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.chat_history CASCADE;
DROP TABLE IF EXISTS public.progress_tracking CASCADE;
DROP TABLE IF EXISTS public.debt_assessment CASCADE;
DROP TABLE IF EXISTS public.debts CASCADE;

-- =====================================================
-- 1. CREATE MAIN TABLES
-- =====================================================

-- Debts table (main table for debt tracking)
CREATE TABLE public.debts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    debt_name TEXT NOT NULL,
    debt_type TEXT NOT NULL CHECK (debt_type IN ('credit_card', 'student_loan', 'personal', 'mortgage', 'auto_loan')),
    current_balance DECIMAL(12,2) NOT NULL CHECK (current_balance >= 0),
    original_balance DECIMAL(12,2) NOT NULL CHECK (original_balance >= 0),
    interest_rate DECIMAL(5,2) NOT NULL CHECK (interest_rate >= 0),
    minimum_payment DECIMAL(8,2) NOT NULL CHECK (minimum_payment >= 0),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment table (user's financial assessment)
CREATE TABLE public.debt_assessment (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    stress_level INTEGER NOT NULL CHECK (stress_level BETWEEN 1 AND 10),
    financial_knowledge TEXT NOT NULL CHECK (financial_knowledge IN ('beginner', 'intermediate', 'advanced')),
    monthly_income DECIMAL(10,2),
    monthly_expenses DECIMAL(10,2),
    emergency_fund DECIMAL(10,2),
    debt_consolidation_interest BOOLEAN DEFAULT FALSE,
    extra_payment_capacity DECIMAL(8,2) DEFAULT 0,
    primary_goal TEXT NOT NULL CHECK (primary_goal IN ('minimize_interest', 'psychological_wins', 'fastest_payoff', 'balanced_approach')),
    risk_tolerance TEXT NOT NULL CHECK (risk_tolerance IN ('low', 'medium', 'high')),
    recommended_method TEXT NOT NULL CHECK (recommended_method IN ('snowball', 'avalanche', 'hybrid')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progress tracking table (payment history)
CREATE TABLE public.progress_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    debt_id UUID REFERENCES public.debts(id) ON DELETE CASCADE NOT NULL,
    payment_amount DECIMAL(8,2) NOT NULL CHECK (payment_amount > 0),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_type TEXT NOT NULL DEFAULT 'regular' CHECK (payment_type IN ('regular', 'extra', 'minimum')),
    balance_after_payment DECIMAL(12,2) NOT NULL CHECK (balance_after_payment >= 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat history table (AI coach conversations)
CREATE TABLE public.chat_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_id UUID DEFAULT gen_random_uuid(),
    message_type TEXT NOT NULL CHECK (message_type IN ('user', 'assistant')),
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table (educational content)
CREATE TABLE public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    category TEXT NOT NULL CHECK (category IN ('debt_basics', 'strategies', 'psychology', 'tools', 'success_stories')),
    featured_image_url TEXT,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debt_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. CREATE SECURITY POLICIES
-- =====================================================

-- Debts policies
CREATE POLICY "Users can manage their own debts" ON public.debts 
FOR ALL USING (auth.uid() = user_id);

-- Allow demo users for testing (converts UUID to text for comparison)
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
CREATE INDEX idx_debt_assessment_user_id ON public.debt_assessment(user_id);
CREATE INDEX idx_progress_tracking_user_id ON public.progress_tracking(user_id);
CREATE INDEX idx_progress_tracking_debt_id ON public.progress_tracking(debt_id);
CREATE INDEX idx_chat_history_user_id ON public.chat_history(user_id);
CREATE INDEX idx_chat_history_session_id ON public.chat_history(session_id);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published);

-- =====================================================
-- 5. CREATE TRIGGER FUNCTIONS
-- =====================================================

-- Function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables that need updated_at
CREATE TRIGGER set_debts_updated_at
    BEFORE UPDATE ON public.debts
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_debt_assessment_updated_at
    BEFORE UPDATE ON public.debt_assessment
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- 6. INSERT SAMPLE DATA
-- =====================================================

-- Insert sample blog posts for the learning section
INSERT INTO public.blog_posts (title, slug, content, excerpt, category, published) 
VALUES 
(
    'Getting Started with Debt Freedom',
    'getting-started-debt-freedom',
    'Learn the fundamental principles of debt elimination and take your first steps toward financial freedom. This comprehensive guide covers the basics of debt management, budgeting, and creating a sustainable plan for becoming debt-free.',
    'Start your journey to financial freedom with these essential debt elimination strategies.',
    'debt_basics',
    true
),
(
    'Debt Snowball vs Avalanche: Which Method is Right for You?',
    'snowball-vs-avalanche-method',
    'Discover the pros and cons of both popular debt elimination strategies. The snowball method focuses on psychological wins by paying off smallest debts first, while the avalanche method saves money by targeting highest interest rates first.',
    'Compare the two most popular debt elimination strategies to find your perfect fit.',
    'strategies',
    true
),
(
    'The Psychology of Debt: Breaking Mental Barriers',
    'psychology-of-debt',
    'Understanding the emotional and psychological aspects of debt is crucial for long-term success. Learn how to overcome shame, anxiety, and other mental barriers that keep you stuck in the debt cycle.',
    'Learn how to overcome the mental challenges that keep you stuck in debt.',
    'psychology',
    true
),
(
    'Building Your Emergency Fund While Paying Off Debt',
    'emergency-fund-debt-payoff',
    'Balancing emergency savings with debt payoff is one of the most challenging aspects of financial planning. Learn strategies to build a safety net while aggressively tackling your debts.',
    'Smart strategies for building emergency savings while eliminating debt.',
    'tools',
    true
),
(
    'From $50,000 in Debt to Financial Freedom: A Success Story',
    'success-story-50k-debt-freedom',
    'Read how Sarah eliminated $50,000 in credit card and student loan debt in just 3 years using the hybrid method and strategic budgeting techniques.',
    'Inspiring story of overcoming massive debt with determination and smart strategy.',
    'success_stories',
    true
);

-- =====================================================
-- 7. REFRESH SCHEMA CACHE
-- =====================================================

-- Force Supabase to reload the schema cache
NOTIFY pgrst, 'reload schema';

-- =====================================================
-- 8. VERIFICATION
-- =====================================================

-- Verify all tables were created
SELECT 
    'debts' as table_name,
    COUNT(*) as column_count
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'debts'

UNION ALL

SELECT 
    'debt_assessment' as table_name,
    COUNT(*) as column_count
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'debt_assessment'

UNION ALL

SELECT 
    'progress_tracking' as table_name,
    COUNT(*) as column_count
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'progress_tracking'

UNION ALL

SELECT 
    'chat_history' as table_name,
    COUNT(*) as column_count
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'chat_history'

UNION ALL

SELECT 
    'blog_posts' as table_name,
    COUNT(*) as column_count
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'blog_posts';

-- Show policies
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- Final success message
SELECT '🎉 DEBTRIX DATABASE SETUP COMPLETED SUCCESSFULLY! 🎉' as status; 