'use client'

import { useCallback } from 'react'
import { api } from '@/lib/api'
import type { NotificationResponse } from '@/types/notification'
import { useApiQuery } from './useApiQuery'
import { useAsyncAction } from './useAsyncAction'

const PAGE_SIZE = 50

interface UseNotificationsReturn {
  notifications: NotificationResponse[] | null
  unreadCount: number
  isLoading: boolean
  error: string | null
  refetch: () => void
  // Marks one read without waiting, so the link still opens straight away
  markRead: (id: string) => void
  markAllRead: () => Promise<void>
  isMarkingAll: boolean
  markAllError: string | null
}

export function useNotifications(): UseNotificationsReturn {
  const query = useApiQuery(
    () => api.notifications.mine({ page_size: PAGE_SIZE }).then((page) => page.items),
    [],
    { fallbackError: "We couldn't load your notifications. Try again." }
  )
  const { data, setData } = query

  const markAll = useCallback(() => api.notifications.markAllRead(), [])
  const action = useAsyncAction(markAll, "We couldn't mark these as read. Try again.")

  return {
    notifications: data,
    unreadCount: (data ?? []).filter((item) => item.read_at === null).length,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    markRead: (id) => {
      void api.notifications.markRead(id).catch(() => undefined)
    },
    markAllRead: async () => {
      const done = await action.run()
      if (!done || !data) return
      const now = new Date().toISOString()
      setData(data.map((item) => ({ ...item, read_at: item.read_at ?? now })))
    },
    isMarkingAll: action.isLoading,
    markAllError: action.error,
  }
}
