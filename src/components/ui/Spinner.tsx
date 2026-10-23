import { cx } from '@/lib/cx'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  // Announced to screen readers
  label?: string
}

const sizeClasses = {
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-10 border-4',
}

export function Spinner({ size = 'md', className, label = 'Loading' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cx(
        'inline-block animate-spin rounded-full border-border-strong border-t-primary',
        sizeClasses[size],
        className
      )}
    />
  )
}
