export interface Database {
    public: {
        Tables: {
            debts: {
                Row: {
                    id: string
                    user_id: string
                    debt_name: string
                    debt_type: DebtType
                    current_balance: number
                    original_balance: number
                    interest_rate: number
                    minimum_payment: number
                    due_date: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    debt_name: string
                    debt_type: DebtType
                    current_balance: number
                    original_balance: number
                    interest_rate: number
                    minimum_payment: number
                    due_date: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    debt_name?: string
                    debt_type?: DebtType
                    current_balance?: number
                    original_balance?: number
                    interest_rate?: number
                    minimum_payment?: number
                    due_date?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            debt_assessment: {
                Row: {
                    id: string
                    user_id: string
                    stress_level: number
                    financial_knowledge: string
                    monthly_income: number
                    monthly_expenses: number
                    available_for_debt: number
                    emergency_fund: number | null
                    debt_consolidation_interest: boolean
                    extra_payment_capacity: number
                    primary_goal: string
                    preferred_strategy: string | null
                    risk_tolerance: string
                    recommended_method: DebtMethod
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    stress_level: number
                    financial_knowledge: string
                    monthly_income: number
                    monthly_expenses: number
                    available_for_debt: number
                    emergency_fund?: number | null
                    debt_consolidation_interest?: boolean
                    extra_payment_capacity?: number
                    primary_goal: string
                    preferred_strategy?: string | null
                    risk_tolerance: string
                    recommended_method: DebtMethod
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    stress_level?: number
                    financial_knowledge?: string
                    monthly_income?: number
                    monthly_expenses?: number
                    available_for_debt?: number
                    emergency_fund?: number | null
                    debt_consolidation_interest?: boolean
                    extra_payment_capacity?: number
                    primary_goal?: string
                    preferred_strategy?: string | null
                    risk_tolerance?: string
                    recommended_method?: DebtMethod
                    created_at?: string
                    updated_at?: string
                }
            }
            progress_tracking: {
                Row: {
                    id: string
                    user_id: string
                    debt_id: string
                    payment_amount: number
                    payment_date: string
                    payment_type: PaymentType
                    balance_after: number
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    debt_id: string
                    payment_amount: number
                    payment_date: string
                    payment_type: PaymentType
                    balance_after: number
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    debt_id?: string
                    payment_amount?: number
                    payment_date?: string
                    payment_type?: PaymentType
                    balance_after?: number
                    notes?: string | null
                    created_at?: string
                }
            }
            chat_history: {
                Row: {
                    id: string
                    user_id: string
                    session_id: string | null
                    message_type: string
                    content: string
                    metadata: any | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    session_id?: string | null
                    message_type: string
                    content: string
                    metadata?: any | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    session_id?: string | null
                    message_type?: string
                    content?: string
                    metadata?: any | null
                    created_at?: string
                }
            }
            blog_posts: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    content: string
                    excerpt: string | null
                    author: string | null
                    category: string
                    tags: string[] | null
                    featured_image: string | null
                    published: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    content: string
                    excerpt?: string | null
                    author?: string | null
                    category: string
                    tags?: string[] | null
                    featured_image?: string | null
                    published?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    content?: string
                    excerpt?: string | null
                    author?: string | null
                    category?: string
                    tags?: string[] | null
                    featured_image?: string | null
                    published?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}

export type DebtType =
    | 'credit_card'
    | 'student_loan'
    | 'personal'
    | 'mortgage'
    | 'auto_loan'

export type DebtMethod =
    | 'snowball'
    | 'avalanche'
    | 'consolidation'
    | 'hybrid'

export type PaymentType =
    | 'regular'
    | 'extra'
    | 'minimum'

export type BlogCategory =
    | 'debt_basics'
    | 'strategies'
    | 'psychology'
    | 'success_stories'
    | 'advanced'

export interface DebtCalculation {
    method: DebtMethod
    totalDebt: number
    monthlyPayment: number
    payoffTime: number
    totalInterest: number
    monthlyBreakdown: MonthlyPayment[]
}

export interface MonthlyPayment {
    month: number
    debtId: string
    debtName: string
    payment: number
    principal: number
    interest: number
    remainingBalance: number
}

export interface DebtSummary {
    totalDebt: number
    monthlyMinimum: number
    availableExtra: number
    averageInterestRate: number
    highestInterestDebt: string
    lowestBalanceDebt: string
    estimatedPayoffDate: string
}

export interface AssessmentData {
    // Step 1: Psychological Assessment
    stressLevel: number
    financialAnxiety: number
    confidenceLevel: number

    // Step 2: Debt Inventory
    debts: Array<{
        name: string
        type: DebtType
        balance: number
        interestRate: number
        minimumPayment: number
        dueDate: string
    }>

    // Step 3: Financial Capacity
    monthlyIncome: number
    monthlyExpenses: number
    extraPaymentCapacity: number

    // Step 4: Strategy Preferences
    preferredMethod?: DebtMethod
    targetPayoffDate?: string
}

export interface UserProfile {
    id: string
    email: string
    hasCompletedAssessment: boolean
    currentDebtTotal: number
    monthlyPaymentCapacity: number
    recommendedStrategy: DebtMethod
    stressLevel: number
    joinedAt: string
    lastActiveAt: string
}

export interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
    sessionId: string
}

export interface ProgressMilestone {
    id: string
    type: 'debt_paid_off' | 'milestone_reached' | 'strategy_changed'
    title: string
    description: string
    achievedAt: string
    celebrationShown: boolean
} 