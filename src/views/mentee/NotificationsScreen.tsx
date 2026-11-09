import Link from 'next/link'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { Notice } from '@/components/ui/Notice'
import { cx } from '@/lib/cx'
import { formatRelativeDateTime, plural } from '@/lib/format'
import { notificationHref } from '@/lib/notifications'
import type { NotificationResponse } from '@/types/notification'

interface NotificationsScreenProps {
  // null until the list loads
  notifications: NotificationResponse[] | null
  unreadCount: number
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  onOpen: (id: string) => void
  onMarkAllRead: () => void
  isMarkingAll?: boolean
  markAllError?: string | null
}

// The same updates the API emails. This only draws the screen; the page's hook loads them.
export function NotificationsScreen({
  notifications,
  unreadCount,
  isLoading = false,
  error = null,
  onRetry,
  onOpen,
  onMarkAllRead,
  isMarkingAll = false,
  markAllError = null,
}: NotificationsScreenProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title="Notifications"
        subtitle={
          notifications ? (
            <span className="hidden md:inline">
              {unreadCount > 0 ? `${unreadCount} unread. ` : ''}These are the same updates we email
              you.
            </span>
          ) : undefined
        }
        keepActionBeside
        action={
          unreadCount > 0 ? (
            <Button variant="secondary" size="sm" isLoading={isMarkingAll} onClick={onMarkAllRead}>
              Mark all as read
            </Button>
          ) : undefined
        }
      />
      {markAllError && <Notice variant="danger">{markAllError}</Notice>}
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !notifications ? (
        <LoadingState label="Loading your notifications" />
      ) : notifications.length === 0 ? (
        <Card>
          <EmptyState
            icon="bell"
            title="Nothing new"
            description="Updates about your sessions and requests show up here."
          />
        </Card>
      ) : (
        <>
          <Card flush>
            <ul className="px-4 md:px-6">
              {notifications.map((item) => {
                const isUnread = item.read_at === null
                return (
                  <li key={item.id} className="border-b border-border last:border-b-0">
                    <Link
                      href={notificationHref(item)}
                      onClick={() => {
                        if (isUnread) onOpen(item.id)
                      }}
                      className="flex items-start gap-3 py-3 text-inherit no-underline hover:no-underline"
                    >
                      <span
                        aria-hidden="true"
                        className={cx(
                          'mt-2 size-2 shrink-0 rounded-full',
                          isUnread ? 'bg-primary' : 'bg-transparent'
                        )}
                      />
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span
                          className={cx(
                            'font-sans text-body text-text-primary',
                            isUnread && 'font-semibold'
                          )}
                        >
                          {item.title}
                        </span>
                        <span className="font-sans text-small text-text-secondary">
                          {item.message}
                        </span>
                        <time
                          dateTime={item.created_at}
                          className="font-sans text-caption text-text-muted md:hidden"
                        >
                          {formatRelativeDateTime(item.created_at)}
                        </time>
                        {isUnread && <span className="sr-only">Unread</span>}
                      </span>
                      <time
                        dateTime={item.created_at}
                        aria-hidden="true"
                        className="hidden shrink-0 font-sans text-caption text-text-muted md:block"
                      >
                        {formatRelativeDateTime(item.created_at)}
                      </time>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </Card>
          <p className="font-sans text-small text-text-muted md:hidden">
            {plural(unreadCount, 'unread notification')}. These are the same updates we email you.
          </p>
        </>
      )}
    </div>
  )
}
