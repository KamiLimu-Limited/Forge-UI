import { Hind_Guntur, JetBrains_Mono } from 'next/font/google'

// JetBrains Mono: headings, titles, buttons, numbers
export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
})

// Hind Guntur: body text, labels, table cells, descriptions
export const fontSans = Hind_Guntur({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})
