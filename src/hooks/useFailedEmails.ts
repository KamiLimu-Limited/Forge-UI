'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { fullName } from '@/lib/format'
import type { FailedEmailsView } from '@/types/adminIntegrations'
import { useApiQuery, type ApiQuery } from './useApiQuery'

const PAGE_SIZE = 20

// Shared for the visit, so each person is looked up once
const people = new Map<string, { name: string; email: string } | null>()

async function lookUp(userIds: string[]): Promise<void> {
  await Promise.all(
    userIds
      .filter((id) => !people.has(id))
      .map((id) =>
        api.admin.users
          .getById(id)
          .then((user) => people.set(id, { name: fullName(user) || user.email, email: user.email }))
          .catch(() => people.set(id, null))
      )
  )
}

async function loadFailedEmails(page: number): Promise<FailedEmailsView> {
  const result = await api.notifications.failed({ page, page_size: PAGE_SIZE })
  // Notifications carry only a user id. See docs/api-gaps.md.
  await lookUp(Array.from(new Set(result.items.map((item) => item.user_id))))
  return {
    total: result.total,
    page: result.page,
    pageSize: result.page_size,
    rows: result.items.map((item) => {
      const person = people.get(item.user_id) ?? null
      return {
        id: item.id,
        userId: item.user_id,
        name: person?.name ?? null,
        email: person?.email ?? null,
        type: item.notification_type,
        error: item.email_last_error,
        attempts: item.email_attempts,
        queuedAt: item.created_at,
      }
    }),
  }
}

export interface UseFailedEmailsReturn extends ApiQuery<FailedEmailsView> {
  setPage: (page: number) => void
}

export function useFailedEmails(): UseFailedEmailsReturn {
  const [page, setPage] = useState(1)
  const query = useApiQuery(() => loadFailedEmails(page), [page], {
    fallbackError: "We couldn't load the failed emails. Try again.",
  })
  return { ...query, setPage }
}
