import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CDS Football Club',
  description: 'Foot à 7 · 2e division · FLA Île-de-France · Since 2025',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'CDS Football Club',
    description: 'Foot à 7 · 2e division · FLA Île-de-France · Since 2025',
    images: [{ url: '/team/hero.jpg', width: 1920, height: 1440 }],
    locale: 'fr_FR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preload" as="image" href="/team/hero.jpg" fetchPriority="high" />
      </head>
      <body>{children}</body>
    </html>
  )
}
