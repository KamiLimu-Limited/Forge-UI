'use client'

import { useSessionRecord } from '@/hooks/useSessionRecord'
import { useSubmitAttendance } from '@/hooks/useSubmitAttendance'
import { AttendanceScreen } from './AttendanceScreen'

interface AttendanceProps {
  sessionId: string
}

export function Attendance({ sessionId }: AttendanceProps) {
  const { data, isLoading, error, refetch } = useSessionRecord(sessionId)
  const { submit, isSubmitting, error: submitError } = useSubmitAttendance(data)
  return (
    <AttendanceScreen
      session={data}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      onSubmit={(answers) => void submit(answers)}
      isSubmitting={isSubmitting}
      submitError={submitError}
    />
  )
}
