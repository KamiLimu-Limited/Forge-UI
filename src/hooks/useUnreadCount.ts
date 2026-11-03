'use client'

import { usePathname } from 'next/navigation'
import { api } from '@/lib/api'
import { useApiQuery } from './useApiQuery'

// Checked again on every page change, so reading notifications clears the dot.
// A failed check just hides the dot.
export function useUnreadCount(): number {
  const pathname = usePathname()
  const query = useApiQuery(() => api.notifications.unreadCount(), [pathname])
  return query.data ?? 0
}
