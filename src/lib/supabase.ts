import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Use your actual Supabase configuration
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://todrjyvusqkucpaxtqwt.supabase.co').trim()
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key').trim()

// Validate URL format
const isValidSupabaseUrl = supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co')

console.log('Supabase environment check:', {
    url: supabaseUrl,
    urlLength: supabaseUrl.length,
    keyLength: supabaseAnonKey.length,
    hasRealCredentials: supabaseUrl !== 'https://demo.supabase.co' && supabaseAnonKey !== 'demo-key',
    fullUrl: supabaseUrl,
    urlEndsCorrectly: supabaseUrl.endsWith('.supabase.co'),
    isValidUrl: isValidSupabaseUrl
})

// Create client - always create it for auth to work
export const supabase = (() => {
    try {
        console.log('Creating Supabase client with URL:', supabaseUrl)

        // Always create the client for authentication to work properly
        const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
            },
            realtime: {
                params: {
                    eventsPerSecond: 10,
                },
            },
            global: {
                headers: {
                    'x-application-name': 'debtrix'
                }
            }
        })

        // Test the connection (don't return null on failure, just log)
        client.from('debts').select('id').limit(1).then(
            () => console.log('Supabase client created and connected successfully'),
            (error) => {
                console.warn('Supabase connection test failed (this is OK for demo users):', error)
            }
        )

        return client
    } catch (error) {
        console.error('Error creating Supabase client:', error)
        // Still return a client even if there's an error for auth to work
        try {
            return createClient<Database>(supabaseUrl, supabaseAnonKey)
        } catch (fallbackError) {
            console.error('Fallback client creation failed:', fallbackError)
            return null
        }
    }
})()

// In-memory storage for demo mode with localStorage persistence
const DEMO_STORAGE_KEY = 'debtrix_demo_data'

// Initialize demo data from localStorage or use defaults
const initializeDemoData = () => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(DEMO_STORAGE_KEY)
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                return {
                    debts: parsed.debts || [],
                    assessment: parsed.assessment || null,
                    progress: parsed.progress || []
                }
            } catch (error) {
                console.error('Error parsing stored demo data:', error)
            }
        }
    }

    // Default demo data
    return {
        debts: [
            {
                id: 'demo-1',
                user_id: 'demo-user',
                debt_name: 'Credit Card',
                debt_type: 'credit_card',
                current_balance: 5000,
                original_balance: 6000,
                minimum_payment: 150,
                interest_rate: 18.99,
                due_date: '2024-01-15',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 'demo-2',
                user_id: 'demo-user',
                debt_name: 'Student Loan',
                debt_type: 'student_loan',
                current_balance: 25000,
                original_balance: 30000,
                minimum_payment: 300,
                interest_rate: 6.5,
                due_date: '2024-01-20',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ],
        assessment: null,
        progress: [
            {
                id: 'demo-progress-1',
                user_id: 'demo-user',
                debt_id: 'demo-1',
                payment_amount: 200,
                payment_date: '2024-01-01',
                payment_type: 'regular',
                balance_after: 4800,
                notes: null,
                created_at: new Date().toISOString()
            }
        ]
    }
}

// Save demo data to localStorage
const saveDemoData = (data: { debts: any[], assessment: any, progress: any[] }) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data))
    }
}

// Initialize demo data
const demoData = initializeDemoData()
const demoDebts: Database['public']['Tables']['debts']['Row'][] = demoData.debts
let demoAssessment: Database['public']['Tables']['debt_assessment']['Row'] | null = demoData.assessment
const demoProgress: Database['public']['Tables']['progress_tracking']['Row'][] = demoData.progress

