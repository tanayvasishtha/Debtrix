export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-blue-600/20 to-purple-600/20"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/10 via-transparent to-purple-500/10"></div>
            </div>

            {/* Loading Content */}
            <div className="relative z-10 text-center">
                {/* Main Spinner */}
                <div className="relative w-20 h-20 mx-auto mb-8">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full"></div>
                    {/* Spinning Ring */}
                    <div className="absolute inset-0 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin"></div>
                    {/* Inner Ring */}
                    <div className="absolute inset-2 border-2 border-blue-500/30 rounded-full"></div>
                    {/* Inner Spinning Ring */}
                    <div className="absolute inset-2 border-2 border-transparent border-b-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>

                    {/* Center Logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">D</span>
                        </div>
                    </div>
                </div>

                {/* Loading Text */}
                <h2 className="text-2xl font-semibold text-white mb-3">
                    Loading <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Debtrix</span>
                </h2>

                {/* Subtitle with Animation */}
                <div className="relative">
                    <p className="text-gray-400 text-lg animate-pulse">
                        Preparing your financial dashboard...
                    </p>

                    {/* Animated Dots */}
                    <div className="flex justify-center gap-1 mt-4">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-8 w-64 mx-auto">
                    <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                </div>

                {/* Loading Messages */}
                <div className="mt-6 text-sm text-gray-500">
                    <p className="animate-pulse">Initializing secure connection...</p>
                </div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-ping"
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + (i % 3) * 20}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: '2s'
                        }}
                    ></div>
                ))}
            </div>
        </div>
    )
} 