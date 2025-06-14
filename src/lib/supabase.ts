import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Use dummy values if env vars are not available (for demo)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key'

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

// Create client with better error handling
export const supabase = (() => {
    try {
        if (!isValidSupabaseUrl || supabaseUrl === 'https://demo.supabase.co' || supabaseAnonKey === 'demo-key') {
            console.log('Using demo mode - invalid URL or no real Supabase credentials')
            return null
        }

        console.log('Creating Supabase client with URL:', supabaseUrl)
        const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
            },
            realtime: {
                enabled: true,
            },
            global: {
                headers: {
                    'x-application-name': 'debtrix'
                }
            }
        })

        // Test the connection immediately
        client.from('debts').select('id').limit(1).then(
            () => console.log('Supabase client created and connected successfully'),
            (error) => {
                console.error('Supabase connection test failed:', error)
                return null
            }
        )

        return client
    } catch (error) {
        console.error('Error creating Supabase client:', error)
        return null
    }
})()

// In-memory storage for demo mode
const demoDebts: Database['public']['Tables']['debts']['Row'][] = [
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
]
let demoAssessment: Database['public']['Tables']['debt_assessment']['Row'] | null = null
const demoProgress: Database['public']['Tables']['progress_tracking']['Row'][] = [
    {
        id: 'demo-progress-1',
        user_id: 'demo-user',
        debt_id: 'demo-1',
        payment_amount: 200,
        payment_date: '2024-01-01',
        remaining_balance: 4800,
        created_at: new Date().toISOString()
    }
]

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
                error: err?.message || 'Connection test failed',
                details: err
            }
        }
    },

    // Get all debts for a user
    async getUserDebts(userId: string) {
        console.log('getUserDebts called with userId:', userId)
        console.log('supabase client available:', !!supabase)

        // Check if user ID is demo/local format
        if (userId?.startsWith('demo-') || userId?.startsWith('local-') || !supabase) {
            console.log('Demo mode: returning demo debts')
            return demoDebts.filter(debt => debt.user_id === userId)
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
        console.log('Debt data to insert:', debt)

        if (!supabase) {
            console.log('❌ Running in demo mode - Supabase client not available')
            // Demo mode: add to demo array
            const newDebt = {
                ...debt,
                id: 'demo-debt-' + Date.now(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            } as Database['public']['Tables']['debts']['Row']
            demoDebts.push(newDebt)
            console.log('Demo debt created:', newDebt)
            return newDebt
        }

        // Check if user is demo user with real Supabase
        if (debt.user_id?.startsWith('demo-')) {
            console.log('⚠️ Demo user with real Supabase - this might cause RLS issues')
        }

        console.log('Attempting to insert into Supabase debts table...')

        try {
            const { data, error } = await supabase
                .from('debts')
                .insert(debt)
                .select()
                .single()

            console.log('Supabase insert response:', { data, error })

            if (error) {
                console.error('Supabase insert error:', error.message, 'Code:', error.code)
                throw error
            }

            console.log('Debt created successfully:', data)
            return data
        } catch (err: any) {
            console.error('Exception during debt creation:', err?.message || err)
            throw err
        }
    },

    // Update a debt
    async updateDebt(id: string, updates: Database['public']['Tables']['debts']['Update']) {
        if (!supabase) {
            // Demo mode: update in demo array
            const index = demoDebts.findIndex(debt => debt.id === id)
            if (index !== -1) {
                demoDebts[index] = { ...demoDebts[index], ...updates, updated_at: new Date().toISOString() }
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
        if (!supabase) {
            // Demo mode: remove from demo array
            const index = demoDebts.findIndex(debt => debt.id === id)
            if (index !== -1) {
                demoDebts.splice(index, 1)
            }
            return
        }

        const { error } = await supabase
            .from('debts')
            .delete()
            .eq('id', id)

        if (error) throw error
    },
}

export const assessmentOperations = {
    // Get user assessment
    async getUserAssessment(userId: string) {
        // Check if user ID is demo/local format
        if (userId?.startsWith('demo-') || userId?.startsWith('local-') || !supabase) {
            // Demo mode: return demo assessment
            return demoAssessment && demoAssessment.user_id === userId ? demoAssessment : null
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
            if (err && typeof err === 'object' &&
                (err.message?.includes('fetch') ||
                    err.code === 'PGRST106' ||
                    err.message?.includes('relation') ||
                    err.message?.includes('does not exist'))) {

                console.log('Assessment table connection issue, returning null for demo mode')
                return null
            }

            // Ensure we always throw a proper Error object
            if (err instanceof Error) {
                throw err
            } else {
                const errorMessage = typeof err === 'string' ? err :
                    err && typeof err === 'object' && err.message ? err.message :
                        'Unknown error occurred while fetching assessment'
                const properError = new Error(errorMessage)
                properError.name = 'DatabaseError'
                throw properError
            }
        }
    },

    // Create or update assessment
    async upsertAssessment(assessment: Database['public']['Tables']['debt_assessment']['Insert']) {
        if (!supabase) {
            // Demo mode: store in demo variable
            demoAssessment = {
                ...assessment,
                id: 'demo-assessment-' + Date.now(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            } as Database['public']['Tables']['debt_assessment']['Row']
            return demoAssessment
        }

        const { data, error } = await supabase
            .from('debt_assessment')
            .upsert(assessment, { onConflict: 'user_id' })
            .select()
            .single()

        if (error) throw error
        return data
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
        // Check if user ID is demo/local format
        if (userId?.startsWith('demo-') || userId?.startsWith('local-') || !supabase) {
            // Demo mode: return demo progress for this user
            return demoProgress.filter(progress => progress.user_id === userId)
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
            if (err && typeof err === 'object' &&
                (err.message?.includes('fetch') ||
                    err.code === 'PGRST106' ||
                    err.message?.includes('relation') ||
                    err.message?.includes('does not exist'))) {

                console.log('Progress table connection issue, returning empty array for demo mode')
                return []
            }

            // Ensure we always throw a proper Error object
            if (err instanceof Error) {
                throw err
            } else {
                const errorMessage = typeof err === 'string' ? err :
                    err && typeof err === 'object' && err.message ? err.message :
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
            // Demo mode: return null (will trigger demo user creation)
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

    // Sign up
    async signUp(email: string, password: string) {
        if (!supabase) {
            throw new Error('Demo mode: Authentication not available')
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })
        if (error) throw error
        return data
    },

    // Sign in
    async signIn(email: string, password: string) {
        console.log('=== SUPABASE SIGN IN DEBUG ===')
        console.log('Supabase client exists:', !!supabase)

        if (!supabase) {
            throw new Error('Demo mode: Authentication not available')
        }

        console.log('Supabase URL:', supabaseUrl)
        console.log('Email:', email)
        console.log('Password length:', password?.length || 0)

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        console.log('Supabase auth response:', { data, error })
        if (error) throw error
        return data
    },

    // Sign out
    async signOut() {
        if (!supabase) {
            return // Demo mode: nothing to do
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
    try {
        const supabase = createClient<Database>()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data, error } = await supabase
            .from('debts')
            .insert([{
                ...debtData,
                user_id: user.id
            }])
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error: unknown) {
        console.error('Error adding debt:', error)
        throw error
    }
}

export async function updateDebt(id: string, updates: Partial<Database['public']['Tables']['debts']['Row']>): Promise<Database['public']['Tables']['debts']['Row']> {
    try {
        const supabase = createClient<Database>()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data, error } = await supabase
            .from('debts')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error: unknown) {
        console.error('Error updating debt:', error)
        throw error
    }
}

export async function addProgress(progressData: Omit<Database['public']['Tables']['progress_tracking']['Row'], 'id' | 'user_id' | 'created_at'>): Promise<Database['public']['Tables']['progress_tracking']['Row']> {
    try {
        const supabase = createClient<Database>()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data, error } = await supabase
            .from('progress_tracking')
            .insert([{
                ...progressData,
                user_id: user.id
            }])
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error: unknown) {
        console.error('Error adding progress:', error)
        throw error
    }
}

export async function updateProgress(id: string, updates: Partial<Database['public']['Tables']['progress_tracking']['Row']>): Promise<Database['public']['Tables']['progress_tracking']['Row']> {
    try {
        const supabase = createClient<Database>()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data, error } = await supabase
            .from('progress_tracking')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error: unknown) {
        console.error('Error updating progress:', error)
        throw error
    }
} 