'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Tabs } from '@/components/ui/Tabs'
import { cx } from '@/lib/cx'

export interface ViewTab {
  label: string
  href: string
}

interface ViewTabsProps {
  items: ViewTab[]
  // Names the switch for screen readers, for example "Session views"
  label: string
  // "phone-only" leaves the views to the sidebar from md up
  desktop?: 'tabs' | 'phone-only'
}

// Equal options on phones; the usual underlined tabs from md up, unless the sidebar covers them
export function ViewTabs({ items, label, desktop = 'tabs' }: ViewTabsProps) {
  const pathname = usePathname()
  return (
    <>
      <nav
        aria-label={label}
        className="grid auto-cols-fr grid-flow-col gap-1 rounded-control border border-border bg-surface p-1 md:hidden"
      >
        {items.map((view) => {
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
      {desktop === 'tabs' && (
        <div className="hidden md:block">
          <Tabs items={items} label={label} />
        </div>
      )}
    </>
  )
}
