'use client'

import { useNotifications } from '@/hooks/useNotifications'
import { NotificationsScreen } from './NotificationsScreen'

// Loads the person's notifications and hands them to the screen
export function Notifications() {
  const list = useNotifications()
  return (
    <NotificationsScreen
      notifications={list.notifications}
      unreadCount={list.unreadCount}
      isLoading={list.isLoading}
      error={list.error}
      onRetry={list.refetch}
      onOpen={list.markRead}
      onMarkAllRead={() => void list.markAllRead()}
      isMarkingAll={list.isMarkingAll}
      markAllError={list.markAllError}
    />
  )
}