// Helper functions for database operations
export const debtOperations = {
    // Test database connectivity
    async testConnection() {
        if (!supabase) {
            return { success: false, error: 'No Supabase client available' }
        }

        try {
            console.log('Testing database connection...')

            // Try a simple query to test the connection
            const { data, error } = await supabase
                .from('debts')
                .select('id')
                .limit(1)

            if (error) {
                // If debts table doesn't exist, that's OK - connection is working
                if (error.code === 'PGRST106' || error.message.includes('relation') || error.message.includes('does not exist')) {
                    console.log('Database connection successful (table not found is expected)')
                    return { success: true, data: null }
                }

                console.log('Database connection test failed:', error)
                return {
                    success: false,
                    error: error.message,
                    details: error
                }
            }

            console.log('Database connection successful')
            return { success: true, data }
        } catch (err) {
            console.error('Database connection test exception:', err)
            return {
                success: false,
                error: (err as Error)?.message || 'Connection test failed',
                details: err
            }
        }
    },

    // Get all debts for a user
    async getUserDebts(userId: string) {
        console.log('getUserDebts called with userId:', userId)
        console.log('supabase client available:', !!supabase)

        // Check if user ID is explicitly demo format (only demo users should get demo data)
        if (userId?.startsWith('demo-') || userId?.startsWith('local-')) {
            console.log('Demo mode: returning demo debts for demo user:', userId)
            // Return demo debts with the current user's ID
            return demoDebts.map(debt => ({
                ...debt,
                user_id: userId
            }))
        }

        // If no supabase client but user is NOT a demo user, return empty array
        if (!supabase) {
            console.log('No Supabase client available for real user, returning empty array')
            return []
        }

        try {
            console.log('Attempting to query debts table...')
            const { data, error } = await supabase
                .from('debts')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Supabase error:', error)

                // Handle specific error cases
                if (error.code === 'PGRST106' || error.message.includes('relation') || error.message.includes('does not exist')) {
                    console.log('Debts table not found, returning empty array')
                    return []
                }

                if (error.code === 'PGRST301' || error.message.includes('JWT')) {
                    console.log('Authentication error, returning empty array')
                    return []
                }

                // For network errors, return empty array instead of throwing
                if (error.message.includes('fetch') || error.message.includes('network')) {
                    console.log('Network error, returning empty array')
                    return []
                }

                throw error
            }

            return data || []
        } catch (err) {
            console.error('Exception in getUserDebts:', err)

            // For any error, return empty array instead of throwing
            return []
        }
    },

    // Create a new debt
    async createDebt(debt: Database['public']['Tables']['debts']['Insert']) {
        console.log('=== CREATE DEBT DEBUG ===')
        console.log('Supabase client exists:', !!supabase)
        console.log('User ID being used:', debt.user_id)
        console.log('Is demo user:', debt.user_id?.startsWith('demo-'))

        // Handle demo users first (regardless of Supabase availability)
        if (debt.user_id?.startsWith('demo-') || debt.user_id?.startsWith('local-')) {
            console.log('Demo user: creating debt in demo mode')
            const newDebt = {
                ...debt,
                id: 'demo-debt-' + Date.now(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            } as Database['public']['Tables']['debts']['Row']
            demoDebts.push(newDebt)

            // Save to localStorage
            saveDemoData({ debts: demoDebts, assessment: demoAssessment, progress: demoProgress })

            console.log('Demo debt created:', newDebt)
            return newDebt
        }

        // Handle real users
        if (!supabase) {
            throw new Error('Database connection not available for real users')
        }

        console.log('Real user: attempting to insert into Supabase debts table...')

        try {
            const { data, error } = await supabase
                .from('debts')
                .insert(debt)
                .select()
                .single()

            console.log('Supabase insert response:', { data, error })

            if (error) {
                console.error('Supabase insert error:', error.message, 'Code:', error.code)
                throw new Error(`Database error: ${error.message}`)
            }

            console.log('Real debt created successfully:', data)
            return data
        } catch (err: any) {
            console.error('Exception during debt creation:', err?.message || err)
            throw new Error(err instanceof Error ? err.message : 'Failed to create debt')
        }
    },

    // Update a debt
    async updateDebt(id: string, updates: Database['public']['Tables']['debts']['Update']) {
        if (!supabase) {
            // Demo mode: update in demo array
            const index = demoDebts.findIndex(debt => debt.id === id)
            if (index !== -1) {
                demoDebts[index] = { ...demoDebts[index], ...updates, updated_at: new Date().toISOString() }

                // Save to localStorage
                saveDemoData({ debts: demoDebts, assessment: demoAssessment, progress: demoProgress })

                return demoDebts[index]
            }
            throw new Error('Debt not found')
        }

        const { data, error } = await supabase
            .from('debts')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    // Delete a debt
    async deleteDebt(id: string) {
        console.log('Deleting debt:', id)

        // Handle demo debts
        if (id.startsWith('demo-')) {
            const index = demoDebts.findIndex(debt => debt.id === id)
            if (index !== -1) {
                demoDebts.splice(index, 1)
                saveDemoData({ debts: demoDebts, assessment: demoAssessment, progress: demoProgress })
                console.log('Demo debt deleted:', id)
                return { success: true }
            }
            throw new Error('Demo debt not found')
        }

        // Handle real debts
        if (!supabase) {
            throw new Error('Database connection not available')
        }

        try {
            const { error } = await supabase
                .from('debts')
                .delete()
                .eq('id', id)

            if (error) {
                console.error('Error deleting debt:', error)
                throw new Error(`Database error: ${error.message}`)
            }

            console.log('Real debt deleted:', id)
            return { success: true }
        } catch (err) {
            console.error('Exception in deleteDebt:', err)
            throw new Error(err instanceof Error ? err.message : 'Failed to delete debt')
        }
    },
}

export const assessmentOperations = {
    // Get user assessment
    async getUserAssessment(userId: string) {
        // Check if user ID is explicitly demo format (only demo users should get demo data)
        if (userId?.startsWith('demo-') || userId?.startsWith('local-')) {
            // Demo mode: return demo assessment with correct user ID
            if (demoAssessment) {
                return {
                    ...demoAssessment,
                    user_id: userId
                }
            }
            return null
        }

        // If no supabase client but user is NOT a demo user, return null
        if (!supabase) {
            console.log('No Supabase client available for real user assessment')
            return null
        }

        try {
            const { data, error } = await supabase
                .from('debt_assessment')
                .select('*')
                .eq('user_id', userId)
                .single()

            if (error) {
                // Handle both "no rows" and "table doesn't exist" errors
                if (error.code === 'PGRST116' || error.code === 'PGRST106' || error.message.includes('relation') || error.message.includes('does not exist')) {
                    console.log('Assessment table not found or no data, returning null')
                    return null
                }

                // Create proper Error object
                const properError = new Error(error.message || 'Failed to fetch assessment')
                properError.name = 'SupabaseError'
                throw properError
            }
            return data
        } catch (err) {
            console.error('Exception in getUserAssessment:', err)

            // If it's a database connection error, return null for demo mode
            const errorObj = err as any;
            if (err && typeof err === 'object' &&
                (errorObj.message?.includes('fetch') ||
                    errorObj.code === 'PGRST106' ||
                    errorObj.message?.includes('relation') ||
                    errorObj.message?.includes('does not exist'))) {

                console.log('Assessment table connection issue, returning null for demo mode')
                return null
            }

            // Ensure we always throw a proper Error object
            if (err instanceof Error) {
                throw err
            } else {
                const errorMessage = typeof err === 'string' ? err :
                    err && typeof err === 'object' && errorObj.message ? errorObj.message :
                        'Unknown error occurred while fetching assessment'
                const properError = new Error(errorMessage)
                properError.name = 'DatabaseError'
                throw properError
            }
        }
    },

    // Create or update assessment
    async upsertAssessment(assessment: Database['public']['Tables']['debt_assessment']['Insert']) {
        console.log('=== UPSERT ASSESSMENT DEBUG ===')
        console.log('User ID:', assessment.user_id)
        console.log('Is demo user:', assessment.user_id?.startsWith('demo-'))

        // Handle demo users first (regardless of Supabase availability)
        if (assessment.user_id?.startsWith('demo-') || assessment.user_id?.startsWith('local-')) {
            console.log('Demo user: saving assessment in demo mode')
            demoAssessment = {
                ...assessment,
                id: 'demo-assessment-' + Date.now(),
                financial_knowledge: assessment.financial_knowledge || 'beginner',
                available_for_debt: assessment.available_for_debt || 0,
                emergency_fund: assessment.emergency_fund || null,
                debt_consolidation_interest: assessment.debt_consolidation_interest || false,
                primary_goal: assessment.primary_goal || 'balanced_approach',
                preferred_strategy: assessment.preferred_strategy || null,
                risk_tolerance: assessment.risk_tolerance || 'medium',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            } as Database['public']['Tables']['debt_assessment']['Row']

            // Save to localStorage
            saveDemoData({ debts: demoDebts, assessment: demoAssessment, progress: demoProgress })

            console.log('Demo assessment saved:', demoAssessment)
            return demoAssessment
        }

        // Handle real users
        if (!supabase) {
            throw new Error('Database connection not available for real users')
        }

        console.log('Real user: attempting to save assessment to Supabase...')

        try {
            const { data, error } = await supabase
                .from('debt_assessment')
                .upsert(assessment, { onConflict: 'user_id' })
                .select()
                .single()

            if (error) {
                console.error('Supabase assessment error:', error)
                throw new Error(`Database error: ${error.message}`)
            }

            console.log('Real assessment saved successfully:', data)
            return data
        } catch (err) {
            console.error('Exception during assessment save:', err)
            throw new Error(err instanceof Error ? err.message : 'Failed to save assessment')
        }
    },
}

export const progressOperations = {
    // Get payment history for a debt
    async getDebtProgress(debtId: string) {
        if (!supabase) {
            // Demo mode: return demo progress for this debt
            return demoProgress.filter(progress => progress.debt_id === debtId)
        }

        const { data, error } = await supabase
            .from('progress_tracking')
            .select('*')
            .eq('debt_id', debtId)
            .order('payment_date', { ascending: false })

        if (error) throw error
        return data
    },

    // Record a payment
    async recordPayment(payment: Database['public']['Tables']['progress_tracking']['Insert']) {
        if (!supabase) {
            // Demo mode: add to demo array
            const newProgress = {
                ...payment,
                id: 'demo-progress-' + Date.now(),
                payment_type: payment.payment_type || 'regular',
                notes: payment.notes || null,
                created_at: new Date().toISOString()
            } as Database['public']['Tables']['progress_tracking']['Row']
            demoProgress.push(newProgress)
            return newProgress
        }

        const { data, error } = await supabase
            .from('progress_tracking')
            .insert(payment)
            .select()
            .single()

        if (error) throw error
        return data
    },

    // Get user's overall progress
    async getUserProgress(userId: string) {
        // Check if user ID is explicitly demo format (only demo users should get demo data)
        if (userId?.startsWith('demo-') || userId?.startsWith('local-')) {
            // Demo mode: return demo progress with correct user ID
            return demoProgress.map(progress => ({
                ...progress,
                user_id: userId
            }))
        }

        // If no supabase client but user is NOT a demo user, return empty array
        if (!supabase) {
            console.log('No Supabase client available for real user progress')
            return []
        }

        try {
            const { data, error } = await supabase
                .from('progress_tracking')
                .select(`
            *,
            debts:debt_id (
              debt_name,
              debt_type,
              current_balance
            )
          `)
                .eq('user_id', userId)
                .order('payment_date', { ascending: false })

            if (error) {
                // If table doesn't exist, return empty array
                if (error.code === 'PGRST106' || error.message.includes('relation') || error.message.includes('does not exist')) {
                    console.log('Progress tracking table not found, returning empty array')
                    return []
                }

                // Create proper Error object
                const properError = new Error(error.message || 'Failed to fetch progress data')
                properError.name = 'SupabaseError'
                throw properError
            }
            return data || []
        } catch (err) {
            console.error('Exception in getUserProgress:', err)

            // If it's a database connection error, return empty array for demo mode
            const errorObj = err as any;
            if (err && typeof err === 'object' &&
                (errorObj.message?.includes('fetch') ||
                    errorObj.code === 'PGRST106' ||
                    errorObj.message?.includes('relation') ||
                    errorObj.message?.includes('does not exist'))) {

                console.log('Progress table connection issue, returning empty array for demo mode')
                return []
            }

            // Ensure we always throw a proper Error object
            if (err instanceof Error) {
                throw err
            } else {
                const errorMessage = typeof err === 'string' ? err :
                    err && typeof err === 'object' && errorObj.message ? errorObj.message :
                        'Unknown error occurred while fetching progress'
                const properError = new Error(errorMessage)
                properError.name = 'DatabaseError'
                throw properError
            }
        }
    },
}

export const chatOperations = {
    // Get chat history
    async getChatHistory(userId: string, sessionId?: string) {
        if (!supabase) {
            // Demo mode: return empty for now
            return []
        }

        let query = supabase
            .from('chat_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true })

        if (sessionId) {
            query = query.eq('chat_session_id', sessionId)
        }

        const { data, error } = await query
        if (error) throw error
        return data
    },

    // Save chat message
    async saveChatMessage(message: Database['public']['Tables']['chat_history']['Insert']) {
        if (!supabase) {
            // Demo mode: just return success
            return {
                ...message,
                id: 'demo-chat-' + Date.now(),
                created_at: new Date().toISOString()
            }
        }

        const { data, error } = await supabase
            .from('chat_history')
            .insert(message)
            .select()
            .single()

        if (error) throw error
        return data
    },
}

export const blogOperations = {
    // Get all published blog posts
    async getPublishedPosts() {
        if (!supabase) {
            // Demo mode: return sample posts
            return [
                {
                    id: 'demo-post-1',
                    title: 'Getting Started with Debt Freedom',
                    slug: 'getting-started',
                    content: 'Learn the basics of debt elimination...',
                    excerpt: 'Start your journey to financial freedom',
                    category: 'debt_basics' as const,
                    featured_image_url: null,
                    published: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
        }

        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    // Get post by slug
    async getPostBySlug(slug: string) {
        if (!supabase) {
            // Demo mode: return sample post
            return {
                id: 'demo-post-1',
                title: 'Getting Started with Debt Freedom',
                slug: slug,
                content: 'Learn the basics of debt elimination...',
                excerpt: 'Start your journey to financial freedom',
                category: 'debt_basics' as const,
                featured_image_url: null,
                published: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        }

        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .eq('published', true)
            .single()

        if (error) throw error
        return data
    },

    // Get posts by category
    async getPostsByCategory(category: Database['public']['Tables']['blog_posts']['Row']['category']) {
        if (!supabase) {
            // Demo mode: return empty for now
            return []
        }

        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('category', category)
            .eq('published', true)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },
}

// Auth helpers
export const authHelpers = {
    // Get current user
    async getCurrentUser() {
        if (!supabase) {
            // Demo mode: check localStorage for demo user
            if (typeof window !== 'undefined') {
                const storedUser = localStorage.getItem('debtrix_user')
                if (storedUser) {
                    try {
                        return JSON.parse(storedUser)
                    } catch (error) {
                        console.error('Error parsing stored user:', error)
                        localStorage.removeItem('debtrix_user')
                    }
                }
            }
            return null
        }

        try {
            console.log('Attempting to get user from Supabase...')
            const { data: { user }, error } = await supabase.auth.getUser()

            console.log('Supabase getUser response:', { user: user?.email, error: error?.message })

            // If there's an auth session missing error, just return null
            if (error && (error.message.includes('Auth session missing') || error.message.includes('session_not_found'))) {
                console.log('No active session found')
                return null
            }

            if (error) {
                console.error('Supabase auth error:', error)
                // For network errors, return null instead of throwing
                if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
                    console.log('Network error detected, returning null')
                    return null
                }
                throw error
            }

            console.log('Successfully retrieved user:', user?.email)
            return user
        } catch (error: any) {
            console.error('Exception in getCurrentUser:', error)

            // Handle auth session missing errors gracefully
            if (error.message && error.message.includes('Auth session missing')) {
                return null
            }

            // Handle network/fetch errors gracefully
            if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('fetch'))) {
                console.log('Network error in getCurrentUser, returning null')
                return null
            }

            // For other errors, return null instead of throwing to prevent crashes
            console.log('Unknown error in getCurrentUser, returning null to prevent crash')
            return null
        }
    },

    // Sign up - Support both real Supabase and demo mode
    async signUp(email: string, password: string) {
        console.log('=== SIGN UP DEBUG ===')
        console.log('Supabase client exists:', !!supabase)
        console.log('Email:', email)

        // First try real Supabase if available
        if (supabase) {
            try {
                console.log('Attempting real Supabase signup...')
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                })

                if (error) {
                    console.error('Supabase signup error:', error)
                    throw error
                }

                console.log('Real Supabase signup successful')
                return data
            } catch (error) {
                console.error('Real signup failed:', error)
                throw error
            }
        }

        // Fallback to demo mode if no Supabase client
        console.log('Demo mode: Creating mock user for signup')
        const mockUser = {
            id: `demo-${email.replace('@', '-').replace('.', '-')}-${Date.now()}`,
            email,
            created_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            role: 'authenticated'
        }

        // Store in localStorage for persistence
        if (typeof window !== 'undefined') {
            localStorage.setItem('debtrix_user', JSON.stringify(mockUser))
        }

        return {
            user: mockUser,
            session: {
                access_token: 'demo-token',
                refresh_token: 'demo-refresh',
                expires_in: 3600,
                token_type: 'bearer',
                user: mockUser
            }
        }
    },

    // Sign in - Support both real Supabase and demo mode
    async signIn(email: string, password: string) {
        console.log('=== SIGN IN DEBUG ===')
        console.log('Supabase client exists:', !!supabase)
        console.log('Email:', email)

        // First try real Supabase if available
        if (supabase) {
            try {
                console.log('Attempting real Supabase signin...')
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (error) {
                    console.error('Supabase signin error:', error)
                    throw error
                }

                console.log('Real Supabase signin successful:', data.user?.email)

                // Also store in localStorage for consistency
                if (typeof window !== 'undefined' && data.user) {
                    localStorage.setItem('debtrix_user', JSON.stringify(data.user))
                }

                return data
            } catch (error) {
                console.error('Real signin failed:', error)
                throw error
            }
        }

        // Fallback to demo mode if no Supabase client
        console.log('Demo mode: Creating mock user for signin')
        const mockUser = {
            id: `demo-${email.replace('@', '-').replace('.', '-')}`,
            email,
            created_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            role: 'authenticated'
        }

        // Store in localStorage for persistence
        if (typeof window !== 'undefined') {
            localStorage.setItem('debtrix_user', JSON.stringify(mockUser))
        }

        return {
            user: mockUser,
            session: {
                access_token: 'demo-token',
                refresh_token: 'demo-refresh',
                expires_in: 3600,
                token_type: 'bearer',
                user: mockUser
            }
        }
    },

    // Sign out
    async signOut() {
        if (!supabase) {
            // Demo mode: clear localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('debtrix_user')
            }
            return
        }

        const { error } = await supabase.auth.signOut()
        if (error) throw error
    },

    // Reset password
    async resetPassword(email: string) {
        if (!supabase) {
            throw new Error('Demo mode: Authentication not available')
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
        })
        if (error) throw error
    },
}

