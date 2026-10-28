'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cx } from '@/lib/cx'

export interface TabItem {
  label: string
  href: string
}

interface TabsProps {
  items: TabItem[]
  // Names the tab row for screen readers, for example "Assignment type"
  label: string
}

// A row of link tabs under the page header. The current route's tab is underlined in teal.
export function Tabs({ items, label }: TabsProps) {
  const pathname = usePathname()

  return (
    <nav aria-label={label} className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
      <ul className="flex min-w-max gap-1 border-b border-border">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cx(
                  '-mb-px flex min-h-control items-center whitespace-nowrap border-b-2 px-4 py-2 font-sans text-body no-underline hover:no-underline',
                  isActive
                    ? 'border-teal-500 font-semibold text-accent-text'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                )}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
