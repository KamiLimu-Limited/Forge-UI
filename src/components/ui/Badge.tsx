import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface BadgeProps {
  variant: BadgeVariant
  children: ReactNode
}

// Status variants use the semantic bg and text pairs at weight 600; neutral stays at 500
const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-success-bg text-success-text font-semibold',
  warning: 'bg-warning-bg text-warning-text font-semibold',
  danger: 'bg-danger-bg text-danger-text font-semibold',
  info: 'bg-info-bg text-info-text font-semibold',
  neutral: 'bg-background text-text-secondary font-medium',
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 font-sans text-caption',
        variantClasses[variant]
      )}
    >
      {children}
    </span>
  )
}