// Real-time subscriptions
export const subscriptions = {
    // Subscribe to debt changes
    subscribeToDebts(userId: string, callback: (payload: any) => void) {
        if (!supabase) {
            // Demo mode: return mock subscription
            return { unsubscribe: () => { } }
        }

        return supabase
            .channel('debts-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'debts',
                    filter: `user_id=eq.${userId}`,
                },
                callback
            )
            .subscribe()
    },

    // Subscribe to progress changes
    subscribeToProgress(userId: string, callback: (payload: any) => void) {
        if (!supabase) {
            // Demo mode: return mock subscription
            return { unsubscribe: () => { } }
        }

        return supabase
            .channel('progress-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'progress_tracking',
                    filter: `user_id=eq.${userId}`,
                },
                callback
            )
            .subscribe()
    },
}

export async function addDebt(debtData: Omit<Database['public']['Tables']['debts']['Row'], 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Database['public']['Tables']['debts']['Row']> {
    const user = await authHelpers.getCurrentUser()
    if (!user) {
        throw new Error('User not authenticated')
    }

    return await debtOperations.createDebt({
        ...debtData,
        user_id: user.id
    })
}

export async function updateDebt(id: string, updates: Partial<Database['public']['Tables']['debts']['Row']>): Promise<Database['public']['Tables']['debts']['Row']> {
    return await debtOperations.updateDebt(id, updates)
}

export async function addProgress(progressData: Omit<Database['public']['Tables']['progress_tracking']['Row'], 'id' | 'user_id' | 'created_at'>): Promise<Database['public']['Tables']['progress_tracking']['Row']> {
    const user = await authHelpers.getCurrentUser()
    if (!user) {
        throw new Error('User not authenticated')
    }

    return await progressOperations.recordPayment({
        ...progressData,
        user_id: user.id
    })
}

export async function updateProgress(id: string, updates: Partial<Database['public']['Tables']['progress_tracking']['Row']>): Promise<Database['public']['Tables']['progress_tracking']['Row']> {
    // Note: This function needs to be implemented in progressOperations
    // For now, throw an error with helpful message
    throw new Error('updateProgress functionality needs to be implemented in progressOperations')
}

// Reset demo data to defaults
export const resetDemoData = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(DEMO_STORAGE_KEY)
        // Reinitialize with defaults
        const defaultData = initializeDemoData()
        demoDebts.length = 0
        demoDebts.push(...defaultData.debts)
        demoAssessment = defaultData.assessment
        demoProgress.length = 0
        demoProgress.push(...defaultData.progress)
    }
} 