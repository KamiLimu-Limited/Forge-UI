'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Tabs } from '@/components/ui/Tabs'
import { cx } from '@/lib/cx'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'

const VIEWS = [
  { label: 'Open and upcoming', href: MENTEE_ROUTES.sessions },
  { label: 'History', href: MENTEE_ROUTES.sessionHistory },
]

// Two equal options on phones, the usual underlined tabs from md up
export function SessionViewTabs() {
  const pathname = usePathname()
  return (
    <>
      <nav
        aria-label="Session views"
        className="grid grid-cols-2 gap-1 rounded-control border border-border bg-surface p-1 md:hidden"
      >
        {VIEWS.map((view) => {
          const isActive = pathname === view.href
          return (
            <Link
              key={view.href}
              href={view.href}
              aria-current={isActive ? 'page' : undefined}
              className={cx(
                'flex min-h-10 items-center justify-center rounded-md font-sans text-small no-underline hover:no-underline',
                isActive ? 'bg-accent-bg font-semibold text-accent-text' : 'text-text-secondary'
              )}
            >
              {view.label}
            </Link>
          )
        })}
      </nav>
      <div className="hidden md:block">
        <Tabs items={VIEWS} label="Session views" />
      </div>
    </>
  )
}
