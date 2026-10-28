import type { ReactNode } from 'react'

interface DangerZoneProps {
  title: string
  description: string
  // The destructive button
  action: ReactNode
}

// An auburn-bordered card for one destructive action, such as cancelling a session
export function DangerZone({ title, description, action }: DangerZoneProps) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-auburn bg-surface p-4 md:px-6 md:py-5">
      <h2 className="font-mono text-card-title font-semibold text-text-primary">{title}</h2>
      <p className="font-sans text-small text-text-secondary">{description}</p>
      <div className="self-start">{action}</div>
    </section>
  )
}
