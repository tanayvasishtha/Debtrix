'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    ArrowRight,
    DollarSign,
    Target,
    Brain,
    TrendingUp,
    CheckCircle,
    Plus,
    Minus,
    Loader2
} from 'lucide-react'
import { authHelpers, assessmentOperations, debtOperations } from '@/lib/supabase'

interface Debt {
    name: string
    balance: string
    minPayment: string
    interestRate: string
    type: string
}

interface AssessmentData {
    step1: {
        monthlyIncome: string
        monthlyExpenses: string
        financialStress: number
        debtAnxiety: number
    }
    step2: {
        debts: Debt[]
    }
    step3: {
        goals: string[]
        timeline: string
        motivation: string
    }
    step4: {
        preferredMethod: string
        riskTolerance: string
        commitmentLevel: number
    }
}

export default function AssessmentPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [assessmentData, setAssessmentData] = useState<AssessmentData>({
        step1: {
            monthlyIncome: '',
            monthlyExpenses: '',
            financialStress: 5,
            debtAnxiety: 5
        },
        step2: {
            debts: []
        },
        step3: {
            goals: [],
            timeline: '',
            motivation: ''
        },
        step4: {
            preferredMethod: '',
            riskTolerance: '',
            commitmentLevel: 5
        }
    })

    const totalSteps = 4
    const progress = (currentStep / totalSteps) * 100

    const addDebt = () => {
        setAssessmentData(prev => ({
            ...prev,
            step2: {
                debts: [...prev.step2.debts, {
                    name: '',
                    balance: '',
                    minPayment: '',
                    interestRate: '',
                    type: 'Credit Card'
                }]
            }
        }))
    }

    const removeDebt = (index: number) => {
        setAssessmentData(prev => ({
            ...prev,
            step2: {
                debts: prev.step2.debts.filter((_, i) => i !== index)
            }
        }))
    }

    const updateDebt = (index: number, field: keyof Debt, value: string) => {
        setAssessmentData(prev => ({
            ...prev,
            step2: {
                debts: prev.step2.debts.map((debt, i) =>
                    i === index ? { ...debt, [field]: value } : debt
                )
            }
        }))
    }

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true)

        try {
            // Validate required fields before proceeding
            if (!assessmentData.step1.monthlyIncome || parseFloat(assessmentData.step1.monthlyIncome) <= 0) {
                alert('Please enter a valid monthly income.')
                setIsLoading(false)
                return
            }

            if (!assessmentData.step1.monthlyExpenses || parseFloat(assessmentData.step1.monthlyExpenses) < 0) {
                alert('Please enter a valid monthly expenses amount.')
                setIsLoading(false)
                return
            }

            if (assessmentData.step2.debts.length === 0) {
                alert('Please add at least one debt to continue.')
                setIsLoading(false)
                return
            }

            // Validate each debt has required information
            for (const debt of assessmentData.step2.debts) {
                if (!debt.name || !debt.balance || parseFloat(debt.balance) <= 0) {
                    alert('Please ensure all debts have a name and valid balance amount.')
                    setIsLoading(false)
                    return
                }
            }

            // Get current user (create demo user if needed)
            let currentUser = await authHelpers.getCurrentUser()
            if (!currentUser) {
                // Generate a proper UUID for demo user
                const generateUUID = () => {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        const r = Math.random() * 16 | 0;
                        const v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                }

                currentUser = {
                    id: generateUUID(),
                    email: 'demo@debtrix.com',
                    app_metadata: {},
                    user_metadata: {},
                    aud: '',
                    created_at: new Date().toISOString()
                } as { id: string; email: string; app_metadata: Record<string, unknown>; user_metadata: Record<string, unknown>; aud: string; created_at: string }
                if (currentUser) {
                    console.log('Created demo user with UUID:', currentUser.id)
                }
            }

            if (!currentUser) {
                throw new Error('Failed to get or create user')
            }

            // Calculate extra payment capacity
            const monthlyIncome = parseFloat(assessmentData.step1.monthlyIncome) || 0
            const monthlyExpenses = parseFloat(assessmentData.step1.monthlyExpenses) || 0
            const extraPaymentCapacity = Math.max(0, monthlyIncome - monthlyExpenses)

            // Determine recommended method
            let recommendedMethod = assessmentData.step4.preferredMethod
            if (recommendedMethod === 'ai-recommended') {
                // AI logic based on user profile
                const stressLevel = assessmentData.step1.financialStress
                const hasSmallDebts = assessmentData.step2.debts.some(debt => parseFloat(debt.balance) < 2000)

                if (stressLevel >= 7 || hasSmallDebts) {
                    recommendedMethod = 'snowball' // Better for high stress
                } else if (stressLevel <= 4) {
                    recommendedMethod = 'avalanche' // Better for low stress, math-focused
                } else {
                    recommendedMethod = 'hybrid' // Balanced approach
                }
            }

            // Save assessment data
            const assessmentToSave = {
                user_id: currentUser.id,
                stress_level: assessmentData.step1.financialStress,
                extra_payment_capacity: extraPaymentCapacity,
                monthly_income: monthlyIncome,
                monthly_expenses: monthlyExpenses,
                recommended_method: recommendedMethod as 'snowball' | 'avalanche' | 'hybrid'
            }

            console.log('=== ASSESSMENT SAVE DEBUG ===')
            console.log('Current User:', currentUser)
            console.log('Assessment Data:', assessmentToSave)
            console.log('Assessment Operations:', typeof assessmentOperations)
            console.log('Assessment Operations object:', assessmentOperations)

            // Test Supabase connection first
            try {
                console.log('Testing database connection...')
                const testUser = await authHelpers.getCurrentUser()
                console.log('Database connection test result:', testUser)
            } catch (testError) {
                console.error('Database connection test failed:', testError)
            }

            console.log('About to call upsertAssessment...')

            const savedAssessment = await assessmentOperations.upsertAssessment(assessmentToSave)
            console.log('Assessment saved successfully:', savedAssessment)

            // Save debts from assessment
            console.log('=== DEBT SAVE DEBUG ===')
            console.log('Number of debts to save:', assessmentData.step2.debts.length)

            for (const debt of assessmentData.step2.debts) {
                console.log('Processing debt:', debt)

                if (debt.name && debt.balance && parseFloat(debt.balance) > 0) {
                    const debtToSave = {
                        user_id: currentUser.id,
                        debt_name: debt.name,
                        debt_type: mapDebtType(debt.type),
                        current_balance: parseFloat(debt.balance),
                        original_balance: parseFloat(debt.balance),
                        interest_rate: parseFloat(debt.interestRate) || 0,
                        minimum_payment: parseFloat(debt.minPayment) || Math.max(25, parseFloat(debt.balance) * 0.02), // 2% or $25 minimum
                        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
                    }

                    console.log('Saving debt:', debtToSave)
                    console.log('Debt Operations:', typeof debtOperations)

                    const savedDebt = await debtOperations.createDebt(debtToSave)
                    console.log('Debt saved successfully:', savedDebt)
                } else {
                    console.log('Skipping invalid debt:', debt)
                }
            }

            console.log('Assessment and debts saved successfully!')

            // Redirect to dashboard with success
            if (typeof window !== 'undefined') {
                window.location.href = '/dashboard?assessment=completed'
            }

        } catch (error: unknown) {
            console.error('=== ASSESSMENT SAVE ERROR ===')
            console.error('Raw error:', error)
            console.error('Error type:', typeof error)

            if (error && typeof error === 'object') {
                const errorObj = error as Record<string, unknown>;
                console.error('Error constructor:', errorObj?.constructor?.name)
                console.error('Error toString:', String(error))
                console.error('Error JSON:', JSON.stringify(error, null, 2))
                console.error('Error details:', {
                    message: errorObj?.message,
                    code: errorObj?.code,
                    details: errorObj?.details,
                    hint: errorObj?.hint,
                    stack: errorObj?.stack
                })
            }

            let errorMessage = 'Failed to save assessment. '

            // Check specific error types
            if (error && typeof error === 'object' && 'message' in error) {
                const errorObj = error as Record<string, unknown>;
                const errorCode = errorObj.code
                const errorMessage_ = String(errorObj.message || '')

                // Handle API key errors specifically
                if (errorMessage_.includes('Invalid API key') || errorMessage_.includes('Double check your Supabase')) {
                    errorMessage = 'Invalid Supabase API key detected. Please run "node setup-supabase-credentials.js" to fix this issue, then get your real API key from your Supabase dashboard.'
                } else if (errorMessage_.includes('JWT') || errorMessage_.includes('token')) {
                    errorMessage = 'Authentication token issue. Please check your Supabase configuration and try again.'
                } else if (errorCode === '23514' || errorMessage_.includes('check constraint')) {
                    errorMessage = 'Invalid data format. Please check your form inputs and try again.'
                } else if (errorCode === '42501' || errorMessage_.includes('row-level security policy')) {
                    errorMessage = 'Database security policy violation. Please contact support if this persists.'
                } else if (errorMessage_.includes('current_balance') ||
                    errorMessage_.includes('schema cache') ||
                    errorMessage_.includes('relation') ||
                    errorMessage_.includes('does not exist') ||
                    errorCode === 'PGRST204' ||
                    errorCode === 'PGRST106') {
                    errorMessage = 'Database connection issue. Please try again or contact support if this persists.'
                } else if (errorMessage_.includes('Failed to fetch') || errorMessage_.includes('network')) {
                    errorMessage = 'Network connection issue. Please check your internet connection and try again.'
                } else if (errorMessage_) {
                    errorMessage = `Error: ${errorMessage_}`
                } else {
                    errorMessage = 'Unknown error occurred. Please check the console for details and try again.'
                }
            } else if (error instanceof Error) {
                errorMessage = `Error: ${error.message}`
            } else {
                errorMessage = 'Unknown error occurred. Please check the console for details and try again.'
            }

            alert(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    // Helper function to map debt types
    const mapDebtType = (type: string): 'credit_card' | 'student_loan' | 'personal' | 'mortgage' | 'auto_loan' => {
        const typeMap: Record<string, 'credit_card' | 'student_loan' | 'personal' | 'mortgage' | 'auto_loan'> = {
            'Credit Card': 'credit_card',
            'Student Loan': 'student_loan',
            'Personal Loan': 'personal',
            'Auto Loan': 'auto_loan',
            'Mortgage': 'mortgage',
            'Other': 'personal'
        }
        return typeMap[type] || 'personal'
    }

    const renderStep1 = () => (
        <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    Financial Overview
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Let&apos;s understand your current financial situation
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Monthly Income ($)
                        </label>
                        <input
                            type="number"
                            value={assessmentData.step1.monthlyIncome}
                            onChange={(e) => setAssessmentData(prev => ({
                                ...prev,
                                step1: { ...prev.step1, monthlyIncome: e.target.value }
                            }))}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="5000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Monthly Expenses ($)
                        </label>
                        <input
                            type="number"
                            value={assessmentData.step1.monthlyExpenses}
                            onChange={(e) => setAssessmentData(prev => ({
                                ...prev,
                                step1: { ...prev.step1, monthlyExpenses: e.target.value }
                            }))}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="3500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Financial Stress Level (1-10)
                    </label>
                    <div className="space-y-2">
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={assessmentData.step1.financialStress}
                            onChange={(e) => setAssessmentData(prev => ({
                                ...prev,
                                step1: { ...prev.step1, financialStress: parseInt(e.target.value) }
                            }))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="text-center text-green-400 font-medium">
                            {assessmentData.step1.financialStress}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Debt Anxiety Level (1-10)
                    </label>
                    <div className="space-y-2">
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={assessmentData.step1.debtAnxiety}
                            onChange={(e) => setAssessmentData(prev => ({
                                ...prev,
                                step1: { ...prev.step1, debtAnxiety: parseInt(e.target.value) }
                            }))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="text-center text-green-400 font-medium">
                            {assessmentData.step1.debtAnxiety}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    const renderStep2 = () => (
        <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    Debt Inventory
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Add all your current debts for personalized strategies
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {assessmentData.step2.debts.map((debt, index) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="text-white font-medium">Debt #{index + 1}</h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDebt(index)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                                <Minus className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Debt Name</label>
                                <input
                                    type="text"
                                    value={debt.name}
                                    onChange={(e) => updateDebt(index, 'name', e.target.value)}
                                    className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Credit Card, Student Loan, etc."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                                <select
                                    value={debt.type}
                                    onChange={(e) => updateDebt(index, 'type', e.target.value)}
                                    className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Student Loan">Student Loan</option>
                                    <option value="Auto Loan">Auto Loan</option>
                                    <option value="Personal Loan">Personal Loan</option>
                                    <option value="Mortgage">Mortgage</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Balance ($)</label>
                                <input
                                    type="number"
                                    value={debt.balance}
                                    onChange={(e) => updateDebt(index, 'balance', e.target.value)}
                                    className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="5000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Interest Rate (%)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={debt.interestRate}
                                    onChange={(e) => updateDebt(index, 'interestRate', e.target.value)}
                                    className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="18.99"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Min Payment ($)</label>
                                <input
                                    type="number"
                                    value={debt.minPayment}
                                    onChange={(e) => updateDebt(index, 'minPayment', e.target.value)}
                                    className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="150"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <Button
                    onClick={addDebt}
                    variant="outline"
                    className="w-full border-green-500 text-green-400 hover:bg-green-500/10"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Debt
                </Button>
            </CardContent>
        </Card>
    )

    const renderStep3 = () => (
        <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    Goals & Motivation
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Define your financial goals and understand your motivation
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Financial Goals (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            'Become debt-free',
                            'Build emergency fund',
                            'Save for retirement',
                            'Buy a home',
                            'Start a business',
                            'Travel more'
                        ].map((goal) => (
                            <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={assessmentData.step3.goals.includes(goal)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setAssessmentData(prev => ({
                                                ...prev,
                                                step3: { ...prev.step3, goals: [...prev.step3.goals, goal] }
                                            }))
                                        } else {
                                            setAssessmentData(prev => ({
                                                ...prev,
                                                step3: { ...prev.step3, goals: prev.step3.goals.filter(g => g !== goal) }
                                            }))
                                        }
                                    }}
                                    className="rounded border-gray-500 text-green-500 focus:ring-green-500"
                                />
                                <span className="text-gray-300 text-sm">{goal}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Timeline</label>
                    <select
                        value={assessmentData.step3.timeline}
                        onChange={(e) => setAssessmentData(prev => ({
                            ...prev,
                            step3: { ...prev.step3, timeline: e.target.value }
                        }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="">Select timeline</option>
                        <option value="1-2 years">1-2 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5+ years">5+ years</option>
                        <option value="flexible">I&apos;m flexible</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        What motivates you to become debt-free?
                    </label>
                    <textarea
                        value={assessmentData.step3.motivation}
                        onChange={(e) => setAssessmentData(prev => ({
                            ...prev,
                            step3: { ...prev.step3, motivation: e.target.value }
                        }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={3}
                        placeholder="Financial freedom, less stress, peace of mind..."
                    />
                </div>
            </CardContent>
        </Card>
    )

    const renderStep4 = () => (
        <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-yellow-400" />
                    Strategy Preferences
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Choose your preferred debt elimination approach
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                        Preferred Method
                    </label>
                    <div className="space-y-3">
                        {[
                            { value: 'snowball', label: 'Debt Snowball', desc: 'Pay smallest debts first for quick wins' },
                            { value: 'avalanche', label: 'Debt Avalanche', desc: 'Pay highest interest debts first to save money' },
                            { value: 'hybrid', label: 'Hybrid Approach', desc: 'Balanced mix of both strategies' },
                            { value: 'ai-recommended', label: 'AI Recommended', desc: 'Let AI choose the best strategy for you' }
                        ].map((method) => (
                            <label key={method.value} className="flex items-start space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="preferredMethod"
                                    value={method.value}
                                    checked={assessmentData.step4.preferredMethod === method.value}
                                    onChange={(e) => setAssessmentData(prev => ({
                                        ...prev,
                                        step4: { ...prev.step4, preferredMethod: e.target.value }
                                    }))}
                                    className="mt-1 border-gray-500 text-yellow-500 focus:ring-yellow-500"
                                />
                                <div>
                                    <div className="text-white font-medium">{method.label}</div>
                                    <div className="text-gray-400 text-sm">{method.desc}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Risk Tolerance</label>
                    <select
                        value={assessmentData.step4.riskTolerance}
                        onChange={(e) => setAssessmentData(prev => ({
                            ...prev,
                            step4: { ...prev.step4, riskTolerance: e.target.value }
                        }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        <option value="">Select risk tolerance</option>
                        <option value="conservative">Conservative - Safe and steady</option>
                        <option value="moderate">Moderate - Balanced approach</option>
                        <option value="aggressive">Aggressive - Fast results, higher effort</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Commitment Level (1-10)
                    </label>
                    <div className="space-y-2">
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={assessmentData.step4.commitmentLevel}
                            onChange={(e) => setAssessmentData(prev => ({
                                ...prev,
                                step4: { ...prev.step4, commitmentLevel: parseInt(e.target.value) }
                            }))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="text-center text-yellow-400 font-medium">
                            {assessmentData.step4.commitmentLevel} - {
                                assessmentData.step4.commitmentLevel <= 3 ? 'Low' :
                                    assessmentData.step4.commitmentLevel <= 6 ? 'Medium' :
                                        assessmentData.step4.commitmentLevel <= 8 ? 'High' : 'Very High'
                            }
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center">
                            <div className="text-xl font-semibold text-white">Debtrix</div>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Badge variant="outline" className="border-green-500 text-green-400">
                                Assessment
                            </Badge>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Assessment Content */}
            <div className="pt-20 pb-12">
                <div className="container mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">
                            Financial Assessment
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Complete this 4-step assessment to get personalized debt elimination strategies
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                            Don&apos;t worry - this information is kept private and secure. We use it to create a personalized debt payoff plan just for you.
                        </p>
                    </div>

                    {/* Progress */}
                    <div className="max-w-4xl mx-auto mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Step {currentStep} of {totalSteps}</span>
                            <span className="text-sm text-gray-400">{Math.round(progress)}% Complete</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-gray-700" />
                    </div>

                    {/* Step Content */}
                    <div className="max-w-4xl mx-auto mb-8">
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                        {currentStep === 4 && renderStep4()}
                    </div>

                    {/* Navigation */}
                    <div className="max-w-4xl mx-auto flex justify-between">
                        <Button
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>

                        {currentStep < totalSteps ? (
                            <Button
                                onClick={handleNext}
                                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white"
                            >
                                Next
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        Complete Assessment
                                        <CheckCircle className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 