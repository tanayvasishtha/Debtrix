import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Debtrix - AI-Powered Debt Elimination Platform',
    template: '%s | Debtrix'
  },
  description: 'Transform your financial future with Debtrix - the intelligent debt elimination platform. Get personalized strategies, AI coaching, and real-time progress tracking to achieve debt freedom faster.',
  keywords: ['debt elimination', 'financial freedom', 'debt snowball', 'debt avalanche', 'AI financial coach', 'debt management', 'budgeting', 'personal finance'],
  authors: [{ name: 'Debtrix Team' }],
  creator: 'Debtrix',
  publisher: 'Debtrix',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Debtrix - AI-Powered Debt Elimination Platform',
    description: 'Transform your financial future with intelligent debt elimination strategies and AI-powered coaching.',
    siteName: 'Debtrix',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Debtrix - Your Path to Financial Freedom',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Debtrix - AI-Powered Debt Elimination',
    description: 'Achieve debt freedom with personalized strategies and AI coaching.',
    images: ['/images/twitter-image.png'],
    creator: '@debtrix',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: [
      { url: '/favicon.ico', sizes: '180x180', type: 'image/x-icon' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  category: 'finance',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  colorScheme: 'dark light',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={inter.className}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  )
}
