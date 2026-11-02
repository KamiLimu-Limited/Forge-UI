import { JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'

// JetBrains Mono: headings, titles, buttons, numbers
export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
})

// Hind Guntur: body text, labels, table cells, descriptions
// ascent/descent overrides centre the capitals in the line box
export const fontSans = localFont({
  src: [
    {
      path: '../assets/fonts/hind-guntur/HindGuntur-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/hind-guntur/HindGuntur-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/hind-guntur/HindGuntur-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/hind-guntur/HindGuntur-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  declarations: [
    { prop: 'ascent-override', value: '128.35%' },
    { prop: 'descent-override', value: '60.45%' },
    { prop: 'line-gap-override', value: '0%' },
  ],
  variable: '--font-sans',
  display: 'swap',
})
