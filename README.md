# Debtrix - Personal Debt Management Application

Debtrix is a modern web application built with Next.js that helps users manage and track their debts, create personalized debt payoff strategies, and learn about financial management.

## Features

### Core Features
- Interactive Dashboard with real-time debt tracking
- Comprehensive Debt Management & Tracking
- Visual Progress Tracking with charts and analytics
- Personalized Debt Payoff Strategies (Snowball & Avalanche methods)
- Educational Resources and Learning Modules
- AI-Powered Financial Chat Assistant
- Secure Authentication and User Management

### Technical Features
- Real-time data synchronization
- Responsive design for all devices
- Dark/Light mode support
- Offline capability with service workers
- Progressive Web App (PWA) support
- Secure data encryption
- Role-based access control

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Component library
- **Framer Motion** - Animations
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Supabase**
  - PostgreSQL Database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication
  - Storage
  - Edge Functions

### APIs & Services
- **Perplexity AI**
  - Model: sonar-pro
  - Context window: 200k tokens
  - Financial domain expertise
  - Real-time chat capabilities

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Jest** - Unit testing
- **Cypress** - E2E testing
- **GitHub Actions** - CI/CD

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (auth)/           # Authentication pages
│   ├── dashboard/        # Dashboard pages
│   ├── learn/           # Educational content
│   └── chat/            # AI chat interface
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components
│   └── features/        # Feature-specific components
├── lib/                 # Utility functions
│   ├── supabase/       # Supabase client & helpers
│   ├── api/            # API integration
│   └── utils/          # Helper functions
├── types/              # TypeScript definitions
└── styles/            # Global styles
```

## API Integration

### Perplexity AI Integration
```typescript
// Example API route for chat
export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar-pro',
      messages: messages,
    }),
  })
}
```

### Supabase Integration
```typescript
// Example database operations
export async function getUserDebts(userId: string) {
  const { data, error } = await supabase
    .from('debts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Perplexity AI
PERPLEXITY_API_KEY=your_perplexity_api_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/debtrix.git
cd debtrix
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
```

### Debts Table
```sql
CREATE TABLE debts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  interest_rate DECIMAL,
  minimum_payment DECIMAL,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
```

## Security Features

- Row Level Security (RLS) policies for data protection
- JWT-based authentication
- API rate limiting
- Input validation and sanitization
- CORS configuration
- Secure password hashing
- Session management
- Audit logging

## Performance Optimizations

- Server-side rendering (SSR)
- Static site generation (SSG)
- Image optimization
- Code splitting
- Lazy loading
- Caching strategies
- Database indexing
- API response caching

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 