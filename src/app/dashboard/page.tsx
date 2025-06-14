'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
    TrendingDown,
    Target,
    DollarSign,
    Calendar,
    Trophy,
    Plus,
    MessageSquare,
    BookOpen,
    Menu,
    X,
    Edit,
    Trash2,
    Calculator
} from 'lucide-react'
import { debtOperations, assessmentOperations, authHelpers } from '@/lib/supabase'
import { DebtCalculator } from '@/lib/debt-calculator'
import { Database, DebtType, DebtMethod } from '@/types/database'

type Debt = Database['public']['Tables']['debts']['Row']
type Assessment = Database['public']['Tables']['debt_assessment']['Row']
type ProgressEntry = Database['public']['Tables']['progress_tracking']['Row']

interface DebtFormData {
    debt_name: string
    debt_type: DebtType
    current_balance: number
    interest_rate: number
    minimum_payment: number
    due_date: string
}

export default function DashboardPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [user, setUser] = useState<{ id: string; email: string; app_metadata: Record<string, unknown>; user_metadata: Record<string, unknown>; aud: string; created_at: string } | null>(null)
    const [debts, setDebts] = useState<Debt[]>([])
    const [assessment, setAssessment] = useState<Assessment | null>(null)
    const [recentProgress, setRecentProgress] = useState<ProgressEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [dataLoading, setDataLoading] = useState({
        debts: false,
        assessment: false,
        progress: false,
        calculations: false
    })
    const [selectedStrategy, setSelectedStrategy] = useState<DebtMethod>('snowball')
    const [extraPayment, setExtraPayment] = useState(0)
    const [calculation, setCalculation] = useState<{ totalDebt: number; totalInterest: number; payoffTime: number; monthlyPayment: number; strategy: DebtMethod; paymentPlan: Array<{ month: number; payment: number; balance: number; interest: number }> } | null>(null)
    const [errors, setErrors] = useState<string[]>([])

    // Add Debt Form
    const [addDebtOpen, setAddDebtOpen] = useState(false)
    const [debtForm, setDebtForm] = useState<DebtFormData>({
        debt_name: '',
        debt_type: 'credit_card',
        current_balance: 0,
        interest_rate: 0,
        minimum_payment: 0,
        due_date: new Date().toISOString().split('T')[0]
    })

    const calculateDebtStrategy = useCallback(() => {
        if (debts.length === 0) {
            setCalculation(null)
            return
        }

        try {
            // Filter out invalid debts and prepare inputs
            const validDebts = debts.filter(debt =>
                debt.current_balance > 0 &&
                debt.minimum_payment > 0 &&
                debt.interest_rate >= 0
            )

            if (validDebts.length === 0) {
                setCalculation(null)
                return
            }

            const calculator = new DebtCalculator()
            const result = calculator.calculatePayoffPlan(validDebts, selectedStrategy, extraPayment)
            setCalculation(result)
        } catch (error: unknown) {
            console.error('Error calculating debt strategy:', error)
            setCalculation(null)
        }
    }, [debts, selectedStrategy, extraPayment])

    // Load user data on mount
    useEffect(() => {
        loadUserData()

        // Check if coming from assessment (client-side only)
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search)
            if (urlParams.get('assessment') === 'completed') {
                setTimeout(() => {
                    alert('🎉 Assessment completed! Your debts and strategy have been automatically set up.')
                }, 1000)
            }
        }
    }, [])

    // Recalculate when debts, strategy, or extra payment changes
    useEffect(() => {
        calculateDebtStrategy()
    }, [calculateDebtStrategy])

    const addError = (message: string) => {
        setErrors(prev => [...prev, message])
        setTimeout(() => {
            setErrors(prev => prev.filter(err => err !== message))
        }, 5000)
    }

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border-2 border-[#00FF41] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-400">Loading...</span>
            </div>
        </div>
    )

    const loadUserData = async () => {
        try {
            setLoading(true)
            setErrors([])

            // Get current user - prioritize Supabase auth with proper error handling
            let currentUser = null

            // First check Supabase auth with comprehensive error handling
            try {
                console.log('Attempting to get current user from Supabase...')
                currentUser = await authHelpers.getCurrentUser()
                if (currentUser) {
                    console.log('User authenticated via Supabase:', currentUser.email)
                } else {
                    console.log('No Supabase user found, checking alternatives...')
                }
            } catch (supabaseError: unknown) {
                console.log('Supabase auth check failed:', supabaseError instanceof Error ? supabaseError.message : supabaseError)
                // Don't throw here, just log and continue to fallbacks
            }

            // Check local storage as fallback
            if (!currentUser && typeof window !== 'undefined') {
                const localUser = localStorage.getItem('debtrix_user')
                if (localUser) {
                    try {
                        currentUser = JSON.parse(localUser)
                        console.log('Using local user:', currentUser.email)
                    } catch (e) {
                        console.error('Error parsing local user:', e)
                        localStorage.removeItem('debtrix_user')
                    }
                }
            }

            // Demo mode fallback
            if (!currentUser) {
                // Check if user wants to access demo mode (client-side only)
                let isDemo = false
                if (typeof window !== 'undefined') {
                    isDemo = new URLSearchParams(window.location.search).get('demo') === 'true'
                }

                if (isDemo) {
                    // Generate a proper UUID for demo user
                    const generateUUID = () => {
                        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            const r = Math.random() * 16 | 0;
                            const v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });
                    }

                    // Create demo user for demonstration
                    currentUser = {
                        id: generateUUID(),
                        email: 'demo@debtrix.com',
                        app_metadata: {},
                        user_metadata: {},
                        aud: '',
                        created_at: new Date().toISOString()
                    }
                    console.log('Using demo user with UUID:', currentUser.id)
                } else {
                    // Redirect to auth page for real users
                    console.log('No authenticated user found, redirecting to auth')
                    if (typeof window !== 'undefined') {
                        window.location.href = '/auth'
                    }
                    return
                }
            }
            setUser(currentUser)

            // Safely load user data with error handling
            const userId = currentUser.id
            console.log('Loading data for user:', userId)

            // Load all data concurrently with proper error handling
            const results = await Promise.allSettled([
                debtOperations.getUserDebts(userId),
                assessmentOperations.getAssessment(userId)
            ])

            // Handle debts result
            if (results[0].status === 'fulfilled') {
                setDebts(results[0].value || [])
                console.log('Debts loaded:', results[0].value?.length || 0)
            } else {
                console.error('Failed to load debts:', results[0].reason)
                setDebts([])
            }

            // Handle assessment result
            if (results[1].status === 'fulfilled') {
                setAssessment(results[1].value)
                console.log('Assessment loaded:', !!results[1].value)
                if (results[1].value?.recommended_method) {
                    setSelectedStrategy(results[1].value.recommended_method)
                }
                if (results[1].value?.extra_payment_capacity) {
                    setExtraPayment(results[1].value.extra_payment_capacity)
                }
            } else {
                console.error('Failed to load assessment:', results[1].reason)
                setAssessment(null)
            }

        } catch (error: unknown) {
            console.error('Error loading user data:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            console.error('Dashboard load error:', errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleAddDebt = async () => {
        try {
            if (!user) {
                throw new Error('User not authenticated')
            }

            const newDebt = {
                user_id: user.id,
                ...debtForm,
                original_balance: debtForm.current_balance
            }

            console.log('Adding debt:', newDebt)
            const addedDebt = await debtOperations.createDebt(newDebt)
            console.log('Debt added successfully:', addedDebt)

            // Refresh debts list
            const updatedDebts = await debtOperations.getUserDebts(user.id)
            setDebts(updatedDebts || [])

            // Reset form and close dialog
            setDebtForm({
                debt_name: '',
                debt_type: 'credit_card',
                current_balance: 0,
                interest_rate: 0,
                minimum_payment: 0,
                due_date: new Date().toISOString().split('T')[0]
            })
            setAddDebtOpen(false)

        } catch (error: unknown) {
            console.error('Error adding debt:', error)
            alert('Failed to add debt. Please try again.')
        }
    }

    const handleDeleteDebt = async (debtId: string) => {
        try {
            if (!user) return

            await debtOperations.deleteDebt(debtId)
            const updatedDebts = await debtOperations.getUserDebts(user.id)
            setDebts(updatedDebts || [])
        } catch (error: unknown) {
            console.error('Error deleting debt:', error)
            alert('Failed to delete debt. Please try again.')
        }
    }

    const getStrategyOrder = (strategy: DebtMethod) => {
        switch (strategy) {
            case 'snowball':
                return [...debts].sort((a, b) => a.current_balance - b.current_balance)
            case 'avalanche':
                return [...debts].sort((a, b) => b.interest_rate - a.interest_rate)
            case 'hybrid':
                // Hybrid: Small debts first (under $1000), then highest interest
                const smallDebts = debts.filter(d => d.current_balance < 1000).sort((a, b) => a.current_balance - b.current_balance)
                const largeDebts = debts.filter(d => d.current_balance >= 1000).sort((a, b) => b.interest_rate - a.interest_rate)
                return [...smallDebts, ...largeDebts]
            default:
                return debts
        }
    }

    const getDebtTypeDisplay = (type: DebtType) => {
        const typeMap = {
            'credit_card': 'Credit Card',
            'personal_loan': 'Personal Loan',
            'student_loan': 'Student Loan',
            'auto_loan': 'Auto Loan',
            'mortgage': 'Mortgage',
            'other': 'Other'
        }
        return typeMap[type] || type
    }

    const getProgressColor = (debt: Debt) => {
        const progress = ((debt.original_balance - debt.current_balance) / debt.original_balance) * 100
        if (progress >= 75) return 'bg-green-500'
        if (progress >= 50) return 'bg-yellow-500'
        if (progress >= 25) return 'bg-orange-500'
        return 'bg-red-500'
    }

    const totalDebt = debts.reduce((sum, debt) => sum + debt.current_balance, 0)
    const totalMinPayments = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0)
    const totalOriginalDebt = debts.reduce((sum, debt) => sum + debt.original_balance, 0)
    const overallProgress = totalOriginalDebt > 0 ? ((totalOriginalDebt - totalDebt) / totalOriginalDebt) * 100 : 0

    const strategyDebts = getStrategyOrder(selectedStrategy)

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Loading your debt dashboard...</div>
            </div>
        )
    }

    // Main loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-[#00FF41]/30 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-[#00FF41] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Loading <span className="text-[#00FF41]">Dashboard</span>
                    </h2>
                    <p className="text-gray-400 animate-pulse">
                        Preparing your financial data...
                    </p>
                </div>
            </div>
        )
    }

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
                            <Link href="/dashboard" className="text-white font-medium">Dashboard</Link>
                            <Link href="/chat" className="text-gray-300 hover:text-white">AI Coach</Link>
                            <Link href="/learn" className="text-gray-300 hover:text-white">Learn</Link>
                            <Link href="/assessment" className="text-gray-300 hover:text-white">Assessment</Link>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="hidden md:flex items-center space-x-2">
                                {user && (
                                    <span className="text-gray-400 text-sm">
                                        {user.email}
                                    </span>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-300"
                                    onClick={async () => {
                                        try {
                                            await authHelpers.signOut()
                                            if (typeof window !== 'undefined') {
                                                window.location.href = '/'
                                            }
                                        } catch (error) {
                                            console.error('Error signing out:', error)
                                        }
                                    }}
                                >
                                    Sign Out
                                </Button>
                            </div>
                            <div className="md:hidden">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="text-gray-300 hover:text-white hover:bg-gray-800 p-2"
                                >
                                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50">
                            <div className="container mx-auto px-6 py-4">
                                <div className="flex flex-col space-y-4">
                                    <Link href="/dashboard" className="text-white font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                                    <Link href="/chat" className="text-gray-300 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>AI Coach</Link>
                                    <Link href="/learn" className="text-gray-300 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>Learn</Link>
                                    <Link href="/assessment" className="text-gray-300 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>Assessment</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <div className="pt-20 pb-12">
                <div className="container mx-auto px-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-semibold text-white mb-2">
                                {debts.length === 0 ? 'Welcome to Your Debt Dashboard' : 'Your Debt Freedom Journey'}
                            </h1>
                            <p className="text-gray-400">
                                {debts.length === 0 ? 'Add your first debt to get started' : 'Track your progress to financial freedom'}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3 mt-4 md:mt-0">
                            <Dialog open={addDebtOpen} onOpenChange={setAddDebtOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="border-green-500 text-green-400 hover:bg-green-500/10"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Debt
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-800 border-gray-700 text-white">
                                    <DialogHeader>
                                        <DialogTitle>Add New Debt</DialogTitle>
                                        <DialogDescription className="text-gray-400">
                                            Enter your debt details to add it to your elimination plan.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="debt_name">Debt Name</Label>
                                            <Input
                                                id="debt_name"
                                                value={debtForm.debt_name}
                                                onChange={(e) => setDebtForm(prev => ({ ...prev, debt_name: e.target.value }))}
                                                placeholder="e.g., Visa Credit Card"
                                                className="bg-gray-700 border-gray-600"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="debt_type">Debt Type</Label>
                                            <Select
                                                value={debtForm.debt_type}
                                                onValueChange={(value) => setDebtForm(prev => ({ ...prev, debt_type: value as DebtType }))}
                                            >
                                                <SelectTrigger className="bg-gray-700 border-gray-600">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-800 border-gray-700">
                                                    <SelectItem value="credit_card">Credit Card</SelectItem>
                                                    <SelectItem value="student_loan">Student Loan</SelectItem>
                                                    <SelectItem value="personal">Personal Loan</SelectItem>
                                                    <SelectItem value="auto_loan">Auto Loan</SelectItem>
                                                    <SelectItem value="mortgage">Mortgage</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="current_balance">Current Balance</Label>
                                                <Input
                                                    id="current_balance"
                                                    type="number"
                                                    value={debtForm.current_balance || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0
                                                        setDebtForm(prev => ({ ...prev, current_balance: value }))
                                                    }}
                                                    placeholder="5000"
                                                    min="0"
                                                    step="0.01"
                                                    className="bg-gray-700 border-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="interest_rate">Interest Rate (%)</Label>
                                                <Input
                                                    id="interest_rate"
                                                    type="number"
                                                    value={debtForm.interest_rate || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0
                                                        setDebtForm(prev => ({ ...prev, interest_rate: value }))
                                                    }}
                                                    placeholder="18.99"
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                    className="bg-gray-700 border-gray-600"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="minimum_payment">Minimum Payment</Label>
                                                <Input
                                                    id="minimum_payment"
                                                    type="number"
                                                    value={debtForm.minimum_payment || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0
                                                        setDebtForm(prev => ({ ...prev, minimum_payment: value }))
                                                    }}
                                                    placeholder="150"
                                                    min="0"
                                                    step="0.01"
                                                    className="bg-gray-700 border-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="due_date">Due Date</Label>
                                                <Input
                                                    id="due_date"
                                                    type="date"
                                                    value={debtForm.due_date}
                                                    onChange={(e) => setDebtForm(prev => ({ ...prev, due_date: e.target.value }))}
                                                    className="bg-gray-700 border-gray-600"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="outline" onClick={() => setAddDebtOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={handleAddDebt} className="bg-green-600 hover:bg-green-700">
                                                Add Debt
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Link href="/chat">
                                <Button className="bg-gradient-to-r from-green-500 to-blue-600">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    AI Coach
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {debts.length === 0 ? (
                        /* Empty State */
                        <div className="text-center py-12">
                            <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No debts added yet</h3>
                            <p className="text-gray-400 mb-6">Start by adding your first debt to create your elimination plan</p>
                            {!assessment && (
                                <Link href="/assessment">
                                    <Button className="bg-gradient-to-r from-green-500 to-blue-600">
                                        Take Assessment First
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <Card className="bg-gray-800/50 border-gray-700">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm font-medium">Total Debt</p>
                                                <p className="text-2xl font-semibold text-white">${totalDebt.toLocaleString()}</p>
                                            </div>
                                            <DollarSign className="w-8 h-8 text-red-400" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gray-800/50 border-gray-700">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm font-medium">Monthly Payments</p>
                                                <p className="text-2xl font-semibold text-white">${totalMinPayments.toLocaleString()}</p>
                                            </div>
                                            <Calendar className="w-8 h-8 text-blue-400" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gray-800/50 border-gray-700">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm font-medium">Debt Free Date</p>
                                                <p className="text-2xl font-semibold text-white">
                                                    {calculation ? (() => {
                                                        const date = new Date()
                                                        date.setMonth(date.getMonth() + calculation.payoffTime)
                                                        return date.toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'numeric',
                                                            day: 'numeric'
                                                        })
                                                    })() : 'Calculating...'}
                                                </p>
                                            </div>
                                            <Target className="w-8 h-8 text-green-400" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gray-800/50 border-gray-700">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm font-medium">Progress</p>
                                                <p className="text-2xl font-semibold text-white">{Math.round(overallProgress)}%</p>
                                            </div>
                                            <TrendingDown className="w-8 h-8 text-purple-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Main Content */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Debt Strategy */}
                                <div className="lg:col-span-2">
                                    <Card className="bg-gray-800/50 border-gray-700">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-white">Debt Elimination Strategy</CardTitle>
                                                <Select
                                                    value={selectedStrategy}
                                                    onValueChange={(value) => setSelectedStrategy(value as DebtMethod)}
                                                >
                                                    <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white hover:bg-gray-600 focus:ring-2 focus:ring-blue-500">
                                                        <SelectValue placeholder="Select Strategy" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-gray-800 border-gray-600 text-white z-50 shadow-2xl">
                                                        <SelectItem
                                                            value="snowball"
                                                            className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                                                        >
                                                            🏔️ Debt Snowball
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="avalanche"
                                                            className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                                                        >
                                                            ⚡ Debt Avalanche
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="hybrid"
                                                            className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                                                        >
                                                            🎯 Hybrid Method
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <CardDescription className="text-gray-400">
                                                {selectedStrategy === 'snowball' && 'Pay smallest debts first for quick psychological wins'}
                                                {selectedStrategy === 'avalanche' && 'Pay highest interest debts first to save money'}
                                                {selectedStrategy === 'hybrid' && 'Balanced approach combining both strategies'}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {strategyDebts.map((debt, index) => {
                                                    const progress = ((debt.original_balance - debt.current_balance) / debt.original_balance) * 100
                                                    return (
                                                        <div key={debt.id} className="bg-gray-700/50 rounded-lg p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="flex items-center gap-3">
                                                                    <Badge
                                                                        variant={index === 0 ? "default" : "secondary"}
                                                                        className={index === 0 ? "bg-green-500 text-white" : "bg-gray-600 text-gray-300"}
                                                                    >
                                                                        {index === 0 ? 'Focus' : `#${index + 1}`}
                                                                    </Badge>
                                                                    <div>
                                                                        <h4 className="text-white font-medium">{debt.debt_name}</h4>
                                                                        <p className="text-gray-400 text-sm">{getDebtTypeDisplay(debt.debt_type)}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-white font-semibold">${debt.current_balance.toLocaleString()}</p>
                                                                    <div className="flex items-center gap-2">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-gray-400 hover:text-white p-1"
                                                                        >
                                                                            <Edit className="w-3 h-3" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => handleDeleteDebt(debt.id)}
                                                                            className="text-red-400 hover:text-red-300 p-1"
                                                                        >
                                                                            <Trash2 className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                                                                <span>Min Payment: ${debt.minimum_payment}</span>
                                                                <span>Interest: {debt.interest_rate}%</span>
                                                            </div>
                                                            <Progress value={progress} className="h-2" />
                                                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                                                <span>Progress: {Math.round(progress)}%</span>
                                                                <span>Original: ${debt.original_balance.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-green-400 font-medium">Extra Payment</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white">$</span>
                                                        <Input
                                                            type="number"
                                                            value={extraPayment}
                                                            onChange={(e) => setExtraPayment(Number(e.target.value))}
                                                            className="bg-gray-700 border-gray-600 text-white w-20 text-sm"
                                                            aria-label="Extra monthly payment amount"
                                                        />
                                                    </div>
                                                </div>
                                                {calculation && (
                                                    <p className="text-green-300 text-sm">
                                                        Adding ${extraPayment} monthly will help you become debt-free in {calculation.payoffTime} months and save ${Math.round(calculation.totalInterest)} in total interest!
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Progress Tracking */}
                                    {recentProgress.length > 0 && (
                                        <Card className="bg-gray-800/50 border-gray-700 mt-6">
                                            <CardHeader>
                                                <CardTitle className="text-white">Recent Progress</CardTitle>
                                                <CardDescription className="text-gray-400">Your latest payment activity</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {recentProgress.map((progress, index) => (
                                                        <div key={progress.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                                                            <div>
                                                                <p className="text-white font-medium">
                                                                    {new Date(progress.payment_date).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </p>
                                                                <p className="text-gray-400 text-sm">
                                                                    {progress.payment_type === 'minimum' ? 'Minimum Payment' :
                                                                        progress.payment_type === 'extra' ? 'Extra Payment' : 'Lump Sum'}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-semibold text-green-400">
                                                                    ${progress.payment_amount.toLocaleString()}
                                                                </p>
                                                                <p className="text-gray-400 text-sm">
                                                                    Balance: ${progress.remaining_balance.toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Quick Stats */}
                                    {calculation && (
                                        <Card className="bg-gray-800/50 border-gray-700">
                                            <CardHeader>
                                                <CardTitle className="text-white flex items-center gap-2">
                                                    <Calculator className="w-5 h-5 text-blue-400" />
                                                    Strategy Results
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Payoff Time:</span>
                                                        <span className="text-white font-medium">{calculation.payoffTime} months</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Total Interest:</span>
                                                        <span className="text-white font-medium">${Math.round(calculation.totalInterest).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Monthly Payment:</span>
                                                        <span className="text-white font-medium">${calculation.monthlyPayment.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Method:</span>
                                                        <span className="text-green-400 font-medium capitalize">{calculation.method}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Quick Actions */}
                                    <Card className="bg-gray-800/50 border-gray-700">
                                        <CardHeader>
                                            <CardTitle className="text-white">Quick Actions</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <Link href="/chat" className="block">
                                                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:text-white">
                                                        <MessageSquare className="w-4 h-4 mr-2" />
                                                        Ask AI Coach
                                                    </Button>
                                                </Link>
                                                <Link href="/learn" className="block">
                                                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:text-white">
                                                        <BookOpen className="w-4 h-4 mr-2" />
                                                        Learn More
                                                    </Button>
                                                </Link>
                                                {!assessment && (
                                                    <Link href="/assessment" className="block">
                                                        <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600">
                                                            <Target className="w-4 h-4 mr-2" />
                                                            Take Assessment
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Motivation */}
                                    <Card className="bg-gradient-to-br from-green-500/10 to-blue-600/10 border-green-500/20">
                                        <CardContent className="p-6">
                                            <div className="text-center">
                                                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                                                <h3 className="text-white font-semibold mb-2">Keep Going!</h3>
                                                <p className="text-gray-300 text-sm">
                                                    Every payment brings you closer to financial freedom. You&apos;ve got this!
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
} 