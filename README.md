# Debtrix - Personal Debt Management Application

Debtrix is a modern web application built with Next.js that helps users manage and track their debts, create personalized debt payoff strategies, and learn about financial management.

## Features

- 📊 Interactive Dashboard
- 💰 Debt Management & Tracking
- 📈 Progress Visualization
- 🎯 Personalized Debt Payoff Strategies
- 📚 Educational Resources
- 💬 AI-Powered Financial Chat Assistant
- 🔒 Secure Authentication

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase (Backend & Authentication)
- Perplexity AI (Chat Integration)

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
Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PERPLEXITY_API_KEY=your_perplexity_api_key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # Reusable UI components
├── lib/             # Utility functions and configurations
└── types/           # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
