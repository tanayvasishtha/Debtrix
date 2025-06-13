'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Clock, User, BookOpen, Target, Calculator, TrendingUp, DollarSign, Brain } from 'lucide-react'
import { useState } from 'react'

interface BlogPost {
    id: string
    title: string
    excerpt: string
    content: string
    category: string
    readTime: number
    author: string
    publishDate: string
    tags: string[]
    featured: boolean
}

const blogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'Debt Snowball vs Avalanche: Which Method Works Best?',
        excerpt: 'Compare the two most popular debt elimination strategies and learn which one matches your personality and financial goals.',
        content: `When it comes to paying off debt, two strategies dominate the conversation: the debt snowball and debt avalanche methods. Both are proven approaches, but they work very differently.

**Debt Snowball Method:**
- Pay minimum payments on all debts
- Put all extra money toward the smallest balance
- Once smallest debt is paid off, move to the next smallest
- Builds momentum through quick psychological wins

**Debt Avalanche Method:**
- Pay minimum payments on all debts  
- Put all extra money toward highest interest rate debt
- Mathematically optimal - saves the most money
- Requires more discipline and patience

**Which Should You Choose?**
Choose Snowball if you:
- Need motivation and quick wins
- Have high stress about debt
- Struggle with consistency
- Have several small debts

Choose Avalanche if you:
- Are disciplined and patient
- Want to minimize total interest paid
- Have large interest rate differences
- Are motivated by math over emotions

The best method is the one you'll actually stick with. Both will get you debt-free!`,
        category: 'debt-strategies',
        readTime: 8,
        author: 'AI Financial Coach',
        publishDate: '2024-01-15',
        tags: ['debt snowball', 'debt avalanche', 'strategy'],
        featured: true
    },
    {
        id: '2',
        title: 'The 50/30/20 Budget Rule: A Beginner\'s Complete Guide',
        excerpt: 'Master the simple budgeting framework that helps millions of people take control of their finances.',
        content: `The 50/30/20 rule is one of the most popular budgeting methods because of its simplicity and flexibility. Here's how it works:

**50% - Needs (Essential Expenses)**
- Housing (rent/mortgage, utilities)
- Transportation (car payment, gas, insurance)
- Groceries and basic clothing
- Minimum debt payments
- Insurance premiums

**30% - Wants (Discretionary Spending)**
- Dining out and entertainment
- Hobbies and subscriptions
- Shopping and non-essential purchases
- Vacations and travel
- Gym memberships

**20% - Savings & Debt Payoff**
- Emergency fund
- Retirement contributions
- Extra debt payments
- Long-term savings goals

**Getting Started:**
1. Calculate your after-tax monthly income
2. Multiply by 0.50, 0.30, and 0.20 to get your targets
3. Track your spending for a month
4. Adjust categories as needed
5. Automate your savings and debt payments

**Pro Tips:**
- Start with your current spending and gradually adjust
- If you have high-interest debt, consider using more than 20% for debt payoff
- Adjust percentages based on your life situation
- The key is consistency, not perfection`,
        category: 'budgeting',
        readTime: 6,
        author: 'AI Financial Coach',
        publishDate: '2024-01-12',
        tags: ['budgeting', '50/30/20 rule', 'personal finance'],
        featured: true
    },
    {
        id: '3',
        title: 'How to Improve Your Credit Score While Paying Off Debt',
        excerpt: 'Learn the insider strategies to boost your credit score even while you\'re focused on debt elimination.',
        content: `Many people think you can't improve your credit score while paying off debt, but that's not true. Here are proven strategies to boost your score during debt payoff:

**1. Keep Credit Utilization Low**
- Aim for under 30% utilization on each card
- Even better: keep it under 10%
- Pay down balances before statement dates
- Consider making multiple payments per month

**2. Never Miss Payments**
- Payment history is 35% of your score
- Set up automatic minimum payments
- Pay on time, every time
- Even $5 over minimum helps

**3. Don't Close Old Credit Cards**
- Keep accounts open to maintain credit history
- Older accounts boost your average account age
- Put small recurring charges on old cards
- Pay them off immediately

**4. Strategic Debt Payoff Order**
- Pay off cards with highest utilization first
- This has immediate score benefits
- Balance this with your debt strategy

**5. Request Credit Limit Increases**
- Call your card companies every 6 months
- Higher limits = lower utilization percentage
- Don't spend the extra credit

**6. Monitor Your Credit Report**
- Check for errors monthly
- Dispute any inaccuracies immediately
- Use free services like Credit Karma

**Timeline Expectations:**
- Utilization changes: 1-2 months
- Payment history improvements: 3-6 months
- Overall score increases: 6-12 months

Remember: A higher credit score saves you money on future loans and can help with employment and housing applications.`,
        category: 'credit',
        readTime: 10,
        author: 'AI Financial Coach',
        publishDate: '2024-01-10',
        tags: ['credit score', 'debt payoff', 'credit utilization'],
        featured: false
    },
    {
        id: '4',
        title: 'Emergency Fund vs Debt: What Should Come First?',
        excerpt: 'The age-old personal finance debate: should you build an emergency fund or pay off debt first? Here\'s the answer.',
        content: `This is one of the most common questions in personal finance, and the answer isn't as straightforward as you might think. Here's the complete guide:

**The Dave Ramsey Approach: Emergency Fund First**
- Build $1,000 emergency fund first
- Then attack debt with intensity
- Build full 3-6 month emergency fund after debt payoff
- Philosophy: Prevent new debt during payoff

**The Mathematical Approach: Debt First**
- High-interest debt (>10%) should be prioritized
- Emergency fund earns ~3%, credit cards charge 20%+
- Every month of delay costs you money
- Use credit cards for true emergencies

**The Balanced Approach (Recommended)**
1. Build small starter emergency fund ($500-$1,000)
2. Pay off high-interest debt (>10% interest rate)
3. Build emergency fund to 3-6 months expenses
4. Pay off remaining lower-interest debt

**Consider Your Situation:**

**Prioritize Emergency Fund If:**
- You have irregular income
- Your job is unstable
- You have dependents
- You tend to use credit cards for emergencies
- You have high stress about financial security

**Prioritize Debt If:**
- You have stable income and job
- Your debt has very high interest rates (>15%)
- You have family support for true emergencies
- You're disciplined about not creating new debt

**Emergency Fund Size Guidelines:**
- Single, stable job: 3 months expenses
- Married, dual income: 3-4 months
- Single income household: 6 months
- Irregular income: 6-12 months

**Pro Tips:**
- Start with at least $500 no matter what
- Keep emergency fund in high-yield savings account
- Don't use it for non-emergencies
- Replenish immediately after using
- Consider side hustles to fund both goals simultaneously

The key is starting somewhere and being consistent with your plan.`,
        category: 'debt-strategies',
        readTime: 7,
        author: 'AI Financial Coach',
        publishDate: '2024-01-08',
        tags: ['emergency fund', 'debt payoff', 'financial priorities'],
        featured: false
    },
    {
        id: '5',
        title: 'The Psychology of Money: Why We Make Bad Financial Decisions',
        excerpt: 'Understand the mental biases and emotional triggers that lead to poor financial choices and how to overcome them.',
        content: `Our relationship with money is deeply psychological. Understanding these patterns can help us make better decisions and break free from the debt matrix.

**Common Money Psychology Traps:**

**1. Loss Aversion**
- We feel losses twice as strongly as gains
- Leads to avoiding investing or keeping "safe" but low-return savings
- Solution: Reframe debt payoff as "gaining" financial freedom

**2. Present Bias**
- We overvalue immediate rewards vs future benefits
- Why we choose instant gratification over long-term goals
- Solution: Make future goals more tangible and immediate

**3. Mental Accounting**
- Treating money differently based on its "source"
- Example: Spending tax refunds frivolously while struggling with debt
- Solution: View all money as having equal value

**4. Lifestyle Inflation**
- Increasing spending as income increases
- Prevents wealth building despite higher earnings
- Solution: Automate savings increases with raises

**5. Social Comparison**
- Keeping up with others' perceived wealth
- Often based on debt-funded lifestyles
- Solution: Focus on your own financial goals and values

**Overcoming Psychological Barriers:**

**Make It Automatic**
- Automate savings and debt payments
- Remove daily decision-making
- Set up systems for success

**Visualize Your Goals**
- Create vision boards for debt-free life
- Calculate exact dates for goals
- Break large goals into smaller milestones

**Change Your Money Scripts**
- Identify childhood money beliefs
- Challenge negative thought patterns
- Develop positive money mantras

**Use the Pain-Pleasure Principle**
- Associate pain with debt and poor spending
- Associate pleasure with saving and debt freedom
- Make good choices emotionally rewarding

**Build New Habits**
- Start with tiny changes
- Stack new habits on existing ones
- Track progress visually

**Environmental Design**
- Remove spending temptations
- Unsubscribe from retail emails
- Use cash for discretionary spending
- Delete shopping apps

Remember: Your brain is wired for survival, not wealth building. But with awareness and the right strategies, you can overcome these biases and achieve financial freedom.`,
        category: 'psychology',
        readTime: 12,
        author: 'AI Financial Coach',
        publishDate: '2024-01-05',
        tags: ['psychology', 'behavioral finance', 'decision making'],
        featured: true
    },
    {
        id: '6',
        title: 'Should You Invest While Paying Off Debt?',
        excerpt: 'Navigate the complex decision of whether to invest or focus solely on debt elimination.',
        content: `The decision to invest while carrying debt depends on several factors, including interest rates, risk tolerance, and your financial goals. Here's how to make the right choice:

**The Interest Rate Rule**
- If debt interest rate > expected investment return: Pay off debt first
- If debt interest rate < expected investment return: Consider investing
- The crossover point is typically 6-8%

**Types of Debt to Consider:**

**Always Pay First (High Interest):**
- Credit cards (15-25%+)
- Personal loans (10-15%+)
- Payday loans (400%+)
- Store credit cards (20-30%+)

**Maybe Invest Instead (Low Interest):**
- Mortgages (3-7%)
- Student loans (3-6%)
- Auto loans (2-8%)
- Home equity loans (4-8%)

**The Employer Match Exception**
Always contribute enough to get full employer 401(k) match:
- It's an instant 50-100% return
- Free money you can't get later
- Even with debt, this is usually worth it

**Balanced Approach Strategy:**
1. Pay minimums on all debts
2. Get full employer match
3. Build small emergency fund ($1,000)
4. Attack high-interest debt aggressively
5. Once debt is under 6-8% interest, start investing more
6. Maintain emergency fund

**Risk Considerations:**
- Debt payoff is guaranteed return
- Investments can lose money short-term
- Your risk tolerance matters
- Job stability affects the equation

**Age and Time Horizon:**
- Younger investors: More time to ride out volatility
- Older investors: Less time to recover from losses
- Longer time horizon favors investing

**Mathematical vs Behavioral:**
- Math says invest if returns > debt rate
- Behavior says debt freedom provides peace of mind
- Choose what you'll actually stick with

**The Hybrid Approach:**
- 70% extra money to debt
- 30% to investments
- Provides balance between both goals
- Builds good habits for both

**Red Flags - Focus on Debt Only:**
- You're stressed about debt
- You use credit cards for daily expenses
- You don't have emergency fund
- Your debt is growing faster than you can pay it

**Green Lights for Investing:**
- You have stable income
- Debt interest rates under 7%
- You have emergency fund
- You're comfortable with investment risk

Remember: There's no universally "right" answer. The best choice is the one that aligns with your situation, goals, and gives you peace of mind.`,
        category: 'investing',
        readTime: 9,
        author: 'AI Financial Coach',
        publishDate: '2024-01-03',
        tags: ['investing', 'debt payoff', 'opportunity cost'],
        featured: false
    },
    {
        id: '7',
        title: 'Zero-Based Budgeting: Give Every Dollar a Job',
        excerpt: 'Learn the powerful budgeting method that assigns every dollar a purpose before you spend it.',
        content: `Zero-based budgeting is a method where your income minus expenses equals zero. Every dollar gets assigned a job before the month begins.

**How Zero-Based Budgeting Works:**
1. Start with your monthly take-home income
2. List all expenses and savings goals
3. Assign dollar amounts until you reach zero
4. Adjust categories as needed throughout the month

**Income - Expenses - Savings = $0**

**Step-by-Step Process:**

**1. Calculate Your Income**
- Include all sources: salary, freelance, side hustles
- Use net (after-tax) income
- If income varies, use lowest typical month

**2. List Fixed Expenses**
- Rent/mortgage
- Insurance premiums
- Loan minimums
- Subscriptions
- Utilities (estimated)

**3. Plan Variable Expenses**
- Groceries
- Gas
- Entertainment
- Clothing
- Personal care

**4. Assign Savings Goals**
- Emergency fund
- Debt payoff (beyond minimums)
- Retirement
- Vacation fund
- Other goals

**5. Balance to Zero**
- If money left over: Assign to savings or debt
- If over budget: Cut expenses or increase income
- Every dollar must have a purpose

**Zero-Based Budget Categories:**

**Essential (50-60%)**
- Housing
- Transportation
- Food
- Utilities
- Insurance
- Debt minimums

**Financial Goals (20-30%)**
- Emergency fund
- Extra debt payments
- Retirement savings
- Long-term savings

**Lifestyle (15-25%)**
- Entertainment
- Dining out
- Hobbies
- Personal care
- Miscellaneous

**Buffer Categories:**
- Miscellaneous (2-5% of income)
- Buffer for overspending
- Unexpected small expenses

**Tools for Zero-Based Budgeting:**
- EveryDollar app (Dave Ramsey's tool)
- YNAB (You Need A Budget)
- Pen and paper
- Excel/Google Sheets
- Banking app budgeting tools

**Common Mistakes:**
- Being too restrictive on variable expenses
- Forgetting annual expenses (car registration, gifts)
- Not tracking actual spending vs budget
- Giving up after first month imperfection

**Tips for Success:**
- Start simple with broad categories
- Review and adjust weekly
- Use cash for variable spending categories
- Plan for irregular expenses
- Be realistic about your spending habits

**Benefits:**
- Complete awareness of money flow
- Intentional spending
- Faster debt payoff
- Better savings rate
- Reduced financial stress

Zero-based budgeting requires more effort upfront but creates incredible financial control and clarity.`,
        category: 'budgeting',
        readTime: 8,
        author: 'AI Financial Coach',
        publishDate: '2024-01-20',
        tags: ['zero-based budgeting', 'budgeting', 'financial planning'],
        featured: false
    },
    {
        id: '8',
        title: 'Credit Card Debt: The Complete Elimination Guide',
        excerpt: 'Step-by-step strategies to crush credit card debt and avoid falling back into the trap.',
        content: `Credit card debt is one of the most dangerous types of debt due to high interest rates and minimum payment traps. Here's your complete elimination guide:

**Understanding Credit Card Debt:**
- Average APR: 20-25%
- Minimum payments mostly go to interest
- $5,000 balance = 13+ years to pay off with minimums only
- Total interest paid: $6,000+ on a $5,000 balance

**Step 1: Stop the Bleeding**
- Cut up cards or freeze them (literally)
- Remove cards from online accounts
- Delete shopping apps
- Cancel unnecessary subscriptions
- Switch to cash/debit only

**Step 2: List All Your Credit Card Debts**
For each card, record:
- Current balance
- Interest rate (APR)
- Minimum payment
- Due date
- Available credit

**Step 3: Choose Your Payoff Strategy**

**Debt Avalanche (Math Optimal):**
- Pay minimums on all cards
- Put extra money toward highest APR card
- Saves most money in interest

**Debt Snowball (Psychology Optimal):**
- Pay minimums on all cards
- Put extra money toward smallest balance
- Builds momentum through quick wins

**Step 4: Find Extra Money**
- Cancel subscriptions you don't need
- Reduce dining out budget
- Sell items you don't use
- Take on overtime or side gigs
- Use tax refunds and bonuses

**Step 5: Negotiate with Credit Card Companies**
- Call and ask for lower interest rates
- Request hardship programs if struggling
- Ask about payment plans
- Be honest about your situation

**Step 6: Consider Balance Transfer**
- 0% APR promotions can help
- Usually 3-5% transfer fee
- Must pay off during promotional period
- Don't use it as excuse to create more debt

**Step 7: Avoid Common Traps**
- Don't close cards after paying off (hurts credit score)
- Don't use newly available credit
- Don't stop making payments if you get a windfall
- Don't assume you're "cured" after payoff

**Advanced Strategies:**

**The Debt Snowflake Method:**
- Apply small amounts to debt immediately
- $20 from selling something
- $50 cashback from credit card rewards
- Every little bit counts

**Multiple Payment Method:**
- Make payments weekly instead of monthly
- Reduces average daily balance
- Lowers interest charges
- Helps with cash flow management

**The Credit Card Arbitrage:**
- Use 0% promotional rates strategically
- Put money in high-yield savings
- Profit from interest difference
- ONLY for disciplined individuals

**Preventing Future Credit Card Debt:**
- Build emergency fund
- Use cash envelopes for variable expenses
- Keep one card for emergencies only
- Track spending daily
- Address emotional spending triggers

**Timeline Expectations:**
- $5,000 debt, $200/month extra: 20 months
- $10,000 debt, $500/month extra: 18 months
- $20,000 debt, $1,000/month extra: 19 months

**Red Flags - Get Help:**
- Only making minimum payments
- Using cash advances
- Taking new debt to pay old debt
- Missing payments regularly

Remember: Credit card companies profit from your debt. The longer you take to pay it off, the more money they make. Your goal is to pay it off as quickly as possible and never carry a balance again.`,
        category: 'debt-strategies',
        readTime: 11,
        author: 'AI Financial Coach',
        publishDate: '2024-01-18',
        tags: ['credit cards', 'debt elimination', 'high interest debt'],
        featured: true
    },
    {
        id: '9',
        title: 'Building an Emergency Fund: Your Financial Safety Net',
        excerpt: 'Learn how to build and maintain an emergency fund that protects you from financial disasters.',
        content: `An emergency fund is your financial safety net that prevents life's unexpected events from derailing your financial progress. Here's how to build one:

**What is an Emergency Fund?**
- Money set aside for true emergencies only
- Separate from checking and savings
- Easily accessible but not too convenient
- NOT for planned expenses or wants

**What Qualifies as an Emergency?**

**True Emergencies:**
- Job loss or income reduction
- Major medical expenses
- Essential home repairs (roof, plumbing, HVAC)
- Car repairs needed for work
- Emergency travel for family

**NOT Emergencies:**
- Vacations
- Christmas gifts
- Car maintenance (oil changes, tires)
- Annual insurance premiums
- Home improvements or upgrades

**How Much Do You Need?**

**Starter Emergency Fund:**
- $500-$1,000 minimum
- Focus here if you have high-interest debt
- Covers small emergencies
- Prevents new debt creation

**Full Emergency Fund:**
- 3-6 months of expenses (not income)
- Based on your essential monthly costs
- Calculate: Housing + utilities + food + transportation + debt minimums

**Situation-Based Guidelines:**
- Single, stable job: 3 months
- Married, both working: 3-4 months
- Single income household: 6 months
- Commission/irregular income: 6-12 months
- Self-employed: 6-12 months

**Where to Keep Your Emergency Fund:**

**High-Yield Savings Account (Best Option):**
- FDIC insured
- Competitive interest rates (4-5%)
- Easy access but not instant
- Examples: Marcus, Ally, Capital One 360

**Money Market Account:**
- Higher interest than traditional savings
- May have minimum balance requirements
- Limited transactions per month

**Short-Term CDs:**
- Higher rates but money is locked up
- Only for part of emergency fund
- 3-6 month terms maximum

**DON'T Use:**
- Checking account (too accessible)
- Investment accounts (can lose value)
- Crypto (too volatile)
- Under your mattress (no growth, not FDIC insured)

**Building Your Emergency Fund:**

**Step 1: Start Small**
- Even $10/week = $520/year
- Save loose change
- Direct deposit a small amount automatically

**Step 2: Automate It**
- Set up automatic transfer from checking
- Treat it like a bill you must pay
- Transfer on payday before you spend

**Step 3: Boost It Fast**
- Tax refunds
- Bonuses
- Side hustle income
- Selling unused items
- Cashback rewards

**Step 4: Make It Inconvenient**
- Keep at different bank
- No debit card for this account
- Requires transfer to access
- Name it "Do Not Touch Fund"

**Emergency Fund Challenges:**

**The 52-Week Challenge:**
- Week 1: Save $1
- Week 2: Save $2
- Continue increasing by $1 each week
- Total saved: $1,378

**The $5 Challenge:**
- Save every $5 bill you receive
- Can accumulate $500-1,000 annually
- Forces mindful spending

**Maintaining Your Emergency Fund:**

**After Using It:**
- Replenish immediately
- Pause other financial goals if needed
- Don't feel guilty about using it for true emergencies

**Annual Review:**
- Adjust for expense increases
- Rebalance if it grows too large
- Move excess to investments or debt payoff

**Growing Beyond Emergency Fund:**
- Once you have 6 months saved
- Consider investing additional amounts
- Keep core emergency fund in cash
- Build separate sinking funds for planned expenses

**Common Mistakes:**
- Using it for non-emergencies
- Keeping too much (beyond 6 months)
- Investing it in volatile assets
- Not replenishing after use
- Mixing it with other savings goals

Your emergency fund is insurance against life's uncertainties. It provides peace of mind and prevents you from going into debt when unexpected expenses arise. Start small, be consistent, and protect this fund fiercely.`,
        category: 'budgeting',
        readTime: 10,
        author: 'AI Financial Coach',
        publishDate: '2024-01-16',
        tags: ['emergency fund', 'financial planning', 'savings'],
        featured: false
    },
    {
        id: '10',
        title: 'Side Hustles for Debt Payoff: Extra Income Strategies',
        excerpt: 'Discover proven ways to earn extra money and accelerate your debt elimination journey.',
        content: `Increasing your income is often the fastest way to pay off debt. Here are proven side hustles and strategies to boost your earnings:

**Online Side Hustles:**

**Freelance Services:**
- Writing and copywriting ($15-100/hour)
- Graphic design ($20-75/hour)
- Web development ($25-150/hour)
- Virtual assistance ($12-30/hour)
- Social media management ($15-50/hour)
- Platforms: Upwork, Fiverr, Freelancer

**Online Tutoring:**
- Math, science, language tutoring ($15-80/hour)
- Test prep (SAT, GRE, GMAT) ($30-100/hour)
- Music lessons via video call ($20-60/hour)
- Platforms: Wyzant, Tutor.com, Preply

**Local Service Side Hustles:**

**Gig Economy:**
- Uber/Lyft driving ($10-25/hour)
- DoorDash/Uber Eats delivery ($12-20/hour)
- Instacart shopping ($10-22/hour)
- TaskRabbit handyman services ($15-75/hour)

**Traditional Services:**
- Pet sitting/dog walking ($15-30/visit)
- House sitting ($25-75/night)
- Lawn care ($25-50/lawn)
- Snow removal ($20-100/driveway)
- Cleaning services ($15-30/hour)

**Skill-Based Side Hustles:**

**If You're Handy:**
- Furniture flipping
- Small home repairs
- Assembly services
- Painting services
- Minor electrical/plumbing

**If You're Creative:**
- Etsy shop for handmade items
- Custom art commissions
- Photography services
- Wedding/event planning
- Cake decorating

**If You're Tech-Savvy:**
- Computer repair
- Phone screen replacement
- Website design for small businesses
- Social media setup
- Online store creation

**Selling and Flipping:**

**Immediate Cash:**
- Sell items you own (electronics, clothes, furniture)
- Facebook Marketplace, eBay, Poshmark
- Host garage sales
- Consign valuable items

**Buy and Flip:**
- Thrift store finds → online sales
- Estate sale purchases
- Clearance items → Amazon FBA
- Domain name flipping
- Social media account flipping

**Passive Income Streams:**

**Real Estate:**
- Rent out spare room (Airbnb)
- Rent parking space
- Storage space rental
- Billboard on your property

**Digital Products:**
- Create and sell online courses
- Write and sell ebooks
- Stock photo licensing
- App development

**Investment Income:**
- High-yield savings interest
- Dividend-paying stocks
- REITs (Real Estate Investment Trusts)
- Peer-to-peer lending

**Maximizing Side Hustle Success:**

**Time Management:**
- Track time spent vs money earned
- Focus on highest-paying activities
- Batch similar tasks together
- Set specific side hustle hours

**Tax Considerations:**
- Track all expenses
- Set aside 25-30% for taxes
- Use business deductions
- Consider forming LLC for protection

**Reinvestment Strategy:**
- Improve skills for higher rates
- Buy better equipment
- Invest in marketing
- Scale successful hustles

**Side Hustle for Debt Payoff Plan:**

**Month 1-2: Start Simple**
- Sell items you already own
- Sign up for 1-2 gig economy apps
- Identify your best skills

**Month 3-4: Scale Up**
- Add more platforms/services
- Increase rates as you gain experience
- Ask for referrals from satisfied customers

**Month 5-6: Optimize**
- Focus on most profitable activities
- Develop systems and processes
- Consider raising rates

**Red Flags to Avoid:**
- Multi-level marketing schemes
- "Get rich quick" promises
- Requiring large upfront investments
- Pyramid schemes
- Anything too good to be true

**Setting Realistic Expectations:**
- Start with goal of $200-500/month extra
- Most successful side hustlers earn $500-2,000/month
- It takes 3-6 months to build momentum
- Consistency beats perfection

**Using Side Hustle Income:**
- 100% to debt payoff initially
- Build small emergency fund first
- Don't increase lifestyle spending
- Track extra income separately

Remember: Every extra dollar you earn and apply to debt eliminates multiple dollars in future interest payments. A $500/month side hustle can cut years off your debt payoff timeline.`,
        category: 'budgeting',
        readTime: 13,
        author: 'AI Financial Coach',
        publishDate: '2024-01-14',
        tags: ['side hustles', 'extra income', 'debt payoff', 'financial freedom'],
        featured: false
    }
]

