'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { AuditLookups } from '@/lib/audit'
import { fullName } from '@/lib/format'
import type { AuditLogResponse } from '@/types/audit'

// Shared across screens for the visit, so each id is looked up once
const userNames = new Map<string, string>()
const sessionTitles = new Map<string, string>()

// Resolves the people and sessions an audit page mentions into names and titles
export function useAuditLookups(logs: AuditLogResponse[]): AuditLookups {
  const [lookups, setLookups] = useState<AuditLookups>({ users: {}, sessions: {} })
  const key = logs.map((l) => l.id).join(',')

  useEffect(() => {
    let cancelled = false
    const userIds = new Set<string>()
    const sessionIds = new Set<string>()
    for (const log of logs) {
      if (log.user_id) userIds.add(log.user_id)
      if (log.resource_type === 'user' && log.resource_id) userIds.add(log.resource_id)
      if (log.resource_type === 'session' && log.resource_id) sessionIds.add(log.resource_id)
    }

    const loadUsers = Array.from(userIds)
      .filter((id) => !userNames.has(id))
      .map((id) =>
        api.admin.users
          .getById(id)
          .then((u) => userNames.set(id, fullName(u) || u.email))
          .catch(() => undefined)
      )
    const loadSessions = Array.from(sessionIds)
      .filter((id) => !sessionTitles.has(id))
      .map((id) =>
        api.sessions
          .getById(id)
          .then((s) => sessionTitles.set(id, s.title))
          .catch(() => undefined)
      )

    void Promise.all([...loadUsers, ...loadSessions]).then(() => {
      if (cancelled) return
      setLookups({
        users: Object.fromEntries(userNames),
        sessions: Object.fromEntries(sessionTitles),
      })
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return lookups
}
