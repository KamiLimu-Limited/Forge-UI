import { Chip } from '@/components/ui/Chip'
import { ATTENDANCE_STATUS_LABELS } from '@/lib/labels'
import type { AttendanceStatus } from '@/types/attendance'

interface AttendanceStateChipProps {
  state: AttendanceStatus
  // Submitted under an approved extension
  isReopened?: boolean
}

// A mentee's own attendance. Only Present is coloured, so a missed session never reads as a
// warning. Use StatusChip on the admin screens.
export function AttendanceStateChip({ state, isReopened = false }: AttendanceStateChipProps) {
  const label = ATTENDANCE_STATUS_LABELS[state]
  return (
    <Chip variant={state === 'present' ? 'ok' : 'default'}>
      {state === 'present' && isReopened ? `${label} (Reopened)` : label}
    </Chip>
  )
}
