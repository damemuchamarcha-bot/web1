import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { Anton, Inter } from 'next/font/google'
import Script from 'next/script'
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
  metadataBase: new URL('https://damemarcha.com'),
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
  other: {
    'google-adsense-account': 'ca-pub-9115589316233395',
    'publisuites-verify-code': 'aHR0cHM6Ly93d3cuZGFtZW1hcmNoYS5jb20=',
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
      <head>
        {/* Google Tag Manager - script del <head> */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-K5L32849');
            `,
          }}
        />
      </head>
      <body className={`${anton.variable} ${inter.variable} font-sans antialiased`}>
        {/* Google Tag Manager (noscript) - justo al abrir <body> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K5L32849"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <SiteHeader articles={articles} />
        <main>{children}</main>
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}
