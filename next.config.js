/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // Temporarily ignore TypeScript errors during builds
        ignoreBuildErrors: true,
    },
    eslint: {
        // Temporarily ignore ESLint errors during builds
        ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig 