-- Debtrix Database Setup Script
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security (RLS)
ALTER DATABASE postgres SET row_security = on;

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create debts table
CREATE TABLE IF NOT EXISTS public.debts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    balance DECIMAL(12,2) NOT NULL CHECK (balance >= 0),
    minimum_payment DECIMAL(10,2) NOT NULL CHECK (minimum_payment >= 0),
    interest_rate DECIMAL(5,2) NOT NULL CHECK (interest_rate >= 0),
    due_date DATE,
    debt_type TEXT CHECK (debt_type IN ('credit_card', 'loan', 'mortgage', 'other')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create debt_assessment table
CREATE TABLE IF NOT EXISTS public.debt_assessment (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    monthly_income DECIMAL(12,2) NOT NULL CHECK (monthly_income >= 0),
    monthly_expenses DECIMAL(12,2) NOT NULL CHECK (monthly_expenses >= 0),
    available_for_debt DECIMAL(12,2) NOT NULL CHECK (available_for_debt >= 0),
    preferred_strategy TEXT CHECK (preferred_strategy IN ('snowball', 'avalanche', 'custom')),
    risk_tolerance TEXT CHECK (risk_tolerance IN ('low', 'medium', 'high')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create progress_tracking table
CREATE TABLE IF NOT EXISTS public.progress_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    debt_id UUID REFERENCES public.debts(id) ON DELETE CASCADE,
    payment_amount DECIMAL(10,2) NOT NULL CHECK (payment_amount >= 0),
    payment_date DATE NOT NULL,
    balance_after DECIMAL(12,2) NOT NULL CHECK (balance_after >= 0),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat_history table
CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_id TEXT,
    message_type TEXT NOT NULL CHECK (message_type IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author TEXT,
    category TEXT CHECK (category IN ('debt_elimination', 'budgeting', 'credit_improvement', 'financial_planning')),
    tags TEXT[],
    featured_image TEXT,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies

-- Users can only see their own data
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Debts policies
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own debts" ON public.debts
    FOR ALL USING (auth.uid() = user_id);

-- Assessment policies
ALTER TABLE public.debt_assessment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own assessment" ON public.debt_assessment
    FOR ALL USING (auth.uid() = user_id);

-- Progress tracking policies
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own progress" ON public.progress_tracking
    FOR ALL USING (auth.uid() = user_id);

-- Chat history policies
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own chat history" ON public.chat_history
    FOR ALL USING (auth.uid() = user_id);

-- Blog posts are public for reading
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published blog posts" ON public.blog_posts
    FOR SELECT USING (published = true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_debts_user_id ON public.debts(user_id);
CREATE INDEX IF NOT EXISTS idx_debts_created_at ON public.debts(created_at);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.progress_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_debt_id ON public.progress_tracking(debt_id);
CREATE INDEX IF NOT EXISTS idx_chat_user_id ON public.chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_session_id ON public.chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_category ON public.blog_posts(category);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_debts_updated_at BEFORE UPDATE ON public.debts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_updated_at BEFORE UPDATE ON public.debt_assessment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 