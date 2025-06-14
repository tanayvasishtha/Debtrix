'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  TrendingDown,
  Brain,
  Calculator,
  Target,
  Users,
  Award,
  ChevronRight,
  Play,
  ArrowRight,
  Zap,
  Shield,
  BookOpen,
  Menu,
  X,
  MessageCircle,
  BarChart3
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LandingPage() {
  const [matrixEffect, setMatrixEffect] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => setMatrixEffect(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Modern Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-xl font-semibold text-white">
                Debtrix
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard?demo=true" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/assessment" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Assessment
              </Link>
              <Link href="/chat" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                AI Coach
              </Link>
              <Link href="/learn" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Learn
              </Link>
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/auth?tab=signin">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800 font-medium text-sm px-4 py-2">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth?tab=signup">
                <Button className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-medium text-sm px-4 py-2 rounded-lg">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
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

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50">
              <div className="container mx-auto px-6 py-4">
                <div className="flex flex-col space-y-4">
                  <Link
                    href="/dashboard?demo=true"
                    className="text-gray-300 hover:text-white transition-colors text-sm font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/assessment"
                    className="text-gray-300 hover:text-white transition-colors text-sm font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Assessment
                  </Link>
                  <Link
                    href="/chat"
                    className="text-gray-300 hover:text-white transition-colors text-sm font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    AI Coach
                  </Link>
                  <Link
                    href="/learn"
                    className="text-gray-300 hover:text-white transition-colors text-sm font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Learn
                  </Link>
                  <div className="border-t border-gray-800 pt-4 mt-4">
                    <div className="flex flex-col space-y-3">
                      <Link href="/auth?tab=signin" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full text-gray-300 hover:text-white hover:bg-gray-800 font-medium text-sm py-2">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth?tab=signup" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-medium text-sm py-2 rounded-lg">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-blue-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/10 via-transparent to-purple-500/10"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">

            {/* Modern Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-8">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
              AI-Powered Debt Management
            </div>

            {/* Modern Headline */}
            <h1 className="text-5xl md:text-7xl font-semibold mb-6 text-white tracking-tight">
              Master your
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                financial future
              </span>
            </h1>

            {/* Modern Subtitle */}
            <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              Intelligent debt elimination strategies powered by AI.
              Get personalized guidance and achieve financial freedom faster.
            </p>

            {/* Modern CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth?tab=signup">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-semibold px-8 py-3 text-base rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <Link href="/dashboard?demo=true">
                <Button size="lg" variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 px-8 py-3 text-base rounded-lg font-medium">
                  Try Demo
                </Button>
              </Link>
            </div>

            {/* Modern Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-8 px-8 text-white/50 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Bank-grade security
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Ages 13+ friendly
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                AI-powered insights
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Features Section */}
      <section id="features" className="py-24 bg-gray-900 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
              Features
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
              Everything you need to
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                eliminate debt faster
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful AI-driven tools and insights to transform your financial future
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Smart Assessment */}
            <div className="group relative cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl group-hover:from-blue-500/20 group-hover:to-purple-500/20"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 h-full transition-all duration-300 hover:border-blue-500/30 hover:bg-gray-800/70 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Brain className="w-6 h-6 text-white transition-all duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-blue-300">Smart Assessment</h3>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed transition-colors duration-300 group-hover:text-gray-200">
                  AI-powered 4-step evaluation that analyzes your financial situation and stress levels for personalized debt elimination strategies.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full transition-all duration-300 group-hover:bg-blue-400 group-hover:scale-125"></div>
                    Psychological stress assessment
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full transition-all duration-300 group-hover:bg-blue-400 group-hover:scale-125"></div>
                    Complete debt inventory
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full transition-all duration-300 group-hover:bg-blue-400 group-hover:scale-125"></div>
                    Financial capacity analysis
                  </div>
                </div>
              </div>
            </div>

            {/* AI Coach */}
            <div className="group relative cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl group-hover:from-emerald-500/20 group-hover:to-green-500/20"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 h-full transition-all duration-300 hover:border-emerald-500/30 hover:bg-gray-800/70 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Zap className="w-6 h-6 text-white transition-all duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-emerald-300">AI Financial Coach</h3>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed transition-colors duration-300 group-hover:text-gray-200">
                  Advanced AI coaching with 200k context window that remembers your financial journey and provides personalized guidance.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full transition-all duration-300 group-hover:bg-emerald-300 group-hover:scale-125"></div>
                    24/7 personalized guidance
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full transition-all duration-300 group-hover:bg-emerald-300 group-hover:scale-125"></div>
                    Conversation memory & context
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full transition-all duration-300 group-hover:bg-emerald-300 group-hover:scale-125"></div>
                    Educational content integration
                  </div>
                </div>
              </div>
            </div>

            {/* Calculation Engine */}
            <div className="group relative cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl group-hover:from-yellow-500/20 group-hover:to-orange-500/20"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 h-full transition-all duration-300 hover:border-orange-500/30 hover:bg-gray-800/70 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Calculator className="w-6 h-6 text-white transition-all duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-orange-300">Advanced Calculations</h3>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed transition-colors duration-300 group-hover:text-gray-200">
                  Professional-grade debt elimination algorithms comparing snowball,
                  avalanche, hybrid, and consolidation methods.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full transition-all duration-300 group-hover:bg-orange-400 group-hover:scale-125"></div>
                    Real-time payment projections
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full transition-all duration-300 group-hover:bg-orange-400 group-hover:scale-125"></div>
                    Interest savings calculations
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full transition-all duration-300 group-hover:bg-orange-400 group-hover:scale-125"></div>
                    Method comparison & recommendations
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="group relative cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl group-hover:from-purple-500/20 group-hover:to-violet-500/20"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 h-full transition-all duration-300 hover:border-purple-500/30 hover:bg-gray-800/70 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <TrendingDown className="w-6 h-6 text-white transition-all duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-purple-300">Visual Progress</h3>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed transition-colors duration-300 group-hover:text-gray-200">
                  Interactive charts and gamified achievements with
                  celebrations for debt elimination milestones.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full transition-all duration-300 group-hover:bg-purple-400 group-hover:scale-125"></div>
                    Real-time debt reduction charts
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full transition-all duration-300 group-hover:bg-purple-400 group-hover:scale-125"></div>
                    Achievement badge system
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full transition-all duration-300 group-hover:bg-purple-400 group-hover:scale-125"></div>
                    Motivational breakthrough animations
                  </div>
                </div>
              </div>
            </div>

            {/* Educational Hub */}
            <div className="group relative cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl group-hover:from-blue-500/20 group-hover:to-cyan-500/20"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 h-full transition-all duration-300 hover:border-cyan-500/30 hover:bg-gray-800/70 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <BookOpen className="w-6 h-6 text-white transition-all duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-cyan-300">Financial Education</h3>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed transition-colors duration-300 group-hover:text-gray-200">
                  Comprehensive financial literacy content designed for ages 13+ with
                  interactive tools and beginner-friendly explanations.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full transition-all duration-300 group-hover:bg-cyan-400 group-hover:scale-125"></div>
                    Age-appropriate financial concepts
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full transition-all duration-300 group-hover:bg-cyan-400 group-hover:scale-125"></div>
                    Interactive learning modules
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full transition-all duration-300 group-hover:bg-cyan-400 group-hover:scale-125"></div>
                    Success stories & case studies
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Data */}
            <div className="group relative cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl group-hover:from-indigo-500/20 group-hover:to-purple-500/20"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 h-full transition-all duration-300 hover:border-indigo-500/30 hover:bg-gray-800/70 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Zap className="w-6 h-6 text-white transition-all duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-indigo-300">Real-time Sync</h3>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed transition-colors duration-300 group-hover:text-gray-200">
                  Supabase real-time database with Row Level Security ensures
                  instant updates and bank-grade data protection.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full transition-all duration-300 group-hover:bg-indigo-400 group-hover:scale-125"></div>
                    Instant progress updates
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full transition-all duration-300 group-hover:bg-indigo-400 group-hover:scale-125"></div>
                    Multi-device synchronization
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full transition-all duration-300 group-hover:bg-indigo-400 group-hover:scale-125"></div>
                    Enterprise-grade security
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-blue-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/10 via-transparent to-purple-500/10"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
            Ready to transform your
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              financial future?
            </span>
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Join thousands who&apos;ve already eliminated their debt with AI-powered guidance
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/assessment">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-semibold px-8 py-3 text-base rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                Start Free Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link href="#features">
              <Button size="lg" variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 px-8 py-3 text-base rounded-lg font-medium">
                View Demo
              </Button>
            </Link>
          </div>

          <div className="flex justify-center items-center gap-8 mt-12 text-white/40 text-sm">
            <span>✓ No credit card required</span>
            <span>✓ 5-minute setup</span>
            <span>✓ Bank-grade security</span>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-semibold text-white mb-4">Debtrix</div>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                AI-powered debt elimination platform helping you achieve financial freedom faster.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-gray-400 text-sm">Trusted by 10,000+ users</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6 text-sm">Platform</h4>
              <ul className="space-y-3">
                <li><Link href="/assessment" className="text-gray-400 hover:text-white transition-colors text-sm">Assessment</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">Dashboard</Link></li>
                <li><Link href="/chat" className="text-gray-400 hover:text-white transition-colors text-sm">AI Coach</Link></li>
                <li><Link href="/progress" className="text-gray-400 hover:text-white transition-colors text-sm">Analytics</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6 text-sm">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</Link></li>
                <li><Link href="/strategies" className="text-gray-400 hover:text-white transition-colors text-sm">Strategies</Link></li>
                <li><Link href="/guides" className="text-gray-400 hover:text-white transition-colors text-sm">Guides</Link></li>
                <li><Link href="/success-stories" className="text-gray-400 hover:text-white transition-colors text-sm">Success Stories</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6 text-sm">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors text-sm">Careers</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">&copy; 2025 Debtrix. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <span className="text-gray-500 text-sm">Made with ❤️ for financial freedom</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
