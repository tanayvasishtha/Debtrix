import { ChatMessage, UserProfile, DebtCalculation } from '@/types/database'

export interface AIContext {
    userProfile?: UserProfile
    currentDebts?: Array<{
        name: string
        balance: number
        interestRate: number
        type: string
    }>
    recentCalculations?: DebtCalculation[]
    stressLevel?: number
    chatHistory?: ChatMessage[]
}

export class AIFinancialCoach {
    private apiKey: string
    private baseUrl = 'https://api.perplexity.ai/chat/completions'

    constructor() {
        this.apiKey = process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY || ''
        if (!this.apiKey) {
            console.warn('Perplexity API key not found. AI features will be limited.')
        }
    }

    // Main chat interface for financial coaching
    async getChatResponse(
        message: string,
        context: AIContext = {},
        sessionId: string
    ): Promise<string> {
        try {
            const systemPrompt = this.buildSystemPrompt(context)
            const contextualMessage = this.enhanceMessageWithContext(message, context)

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama-3.1-sonar-large-128k-online',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...this.formatChatHistory(context.chatHistory || []),
                        { role: 'user', content: contextualMessage }
                    ],
                    max_tokens: 1000,
                    temperature: 0.7,
                    stream: false,
                }),
            })

            if (!response.ok) {
                throw new Error(`Perplexity API error: ${response.status}`)
            }

            const data = await response.json()
            return this.formatResponse(data.choices[0].message.content)
        } catch (error) {
            console.error('AI Service Error:', error)
            return this.getFallbackResponse(message, context)
        }
    }

    // Build comprehensive system prompt for financial coaching
    private buildSystemPrompt(context: AIContext): string {
        const basePrompt = `You are Debtrix AI, an expert financial coach specializing in debt elimination and financial literacy education. Your mission is to help users "escape the debt matrix" through personalized guidance and education.

CORE PRINCIPLES:
- Provide educational, encouraging, and actionable financial advice
- Focus exclusively on debt management, budgeting, and financial literacy
- Use motivational language that references "breaking free" and "escaping the matrix"
- Always include practical next steps
- Be empathetic to financial stress and anxiety
- Never provide investment advice or specific financial product recommendations

RESPONSE GUIDELINES:
- Keep responses under 300 words unless explaining complex concepts
- Use bullet points for actionable advice
- Include relevant calculations when helpful
- Reference debt elimination strategies (snowball, avalanche, hybrid)
- Address psychological aspects of debt management
- Encourage progress and celebrate wins`

        let contextPrompt = ''

        if (context.userProfile) {
            contextPrompt += `\n\nUSER CONTEXT:
- Current debt total: $${context.userProfile.currentDebtTotal?.toLocaleString() || 'N/A'}
- Monthly payment capacity: $${context.userProfile.monthlyPaymentCapacity?.toLocaleString() || 'N/A'}
- Recommended strategy: ${context.userProfile.recommendedStrategy || 'Not set'}
- Stress level: ${context.stressLevel || 'Unknown'}/10
- Assessment completed: ${context.userProfile.hasCompletedAssessment ? 'Yes' : 'No'}`
        }

        if (context.currentDebts && context.currentDebts.length > 0) {
            contextPrompt += `\n\nCURRENT DEBTS:`
            context.currentDebts.forEach(debt => {
                contextPrompt += `\n- ${debt.name}: $${debt.balance.toLocaleString()} at ${debt.interestRate}% (${debt.type})`
            })
        }

        if (context.recentCalculations && context.recentCalculations.length > 0) {
            const calc = context.recentCalculations[0]
            contextPrompt += `\n\nRECENT CALCULATIONS:
- Method: ${calc.method}
- Payoff time: ${calc.payoffTime} months
- Total interest: $${calc.totalInterest.toLocaleString()}
- Monthly payment: $${calc.monthlyPayment.toLocaleString()}`
        }

        return basePrompt + contextPrompt + `\n\nRemember: You are helping this specific user with their actual debt situation. Provide personalized advice based on their context.`
    }

    // Enhance user message with contextual information
    private enhanceMessageWithContext(message: string, context: AIContext): string {
        // Don't modify the message, let the system prompt provide context
        return message
    }

    // Format chat history for API
    private formatChatHistory(history: ChatMessage[]): Array<{ role: string; content: string }> {
        // Include last 10 messages for context
        return history.slice(-10).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        }))
    }

    // Format and clean AI response
    private formatResponse(content: string): string {
        // Clean up response and ensure it's appropriate
        let response = content.trim()

        // Add Matrix-themed motivation if response is about progress
        if (response.toLowerCase().includes('progress') || response.toLowerCase().includes('achievement')) {
            response += '\n\n🟢 You\'re breaking free from the debt matrix! Keep pushing forward.'
        }

        // Ensure response includes actionable next steps
        if (!response.toLowerCase().includes('next step') && !response.toLowerCase().includes('action')) {
            response += '\n\n💡 Next step: Focus on your highest priority debt payment this month.'
        }

        return response
    }

    // Fallback responses for when AI service is unavailable
    private getFallbackResponse(message: string, context: AIContext): string {
        const messageLower = message.toLowerCase()

        if (messageLower.includes('stress') || messageLower.includes('anxiety')) {
            return `I understand debt can be stressful. Remember, you're taking positive steps by working on your debt elimination plan. 

Here are some stress-reduction tips:
• Focus on one debt at a time
• Celebrate small wins along the way
• Remember that every payment brings you closer to freedom
• Consider the ${context.userProfile?.recommendedStrategy || 'snowball'} method for psychological benefits

🟢 You're already breaking free from the debt matrix by taking action!`
        }

        if (messageLower.includes('snowball') || messageLower.includes('avalanche')) {
            return `Great question about debt elimination strategies!

**Snowball Method**: Pay minimums on all debts, put extra toward smallest balance
• Pros: Quick psychological wins, builds momentum
• Best for: High stress, need motivation

**Avalanche Method**: Pay minimums on all debts, put extra toward highest interest rate
• Pros: Saves most money mathematically
• Best for: Disciplined approach, large interest rate differences

**Hybrid Method**: Combine both for balanced approach
• Start with 1-2 small debts, then switch to highest interest

Choose based on your personality and stress level!`
        }

        if (messageLower.includes('payment') || messageLower.includes('budget')) {
            return `Let's optimize your payment strategy:

• **Track every expense** for one week to find hidden money
• **Use the 50/30/20 rule**: 50% needs, 30% wants, 20% debt/savings
• **Find extra payment money** from:
  - Cutting subscriptions
  - Meal planning
  - Side gig income
  - Tax refunds

Even an extra $50/month can save thousands in interest!

💡 Next step: Calculate how much extra you can realistically pay each month.`
        }

        return `I'm here to help you escape the debt matrix! While I'm having connection issues, here are some key principles:

• **Stay consistent** with your debt payments
• **Focus on one strategy** (snowball, avalanche, or hybrid)
• **Track your progress** to stay motivated
• **Build an emergency fund** to avoid new debt

🟢 Every payment is a step toward financial freedom!

Please try your question again, or ask about specific debt strategies, budgeting tips, or stress management.`
    }

    // Get personalized debt strategy recommendations
    async getStrategyRecommendation(context: AIContext): Promise<{
        strategy: string
        reasoning: string
        nextSteps: string[]
    }> {
        const message = "Based on my debt situation and stress level, what's the best debt elimination strategy for me?"

        try {
            const response = await this.getChatResponse(message, context, 'strategy-session')

            // Parse response for structured recommendation
            return {
                strategy: context.userProfile?.recommendedStrategy || 'avalanche',
                reasoning: response,
                nextSteps: [
                    'Complete your debt assessment if not done',
                    'Set up automatic minimum payments',
                    'Identify extra payment amount',
                    'Choose your focus debt',
                    'Track progress monthly'
                ]
            }
        } catch (error) {
            return {
                strategy: 'avalanche',
                reasoning: 'Mathematically optimal approach that minimizes total interest paid.',
                nextSteps: [
                    'List all debts with balances and interest rates',
                    'Pay minimums on all debts',
                    'Put extra payments toward highest interest rate debt',
                    'Track progress and celebrate milestones'
                ]
            }
        }
    }

    // Get motivational message based on progress
    getMotivationalMessage(
        totalDebtPaid: number,
        monthsInProgress: number,
        currentMilestone: string
    ): string {
        const messages = [
            `🎉 Amazing! You've paid off $${totalDebtPaid.toLocaleString()} in ${monthsInProgress} months. You're truly escaping the debt matrix!`,
            `💪 ${monthsInProgress} months of consistency is building real momentum. The matrix has no power over your financial future!`,
            `🟢 Milestone achieved: ${currentMilestone}. Every payment is breaking another chain in the debt matrix.`,
            `🚀 You're proof that the debt elimination system works. Keep this energy going!`,
            `✨ Your financial discipline is transforming your future. The debt matrix is losing its grip!`
        ]

        return messages[Math.floor(Math.random() * messages.length)]
    }

    // Educational content recommendations
    getEducationalRecommendations(userContext: AIContext): Array<{
        title: string
        description: string
        category: string
    }> {
        const recommendations = []

        if (!userContext.userProfile?.hasCompletedAssessment) {
            recommendations.push({
                title: 'Complete Your Debt Assessment',
                description: 'Get personalized strategy recommendations based on your specific situation',
                category: 'assessment'
            })
        }

        if (userContext.stressLevel && userContext.stressLevel >= 7) {
            recommendations.push({
                title: 'Managing Financial Stress',
                description: 'Learn techniques to reduce anxiety while working toward debt freedom',
                category: 'psychology'
            })
        }

        if (userContext.currentDebts && userContext.currentDebts.length > 3) {
            recommendations.push({
                title: 'Debt Consolidation vs. Multiple Payments',
                description: 'Understand when consolidation makes sense for your situation',
                category: 'strategies'
            })
        }

        recommendations.push({
            title: 'Building Your Emergency Fund',
            description: 'Prevent future debt while paying off current obligations',
            category: 'advanced'
        })

        return recommendations
    }
}

