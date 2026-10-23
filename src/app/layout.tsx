import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { fontMono, fontSans } from './fonts'
import { Providers } from './providers'
import '@/styles/global.css'

export const metadata: Metadata = {
  title: 'Forge',
  description: 'The operational backbone of the KamiLimu mentorship programme.',
  icons: { icon: '/logos/favicon.svg' },
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${fontMono.variable} ${fontSans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
