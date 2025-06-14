import Link from 'next/link'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-8xl font-bold text-[#00FF41] opacity-20 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-2 border-[#00FF41]/50 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Path Not <span className="text-[#00FF41]">Found</span>
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </p>

        {/* Navigation Options */}
        <div className="space-y-4">
          <Link
            href="/"
            className="w-full bg-[#00FF41] text-black font-semibold py-3 px-6 rounded-lg hover:bg-[#00DD35] transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Return Home
          </Link>

          <Link
            href="/dashboard"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go to Dashboard
          </Link>

          <Link
            href="/learn"
            className="w-full bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Explore Learn Section
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 text-sm text-gray-400">
          <p className="mb-2">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/assessment" className="text-[#00FF41] hover:underline">
              Take Assessment
            </Link>
            <Link href="/chat" className="text-[#00FF41] hover:underline">
              AI Coach
            </Link>
            <Link href="/learn" className="text-[#00FF41] hover:underline">
              Financial Education
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 