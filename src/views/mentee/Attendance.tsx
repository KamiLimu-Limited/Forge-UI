'use client'

import { useParticipantRole } from '@/hooks/useParticipantRole'
import { useSessionRecord } from '@/hooks/useSessionRecord'
import { useSubmitAttendance } from '@/hooks/useSubmitAttendance'
import { AttendanceScreen } from './AttendanceScreen'

interface AttendanceProps {
  sessionId: string
}

// Loads the session and saves the mentee's attendance
export function Attendance({ sessionId }: AttendanceProps) {
  const { data, isLoading, error, refetch } = useSessionRecord(sessionId)
  const { submit, isSubmitting, error: submitError } = useSubmitAttendance(data)
  const { saveBlockedNote } = useParticipantRole()
  return (
    <AttendanceScreen
      session={data}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      onSubmit={(answers) => void submit(answers)}
      isSubmitting={isSubmitting}
      submitError={submitError}
      saveBlockedNote={saveBlockedNote}
    />
  )
}
