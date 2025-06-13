export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                {/* Matrix Loading Animation */}
                <div className="relative mb-8">
                    <div className="w-16 h-16 mx-auto">
                        <div className="absolute inset-0 border-4 border-[#00FF41]/30 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-[#00FF41] border-t-transparent rounded-full animate-spin"></div>
                    </div>

                    {/* Pulsing Dots */}
                    <div className="flex justify-center space-x-2 mt-4">
                        <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>

                {/* Loading Text */}
                <h2 className="text-2xl font-bold text-white mb-2">
                    Loading <span className="text-[#00FF41]">Matrix</span>
                </h2>
                <p className="text-gray-400 animate-pulse">
                    Initializing your financial freedom journey...
                </p>
            </div>
        </div>
    )
} 