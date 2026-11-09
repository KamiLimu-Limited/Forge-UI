import { Chip } from '@/components/ui/Chip'
import { ATTENDANCE_STATUS_LABELS } from '@/lib/labels'
import type { AttendanceStatus } from '@/types/attendance'

interface AttendanceStateChipProps {
  state: AttendanceStatus
}

// A mentee's own attendance. Only Present is coloured, so a missed session never reads as a
// warning. Use StatusChip on the admin screens.
export function AttendanceStateChip({ state }: AttendanceStateChipProps) {
  return (
    <Chip variant={state === 'attended' ? 'ok' : 'default'}>{ATTENDANCE_STATUS_LABELS[state]}</Chip>
  )
}
