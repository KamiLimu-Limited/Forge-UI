'use client'

import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { useUnreadCount } from '@/hooks/useUnreadCount'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'

// Opens Notifications. A dot shows while anything is unread; the count is read out.
export function NotificationBell() {
  const unread = useUnreadCount()
  return <NotificationBellView unread={unread} />
}

interface NotificationBellViewProps {
  unread: number
}

export function NotificationBellView({ unread }: NotificationBellViewProps) {
  return (
    <Link
      href={MENTEE_ROUTES.notifications}
      aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
      className="relative inline-flex size-control shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text-primary no-underline hover:no-underline hover:bg-background"
    >
      <Icon name="bell" />
      {unread > 0 && (
        <span
          aria-hidden="true"
          className="absolute right-2.5 top-2 size-2.5 rounded-full border-2 border-surface bg-auburn"
        />
      )}
    </Link>
  )
}
