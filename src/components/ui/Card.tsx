import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

interface CardProps {
  title?: string
  // Right side of the header row, such as a button or link
  action?: ReactNode
  children: ReactNode
  // Removes body padding so a table or list can run edge to edge
  flush?: boolean
  className?: string
}

export function Card({ title, action, children, flush = false, className }: CardProps) {
  const hasHeader = Boolean(title ?? action)
  return (
    <section
      className={cx(
        'flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card',
        className
      )}
    >
      {hasHeader && (
        <div
          className={cx(
            'flex items-center justify-between gap-3 px-4 pt-4 md:px-6 md:pt-5',
            flush && 'pb-4 md:pb-5'
          )}
        >
          {title && (
            <h2 className="font-mono text-card-title font-semibold text-text-primary">{title}</h2>
          )}
          {action}
        </div>
      )}
      <div className={cx(!flush && 'p-4 md:px-6 md:py-5', !flush && hasHeader && 'pt-3 md:pt-3')}>
        {children}
      </div>
    </section>
  )
}
