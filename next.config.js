/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React Strict Mode for better development experience
    reactStrictMode: true,

    // Optimize images automatically
    images: {
        domains: ['images.unsplash.com', 'via.placeholder.com'],
        formats: ['image/webp', 'image/avif'],
    },

    // Move serverComponentsExternalPackages to root level
    serverExternalPackages: ['@supabase/supabase-js'],

    // Enable experimental features for better performance
    experimental: {
        // Remove the moved configuration
    },

    // Security headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
        ]
    },

    // Environment variables for client-side
    env: {
        CUSTOM_KEY: process.env.CUSTOM_KEY,
    },

    // Enable bundle analyzer in development
    ...(process.env.ANALYZE === 'true' && {
        webpack: (config) => {
            config.plugins.push(
                new (require('@next/bundle-analyzer'))({
                    enabled: true,
                })
            )
            return config
        },
    }),
}

module.exports = nextConfig 