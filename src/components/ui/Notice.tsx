import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

type NoticeVariant = 'info' | 'warning' | 'danger' | 'success'

interface NoticeProps {
  variant?: NoticeVariant
  children: ReactNode
  className?: string
}

const variantClasses: Record<NoticeVariant, string> = {
  info: 'bg-info-bg text-info-text',
  warning: 'bg-warning-bg text-warning-text',
  danger: 'bg-danger-bg text-danger-text',
  success: 'bg-success-bg text-success-text',
}

// A tinted message box for notes and warnings inside a page or card
export function Notice({ variant = 'info', children, className }: NoticeProps) {
  return (
    <div
      role={variant === 'danger' ? 'alert' : undefined}
      className={cx(
        'rounded-control px-4 py-3 font-sans text-small',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  )
}
