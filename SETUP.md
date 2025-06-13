# Debtrix Setup Instructions

## Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Perplexity AI Configuration
NEXT_PUBLIC_PERPLEXITY_API_KEY=your_perplexity_sonar_pro_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Run the following SQL to create the database schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create debts table
CREATE TABLE debts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    debt_name TEXT NOT NULL,
    debt_type TEXT NOT NULL CHECK (debt_type IN ('credit_card', 'student_loan', 'personal', 'mortgage', 'auto_loan')),
    current_balance DECIMAL(12,2) NOT NULL CHECK (current_balance >= 0),
    original_balance DECIMAL(12,2) NOT NULL CHECK (original_balance >= 0),
    interest_rate DECIMAL(5,2) NOT NULL CHECK (interest_rate >= 0 AND interest_rate <= 100),
    minimum_payment DECIMAL(10,2) NOT NULL CHECK (minimum_payment >= 0),
    due_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create debt_assessment table
CREATE TABLE debt_assessment (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    stress_level INTEGER NOT NULL CHECK (stress_level >= 1 AND stress_level <= 10),
    extra_payment_capacity DECIMAL(10,2) NOT NULL CHECK (extra_payment_capacity >= 0),
    recommended_method TEXT NOT NULL CHECK (recommended_method IN ('snowball', 'avalanche', 'consolidation', 'hybrid')),
    target_debt_free_date DATE,
    monthly_income DECIMAL(12,2) NOT NULL,
    monthly_expenses DECIMAL(12,2) NOT NULL,
    assessment_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create progress_tracking table
CREATE TABLE progress_tracking (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    debt_id UUID REFERENCES debts(id) ON DELETE CASCADE NOT NULL,
    payment_amount DECIMAL(10,2) NOT NULL CHECK (payment_amount > 0),
    payment_date DATE NOT NULL,
    remaining_balance DECIMAL(12,2) NOT NULL CHECK (remaining_balance >= 0),
    payment_type TEXT NOT NULL CHECK (payment_type IN ('minimum', 'extra', 'lump_sum')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_history table
CREATE TABLE chat_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    chat_session_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    category TEXT NOT NULL CHECK (category IN ('debt_basics', 'strategies', 'psychology', 'success_stories', 'advanced')),
    featured_image_url TEXT,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE debt_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only access their own debts" ON debts
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own assessment" ON debt_assessment
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own progress" ON progress_tracking
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own chat history" ON chat_history
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Blog posts are publicly readable" ON blog_posts
    FOR SELECT USING (published = true);

-- Create indexes for performance
CREATE INDEX idx_debts_user_id ON debts(user_id);
CREATE INDEX idx_progress_user_id ON progress_tracking(user_id);
CREATE INDEX idx_progress_debt_id ON progress_tracking(debt_id);
CREATE INDEX idx_chat_user_session ON chat_history(user_id, chat_session_id);
CREATE INDEX idx_blog_published ON blog_posts(published, created_at);
CREATE INDEX idx_blog_category ON blog_posts(category);
```

## Perplexity AI Setup

1. Sign up for Perplexity AI at [perplexity.ai](https://www.perplexity.ai/)
2. Get your Sonar Pro API key from the dashboard
3. Add the key to your `.env.local` file

## Installation & Development

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to see the application

## Project Structure

```
debtrix/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── ui/          # Shadcn/ui components
│   │   └── ...          # Custom components
│   ├── lib/             # Utility libraries
│   │   ├── supabase.ts  # Database client
│   │   ├── ai-service.ts # AI integration
│   │   └── debt-calculator.ts # Calculation algorithms
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── ...
```

## Key Features

### 🎯 4-Step Debt Assessment

- Psychological stress evaluation (1-10 scale)
- Complete debt inventory with categorization
- Financial capacity analysis
- AI-powered strategy recommendations

### 🤖 AI Financial Coach

- Perplexity Sonar Pro integration
- 200k context window for comprehensive understanding
- Personalized coaching based on user profile
- Educational content integration

### 📊 Advanced Debt Calculations

- Snowball method (smallest balance first)
- Avalanche method (highest interest first)
- Hybrid approach (psychological + mathematical optimization)
- Consolidation analysis

### 📈 Progress Tracking

- Real-time debt reduction visualization
- Achievement system with Matrix-themed badges
- Payment history and projections
- Motivational milestone celebrations

### 🎓 Financial Education

- Age-appropriate content for 13+ demographic
- Interactive learning modules
- Debt psychology and behavioral economics
- Success stories and case studies

## Design System

### Colors

- **Matrix Green**: `#00FF41` - Success states, breakthroughs
- **Trust Blue**: `#2563EB` - Primary actions, reliability
- **Tech Black**: `#0D1117` - Premium backgrounds
- **Clean White**: `#FFFFFF` - Card backgrounds

### Typography

- **Primary Font**: Inter (Google Fonts)
- **Accessibility**: Minimum 4.5:1 contrast ratios
- **Mobile**: 16px minimum body text size

### Components

- **Cards**: Gradient backgrounds with hover animations
- **Buttons**: Trust blue primary, Matrix green for achievements
- **Forms**: Real-time validation with helpful error messages

## Technology Stack

- **Frontend**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Database**: Supabase (PostgreSQL with real-time features)
- **AI**: Perplexity Sonar Pro API
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Deployment

1. Deploy to Vercel (recommended):

```bash
npm run build
vercel --prod
```

2. Set environment variables in Vercel dashboard
3. Update `NEXT_PUBLIC_APP_URL` to your production domain

## Hackonomics 2025 Competition

This project was built for Hackonomics 2025 with the theme "Create an innovative project that would help spread awareness about financial literacy and economics in the community."

### Judge Appeal Strategy

- **Technical Excellence**: Modern Next.js architecture appeals to Apple/Microsoft/Amazon engineers
- **Financial Credibility**: PostgreSQL and professional security for Morgan Stanley judge
- **Data Science**: AI integration and analytics for Starbucks data scientist
- **Educational Impact**: Age-appropriate financial literacy for competition mission

### Unique Differentiators

1. **Psychological Assessment**: First debt platform addressing mental health impact
2. **Matrix Cultural Branding**: Makes finance engaging for younger demographic
3. **AI Personalization**: Context-aware coaching with 200k token window
4. **Gamified Progress**: Achievement system motivating continued engagement

---

🏆 **Escape the Debt Matrix with Debtrix!**
