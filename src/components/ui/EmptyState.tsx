import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: IconName
  action?: ReactNode
}

export function EmptyState({ title, description, icon = 'inbox', action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-accent-bg text-accent-icon">
        <Icon name={icon} className="size-7" />
      </div>
      <h2 className="font-mono text-card-title font-semibold text-text-primary">{title}</h2>
      {description && (
        <p className="max-w-sm font-sans text-body text-text-secondary">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
