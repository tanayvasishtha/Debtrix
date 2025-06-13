'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">
                {/* Matrix-style error animation */}
                <div className="relative mb-8">
                    <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-10 h-10 text-red-400 animate-pulse" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping"></div>
                </div>

                {/* Error Message */}
                <h1 className="text-4xl font-bold text-white mb-4">
                    System <span className="text-[#00FF41]">Error</span>
                </h1>

                <p className="text-gray-300 mb-8 leading-relaxed">
                    The Matrix has encountered an unexpected glitch. Our AI systems are working to resolve this issue.
                </p>

                {/* Error Details (Development Only) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="bg-gray-800 border border-red-500/30 rounded-lg p-4 mb-6 text-left">
                        <p className="text-red-400 font-mono text-sm">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-gray-400 text-xs mt-2">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={reset}
                        className="w-full bg-[#00FF41] text-black font-semibold py-3 px-6 rounded-lg hover:bg-[#00DD35] transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Try Again
                    </button>

                    <Link
                        href="/"
                        className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Return Home
                    </Link>
                </div>

                {/* Support Contact */}
                <div className="mt-8 text-sm text-gray-400">
                    <p>
                        Need help? Contact our support team at{' '}
                        <a
                            href="mailto:support@debtrix.com"
                            className="text-[#00FF41] hover:underline"
                        >
                            support@debtrix.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
} 