const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen },
    { id: 'debt-strategies', name: 'Debt Strategies', icon: Target },
    { id: 'budgeting', name: 'Budgeting', icon: Calculator },
    { id: 'credit', name: 'Credit Score', icon: TrendingUp },
    { id: 'investing', name: 'Investing', icon: DollarSign },
    { id: 'psychology', name: 'Money Psychology', icon: Brain }
]

export default function ArticlePage() {
    const params = useParams()
    const post = blogPosts.find(p => p.id === params.id)

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Article Not Found</h1>
                    <Link href="/learn">
                        <Button variant="outline" className="text-gray-300 hover:text-white">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Articles
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    const category = categories.find(c => c.id === post.category)

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center">
                            <div className="text-xl font-semibold text-white">Debtrix</div>
                        </Link>
                        <div className="hidden md:flex items-center space-x-6">
                            <Link href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
                            <Link href="/chat" className="text-gray-300 hover:text-white">AI Coach</Link>
                            <Link href="/learn" className="text-green-400 font-medium">Learn</Link>
                            <Link href="/assessment" className="text-gray-300 hover:text-white">Assessment</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Article Content */}
            <div className="pt-24 pb-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Back Button */}
                        <Link href="/learn">
                            <Button variant="ghost" className="text-gray-300 hover:text-white mb-8">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Articles
                            </Button>
                        </Link>

                        {/* Article Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <Badge variant="outline" className="border-gray-600 text-gray-400">
                                    {category?.name}
                                </Badge>
                                <div className="flex items-center text-gray-400 text-sm">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {post.readTime} min read
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
                            <div className="flex items-center text-gray-400">
                                <User className="w-4 h-4 mr-2" />
                                {post.author} • {new Date(post.publishDate).toLocaleDateString()}
                            </div>
                        </div>

                        {/* Article Content */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="prose prose-invert max-w-none py-8">
                                {post.content.split('\n\n').map((paragraph, index) => {
                                    if (paragraph.startsWith('**')) {
                                        // Handle bold text
                                        const [title, ...content] = paragraph.split('\n')
                                        return (
                                            <div key={index} className="mb-6">
                                                <h2 className="text-xl font-semibold text-white mb-4">
                                                    {title.replace(/\*\*/g, '')}
                                                </h2>
                                                <ul className="list-disc pl-6 space-y-2">
                                                    {content.map((item, i) => (
                                                        <li key={i} className="text-gray-300">
                                                            {item.replace(/^- /, '')}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )
                                    }
                                    return (
                                        <p key={index} className="text-gray-300 mb-4">
                                            {paragraph}
                                        </p>
                                    )
                                })}
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-white mb-4">Related Topics</h3>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-300">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 