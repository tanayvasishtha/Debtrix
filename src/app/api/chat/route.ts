// Function to check if a message is financial-related
function isFinancialQuestion(message: string): boolean {
    const financialKeywords = [
        'debt', 'credit', 'loan', 'mortgage', 'interest', 'investment',
        'savings', 'budget', 'finance', 'money', 'bank', 'economy',
        'inflation', 'stock', 'market', 'tax', 'income', 'expense',
        'financial', 'wealth', 'retirement', 'pension', 'insurance',
        'payment', 'salary', 'wage', 'profit', 'loss', 'asset',
        'liability', 'balance', 'cash', 'currency', 'exchange',
        'trading', 'portfolio', 'dividend', 'bond', 'fund',
        'crypto', 'bitcoin', 'ethereum', 'blockchain', 'nft',
        'forex', 'derivative', 'option', 'futures', 'commodity'
    ]

    const messageLower = message.toLowerCase()
    return financialKeywords.some(keyword => messageLower.includes(keyword))
}

export async function POST(req: Request) {
    try {
        const { message } = await req.json()

        // Check if the question is financial-related
        if (!isFinancialQuestion(message)) {
            return new Response(
                JSON.stringify({
                    error: 'Please ask a financial-related question. I can help with topics like budgeting, debt management, investing, and financial planning.'
                }),
                { status: 400 }
            )
        }

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY}`
            },
            body: JSON.stringify({
                model: 'sonar-pro',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful financial advisor focused on debt management, budgeting, and financial planning. Provide clear, actionable advice while being mindful of financial regulations and best practices.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 1000
            })
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            console.error('Perplexity API Error:', errorData)

            // More specific error message based on the error type
            if (errorData?.error?.type === 'invalid_model') {
                throw new Error('Invalid model configuration. Please contact support.')
            } else if (errorData?.error?.type === 'invalid_api_key') {
                throw new Error('API key configuration error. Please contact support.')
            } else {
                throw new Error(errorData?.error?.message || 'Failed to get response from Perplexity API')
            }
        }

        const data = await response.json()

        // Validate the response format
        if (!data.choices?.[0]?.message?.content) {
            throw new Error('Invalid response format from Perplexity API')
        }

        return new Response(
            JSON.stringify({
                response: data.choices[0].message.content,
                suggestions: [
                    "How can I pay off my credit card debt faster?",
                    "What's the difference between debt snowball and avalanche?",
                    "Help me create a budget",
                    "Should I consolidate my debts?"
                ]
            }),
            { status: 200 }
        )
    } catch (error) {
        console.error('Chat API Error:', error)
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            }),
            { status: 500 }
        )
    }
} 