export async function generateFinancialAdvice(
    userProfile: UserProfile,
    question: string
): Promise<string> {
    try {
        const prompt = `You are a professional financial advisor. Based on the user's financial profile, provide helpful, actionable advice for their question.

User Profile:
- Monthly Income: $${userProfile.monthlyIncome}
- Monthly Expenses: $${userProfile.monthlyExpenses}
- Total Debt: $${userProfile.totalDebt}
- Available for Debt Payment: $${userProfile.availableForDebt}
- Debt-to-Income Ratio: ${userProfile.debtToIncomeRatio}%

Question: ${question}

Please provide specific, actionable financial advice. Keep your response concise but comprehensive.`;

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'sonar-pro',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful financial advisor. Provide practical, actionable advice for debt management and personal finance.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 500,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate advice at this time. Please try again later.';
    } catch {
        return 'I apologize, but I\'m having trouble connecting to provide personalized advice right now. Please try again later.';
    }
}

export async function generateDebtStrategy(
    debts: Debt[],
    monthlyIncome: number,
    monthlyExpenses: number
): Promise<DebtStrategy> {
    try {
        const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
        const availableForDebt = Math.max(0, monthlyIncome - monthlyExpenses);
        
        const prompt = `As a financial advisor, analyze these debts and recommend the best payoff strategy:

Debts:
${debts.map(debt => `- ${debt.name}: $${debt.balance} at ${debt.interestRate}% APR (min payment: $${debt.minimumPayment})`).join('\n')}

Monthly Income: $${monthlyIncome}
Monthly Expenses: $${monthlyExpenses}
Available for Debt Payment: $${availableForDebt}

Recommend either "snowball" (lowest balance first) or "avalanche" (highest interest first) strategy and explain why. Also suggest an optimal extra payment amount.`;

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'sonar-pro',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a financial advisor specializing in debt elimination strategies. Provide clear, actionable recommendations.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 400,
                temperature: 0.3,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const advice = data.choices[0]?.message?.content || '';
        
        // Simple strategy detection based on response
        const strategy = advice.toLowerCase().includes('avalanche') ? 'avalanche' : 'snowball';
        const suggestedExtraPayment = Math.min(availableForDebt * 0.8, 200); // Conservative suggestion
        
        return {
            strategy,
            suggestedExtraPayment,
            reasoning: advice,
            estimatedPayoffMonths: calculateEstimatedPayoff(debts, strategy, suggestedExtraPayment)
        };
    } catch {
        // Fallback strategy
        const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
        const availableForDebt = Math.max(0, monthlyIncome - monthlyExpenses);
        
        return {
            strategy: totalDebt < 10000 ? 'snowball' : 'avalanche',
            suggestedExtraPayment: Math.min(availableForDebt * 0.5, 100),
            reasoning: 'Based on your debt profile, this strategy should help you pay off your debts efficiently.',
            estimatedPayoffMonths: 24
        };
    }
} 