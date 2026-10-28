import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { THEME_INIT_SCRIPT } from '@/lib/theme'
import { fontMono, fontSans } from './fonts'
import { Providers } from './providers'
import '@/styles/global.css'

export const metadata: Metadata = {
  title: 'KamiLimu Dashboard',
  description: 'The operational backbone of the KamiLimu mentorship programme.',
  icons: { icon: '/logos/favicon.png', apple: '/logos/apple-touch-icon.png' },
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    // The theme script sets data-theme before React hydrates, so the attribute may differ
    <html
      lang="en"
      className={`${fontMono.variable} ${fontSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
