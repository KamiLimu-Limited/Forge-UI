import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

export type IconName =
  | 'alert'
  | 'check'
  | 'chevron-down'
  | 'close'
  | 'eye'
  | 'eye-off'
  | 'home'
  | 'inbox'
  | 'plus'
  | 'swap'
  | 'user'
  | 'users'

interface IconProps {
  name: IconName
  // Defaults to size-5 (20px). Pass a size utility such as "size-4" or "size-tab-icon".
  className?: string
}

// Stroke paths drawn on a 24px grid
const paths: Record<IconName, ReactNode> = {
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5" />
      <path d="M12 16.5h.01" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  'eye-off': (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.6A9.7 9.7 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-3 3.7" />
      <path d="M6.6 6.6C3.9 8.4 2.5 12 2.5 12S6 18.5 12 18.5c1.7 0 3.2-.5 4.5-1.2" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  home: (
    <>
      <path d="M4 10.5L12 4l8 6.5" />
      <path d="M6 9v10.5h12V9" />
    </>
  ),
  inbox: (
    <>
      <path d="M3.5 13.5l2.5-8h12l2.5 8" />
      <path d="M3.5 13.5v5h17v-5h-5.5a3 3 0 0 1-6 0z" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  swap: (
    <>
      <path d="M7 4L3.5 7.5 7 11" />
      <path d="M3.5 7.5h13" />
      <path d="M17 13l3.5 3.5L17 20" />
      <path d="M20.5 16.5h-13" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.25" />
      <path d="M3 19.5c.6-3.2 3-5 6-5s5.4 1.8 6 5" />
      <path d="M15.5 5.6a3.25 3.25 0 0 1 0 5.8" />
      <path d="M17.5 14.8c1.8.6 3 2.1 3.5 4.7" />
    </>
  ),
}

// Decorative icon. Always pair it with visible text or an aria-label on the parent control.
export function Icon({ name, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cx('shrink-0', className ?? 'size-5')}
    >
      {paths[name]}
    </svg>
  )
}
