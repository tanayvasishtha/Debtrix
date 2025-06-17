'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { authHelpers } from '@/lib/supabase'
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function AuthPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [error, setError] = useState<string>('')

    // Sign In Form
    const [signInData, setSignInData] = useState({
        email: '',
        password: ''
    })

    // Sign Up Form
    const [signUpData, setSignUpData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    })

    // Check if user is already authenticated
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // First check Supabase auth (since you're actually signed in)
                const user = await authHelpers.getCurrentUser()
                if (user) {
                    console.log('User already authenticated via Supabase:', user.email)
                    router.push('/dashboard')
                    return
                }

                // Check local storage as fallback
                const localUser = localStorage.getItem('debtrix_user')
                if (localUser) {
                    console.log('User found in localStorage, redirecting')
                    router.push('/dashboard')
                    return
                }
            } catch (error) {
                console.log('Auth check failed:', error)
                // User not authenticated, stay on auth page
            }
        }
        checkAuth()
    }, [router])

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        console.log('=== SIGN IN ATTEMPT ===')
        console.log('Email:', signInData.email)
        console.log('Password length:', signInData.password.length)

        try {
            const data = await authHelpers.signIn(signInData.email, signInData.password)
            console.log('Sign in successful:', data)

            setMessage({ type: 'success', text: 'Successfully signed in! Setting up your dashboard...' })

            // Smoother transition with loading state
            setTimeout(() => {
                setMessage({ type: 'success', text: 'Redirecting to dashboard...' })
                setTimeout(() => router.push('/dashboard'), 800)
            }, 1200)
        } catch (error: unknown) {
            console.error('Sign in error:', error)
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('An unexpected error occurred')
            }
            setLoading(false)
        }
        // Don't set loading to false here - keep it true during redirect
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (signUpData.password !== signUpData.confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        if (signUpData.password.length < 6) {
            setError('Password must be at least 6 characters')
            setLoading(false)
            return
        }

        try {
            const data = await authHelpers.signUp(signUpData.email, signUpData.password)
            console.log('Sign up successful:', data)

            setMessage({
                type: 'success',
                text: 'Account created successfully! Check your email for verification, then you can sign in.'
            })
            setSignUpData({ email: '', password: '', confirmPassword: '' })
        } catch (error: unknown) {
            console.error('Sign up error:', error)
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('An unexpected error occurred')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleDemoAccess = () => {
        setLoading(true)
        setMessage({ type: 'success', text: 'Initializing demo mode...' })

        // Create demo user for localStorage
        const demoUser = {
            id: 'demo-user',
            email: 'demo@debtrix.com',
            created_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: {}
        }
        localStorage.setItem('debtrix_user', JSON.stringify(demoUser))

        setTimeout(() => {
            setMessage({ type: 'success', text: 'Loading demo dashboard...' })
            setTimeout(() => router.push('/dashboard?demo=true'), 800)
        }, 1000)
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl flex gap-8">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex flex-col justify-center flex-1 text-white">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                            Welcome to Debtrix
                        </h1>
                        <p className="text-xl text-gray-300 mb-8">
                            Your AI-powered journey to financial freedom starts here
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span>Smart debt elimination strategies</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span>AI-powered financial coaching</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span>Real-time progress tracking</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span>Personalized debt-free timeline</span>
                        </div>
                    </div>

                    {/* Demo Access */}
                    <div className="mt-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-semibold mb-2 text-green-400">Try Demo Version</h3>
                        <p className="text-gray-300 text-sm mb-4">
                            Want to explore Debtrix without creating an account? Access our full-featured demo.
                        </p>
                        <Button
                            onClick={handleDemoAccess}
                            variant="outline"
                            className="border-green-500 text-green-400 hover:bg-green-500/10 transition-all duration-200"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Loading...
                                </div>
                            ) : (
                                <>
                                    Access Demo
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Right Side - Auth Forms */}
                <div className="flex-1 max-w-md">
                    <Card className="bg-gray-800/50 border-gray-700">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold text-white">Get Started</CardTitle>
                            <CardDescription className="text-gray-400">
                                Sign in to your account or create a new one
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Message Display */}
                            {message && (
                                <div className={`mb-4 p-3 rounded-lg border transition-all duration-300 ${message.type === 'success'
                                    ? 'bg-green-900/30 border-green-500/30 text-green-300'
                                    : 'bg-red-900/30 border-red-500/30 text-red-300'
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        {message.type === 'success' ? (
                                            loading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4" />
                                            )
                                        ) : (
                                            <AlertCircle className="w-4 h-4" />
                                        )}
                                        <p className="text-sm">{message.text}</p>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="mb-4 p-3 rounded-lg border bg-red-900/30 border-red-500/30 text-red-300 transition-all duration-300">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        <p className="text-sm">{error}</p>
                                    </div>
                                </div>
                            )}

                            <Tabs defaultValue="signin" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                                    <TabsTrigger value="signin" className="data-[state=active]:bg-gray-600">
                                        Sign In
                                    </TabsTrigger>
                                    <TabsTrigger value="signup" className="data-[state=active]:bg-gray-600">
                                        Sign Up
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="signin" className="space-y-4 mt-6">
                                    <form onSubmit={handleSignIn} className="space-y-4">
                                        <div>
                                            <Label htmlFor="signin-email" className="text-gray-300">Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="signin-email"
                                                    type="email"
                                                    value={signInData.email}
                                                    onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                                                    placeholder="Enter your email"
                                                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="signin-password" className="text-gray-300">Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="signin-password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={signInData.password}
                                                    onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                                                    placeholder="Enter your password"
                                                    className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-medium transition-all duration-200"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Signing in...
                                                </div>
                                            ) : (
                                                'Sign In'
                                            )}
                                        </Button>
                                    </form>
                                </TabsContent>

                                <TabsContent value="signup" className="space-y-4 mt-6">
                                    <form onSubmit={handleSignUp} className="space-y-4">
                                        <div>
                                            <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="signup-email"
                                                    type="email"
                                                    value={signUpData.email}
                                                    onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                                                    placeholder="Enter your email"
                                                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="signup-password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={signUpData.password}
                                                    onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                                                    placeholder="Create a password (min 6 chars)"
                                                    className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="signup-confirm" className="text-gray-300">Confirm Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="signup-confirm"
                                                    type={showPassword ? "text" : "password"}
                                                    value={signUpData.confirmPassword}
                                                    onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                    placeholder="Confirm your password"
                                                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-medium transition-all duration-200"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Creating account...
                                                </div>
                                            ) : (
                                                'Create Account'
                                            )}
                                        </Button>
                                    </form>
                                </TabsContent>
                            </Tabs>

                            <div className="mt-6 text-center">
                                <Link href="/" className="text-sm text-gray-400 hover:text-gray-300">
                                    ← Back to Home
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
} 