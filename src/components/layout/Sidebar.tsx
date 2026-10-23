'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

interface NavItem {
  label: string
  to: string
  icon: string
}

const adminNav: NavItem[] = [
  { label: 'Users', to: '/admin/users', icon: '◈' },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-60 min-h-screen bg-surface border-r border-border flex-shrink-0">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-border">
        <span className="font-mono font-bold text-section text-teal-500 tracking-wider">
          Forge
        </span>
        <p className="font-mono text-caption text-text-muted mt-1 uppercase tracking-widest">
          Admin
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {adminNav.map(({ label, to, icon }) => (
          <Link
            key={to}
            href={to}
            aria-current={pathname.startsWith(to) ? 'page' : undefined}
            className={[
              'flex items-center gap-3 px-3 py-2 rounded-md font-mono text-body font-medium transition-colors duration-fast',
              pathname.startsWith(to)
                ? 'bg-teal-100 text-teal-700'
                : 'text-text-secondary hover:bg-border hover:text-text-primary',
            ].join(' ')}
          >
            <span aria-hidden="true">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-4 py-4 border-t border-border">
        {user && (
          <p className="font-mono text-caption text-text-muted mb-3 truncate">
            {user.first_name} {user.last_name}
          </p>
        )}
        <Button variant="ghost" size="sm" fullWidth onClick={() => void logout()}>
          Sign out
        </Button>
      </div>
    </aside>
  )
}
