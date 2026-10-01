import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Anton, Inter } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { articles } from '@/lib/articles'
import './globals.css'

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'DAME MARCHA — Revista de Cine y Música',
    template: '%s | DAME MARCHA',
  },
  description:
    'Revista cultural neo-punk. Cine y música sin filtros: próximos estrenos, crítica, análisis de álbumes y directos.',
  keywords: [
    'cine',
    'música',
    'crítica de cine',
    'análisis de álbumes',
    'directos',
    'revista cultural',
    'neo-punk',
  ],
  authors: [{ name: 'Dame Marcha' }],
  creator: 'Dame Marcha',
  generator: 'v0.app',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://damemarcha.com',
    title: 'DAME MARCHA — Revista de Cine y Música',
    description:
      'Revista cultural neo-punk. Cine y música sin filtros: próximos estrenos, crítica, análisis de álbumes y directos.',
    siteName: 'Dame Marcha',
    images: [
      {
        url: '/uploads/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Dame Marcha - Revista Cultural',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DAME MARCHA — Revista de Cine y Música',
    description:
      'Revista cultural neo-punk. Cine y música sin filtros.',
    images: ['/uploads/og-cover.jpg'],
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#121212',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${anton.variable} ${inter.variable} font-sans antialiased`}>
        <SiteHeader articles={articles} />
        <main>{children}</main>
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
