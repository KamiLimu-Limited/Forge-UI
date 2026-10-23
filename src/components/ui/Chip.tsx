import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

export type ChipVariant = 'default' | 'on' | 'warn' | 'ok' | 'err' | 'info' | 'draft'

interface ChipProps {
  variant?: ChipVariant
  children: ReactNode
  // When set, the chip renders as a toggle button
  onClick?: () => void
  pressed?: boolean
  disabled?: boolean
}

const variantClasses: Record<ChipVariant, string> = {
  default: 'border-border-strong bg-surface text-text-secondary font-medium',
  on: 'border-teal-500 bg-accent-bg text-accent-text font-semibold',
  warn: 'border-gamboge bg-warning-bg text-warning-text font-semibold',
  ok: 'border-success bg-success-bg text-success-text font-semibold',
  err: 'border-danger bg-danger-bg text-danger-text font-semibold',
  info: 'border-info bg-info-bg text-info-text font-semibold',
  draft: 'border-dashed border-border-strong bg-transparent text-text-secondary font-medium',
}

const base = 'inline-flex items-center gap-1 whitespace-nowrap rounded-full border font-sans text-caption'

export function Chip({ variant = 'default', children, onClick, pressed, disabled }: ChipProps) {
  if (onClick) {
    // 36px tall, with the ::before layer stretching the hit area to 44px
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={pressed}
        disabled={disabled}
        className={cx(
          base,
          variantClasses[variant],
          "relative h-control-sm px-3 transition-colors duration-fast before:absolute before:inset-x-0 before:-inset-y-1 before:content-['']",
          variant === 'default' && 'hover:border-teal-500 hover:text-text-primary',
          'disabled:cursor-not-allowed disabled:opacity-60'
        )}
      >
        {children}
      </button>
    )
  }

  return <span className={cx(base, variantClasses[variant], 'px-2.5 py-0.5')}>{children}</span>
}
