import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

interface PageHeaderProps {
  title: string
  subtitle?: ReactNode
  // Right side of the header, usually the page's main button
  action?: ReactNode
  // Keeps the action beside the title on phones instead of wrapping below it
  keepActionBeside?: boolean
}

export function PageHeader({ title, subtitle, action, keepActionBeside = false }: PageHeaderProps) {
  return (
    <header
      className={cx('flex items-start justify-between gap-3', !keepActionBeside && 'flex-wrap')}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="font-mono text-page-mobile font-semibold text-text-primary md:text-page">
          {title}
        </h1>
        {subtitle && <p className="font-sans text-body text-text-secondary">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}
