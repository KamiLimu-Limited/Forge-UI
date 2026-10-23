import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  // Right side of the header, usually the page's main button
  action?: ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
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
