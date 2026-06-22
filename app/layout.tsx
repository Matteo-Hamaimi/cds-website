import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CDS Football Club',
  description: 'Foot à 7 · 2e division · FLA Île-de-France · Since 2025',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
