'use client'

import { useCallback, useMemo } from 'react'
import { api, fetchAllPages } from '@/lib/api'
import type { AttendanceResponse, OverrideRequestResponse } from '@/types/attendance'
import type { SessionDetailResponse } from '@/types/session'
import { useApiQuery } from './useApiQuery'
import { useAsyncAction } from './useAsyncAction'
import { useMenteeDirectory } from './useMenteeDirectory'

export interface AttendanceRow {
  record: AttendanceResponse
  name: string
  pendingRequest: OverrideRequestResponse | null
}

interface UseSessionAttendanceReturn {
  session: SessionDetailResponse | null
  rows: AttendanceRow[]
  presentCount: number
  isLoading: boolean
  error: string | null
  refetch: () => void
  excuse: (recordId: string, reason: string) => Promise<boolean>
  isExcusing: boolean
  excuseError: string | null
  clearExcuseError: () => void
}

// A session's attendance records with mentee names and pending extension requests
export function useSessionAttendance(sessionId: string): UseSessionAttendanceReturn {
  const sessionQuery = useApiQuery(() => api.sessions.getById(sessionId), [sessionId], {
    fallbackError: "We couldn't load this session.",
  })
  const cohortId = sessionQuery.data?.cohort_id ?? null
  const directory = useMenteeDirectory(cohortId)

  const recordsQuery = useApiQuery(
    async () => {
      const [records, requests] = await Promise.all([
        fetchAllPages((page, page_size) =>
          api.cohorts.attendance(cohortId as string, { page, page_size, session_id: sessionId })
        ),
        fetchAllPages((page, page_size) =>
          api.attendance.overrideRequests.list({
            page,
            page_size,
            session_id: sessionId,
            status: 'pending',
          })
        ),
      ])
      return { records, requests }
    },
    [cohortId, sessionId],
    { enabled: cohortId !== null, fallbackError: "We couldn't load attendance for this session." }
  )

  const rows = useMemo<AttendanceRow[]>(() => {
    const data = recordsQuery.data
    if (!data) return []
    return data.records
      .map((record) => ({
        record,
        name: directory.nameFor(record.mentee_id),
        pendingRequest: data.requests.find((r) => r.mentee_id === record.mentee_id) ?? null,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
    // nameFor changes with the directory data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordsQuery.data, directory.mentees])

  const excuseCall = useCallback(
    (recordId: string, reason: string) =>
      api.attendance.setStatus(recordId, { status: 'excused', reason }),
    []
  )
  const excuseAction = useAsyncAction(excuseCall, "The record wasn't changed. Try again.")

  const excuse = async (recordId: string, reason: string) => {
    const updated = await excuseAction.run(recordId, reason)
    if (!updated || !recordsQuery.data) return false
    recordsQuery.setData({
      ...recordsQuery.data,
      records: recordsQuery.data.records.map((r) =>
        r.id === recordId ? { ...r, status: updated.status, updated_at: updated.updated_at } : r
      ),
    })
    return true
  }

  return {
    session: sessionQuery.data,
    rows,
    presentCount: rows.filter((r) => r.record.status === 'attended').length,
    isLoading: sessionQuery.isLoading || recordsQuery.isLoading || directory.isLoading,
    error: sessionQuery.error ?? recordsQuery.error ?? directory.error,
    refetch: () => {
      sessionQuery.refetch()
      recordsQuery.refetch()
      directory.refetch()
    },
    excuse,
    isExcusing: excuseAction.isLoading,
    excuseError: excuseAction.error,
    clearExcuseError: excuseAction.clearError,
  }
}
