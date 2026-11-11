'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import { answersToRequest } from '@/lib/sessionRecord'
import type { AttendanceAnswers, SessionRecordView } from '@/types/menteeSessions'
import { useAsyncAction } from './useAsyncAction'
import { useToast } from './useToast'

interface UseSubmitAttendanceReturn {
  submit: (answers: AttendanceAnswers) => Promise<void>
  isSubmitting: boolean
  // The API's own message, such as a closed window. The answers stay on the form.
  error: string | null
}

export function useSubmitAttendance(session: SessionRecordView | null): UseSubmitAttendanceReturn {
  const router = useRouter()
  const { showToast } = useToast()
  const send = useCallback(
    (answers: AttendanceAnswers) => {
      if (!session) return Promise.reject(new Error('Session not loaded'))
      const fields = session.ratingGroups.flatMap((group) =>
        group.questions.map((question) => question.number)
      )
      return api.attendance.submit({
        ...answersToRequest(answers, fields),
        session_id: session.id,
      })
    },
    [session]
  )
  const action = useAsyncAction(send, "We couldn't save your attendance. Try again.")

  return {
    submit: async (answers) => {
      const saved = await action.run(answers)
      if (!saved) return
      showToast('Attendance submitted', 'success')
      router.push(MENTEE_ROUTES.sessions)
    },
    isSubmitting: action.isLoading,
    error: action.error,
  }
}
