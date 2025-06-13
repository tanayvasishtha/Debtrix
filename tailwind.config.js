/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                // Debtrix custom colors
                matrix: '#00FF41',
                'matrix-dark': '#00CC33',
                tech: '#0D1117',
                trust: '#2563EB',
                'trust-dark': '#1D4ED8',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'matrix-glow': {
                    '0%, 100%': {
                        textShadow: '0 0 10px rgba(0, 255, 65, 0.8), 0 0 20px rgba(0, 255, 65, 0.6), 0 0 30px rgba(0, 255, 65, 0.4)'
                    },
                    '50%': {
                        textShadow: '0 0 20px rgba(0, 255, 65, 1), 0 0 30px rgba(0, 255, 65, 0.8), 0 0 40px rgba(0, 255, 65, 0.6)'
                    },
                },
                'matrix-pulse': {
                    '0%, 100%': {
                        boxShadow: '0 0 15px rgba(0, 255, 65, 0.3)'
                    },
                    '50%': {
                        boxShadow: '0 0 25px rgba(0, 255, 65, 0.6), 0 0 35px rgba(0, 255, 65, 0.4)'
                    },
                },
                'debt-breakthrough': {
                    '0%': { transform: 'scale(1) rotate(0deg)' },
                    '25%': { transform: 'scale(1.1) rotate(2deg)' },
                    '50%': { transform: 'scale(1.05) rotate(-1deg)' },
                    '75%': { transform: 'scale(1.15) rotate(1deg)' },
                    '100%': { transform: 'scale(1) rotate(0deg)' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'matrix-glow': 'matrix-glow 2s ease-in-out infinite',
                'matrix-pulse': 'matrix-pulse 2s ease-in-out infinite',
                'debt-breakthrough': 'debt-breakthrough 0.6s ease-in-out',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
} 