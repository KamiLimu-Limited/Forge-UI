import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

export type IconName =
  | 'alert'
  | 'arrow-left'
  | 'calendar'
  | 'check'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'close'
  | 'grip'
  | 'menu'
  | 'monitor'
  | 'moon'
  | 'search'
  | 'sun'
  | 'upload'
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
  'arrow-left': <path d="M19 12H5M11 6l-6 6 6 6" />,
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="14" rx="2" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  'chevron-left': <path d="M15 6l-6 6 6 6" />,
  'chevron-right': <path d="M9 6l6 6-6 6" />,
  'chevron-up': <path d="M6 15l6-6 6 6" />,
  grip: (
    <>
      <path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" strokeWidth={3} />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  monitor: (
    <>
      <rect x="3.5" y="4.5" width="17" height="11.5" rx="1.5" />
      <path d="M9 20h6M12 16v4" />
    </>
  ),
  moon: <path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="3.75" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
    </>
  ),
  upload: (
    <>
      <path d="M12 15V4.5M7.5 9L12 4.5 16.5 9" />
      <path d="M4.5 15v4.5h15V15" />
    </>
  ),
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
