import { Chip, type ChipVariant } from '@/components/ui/Chip'
import {
  ACCOUNT_STATE_LABELS,
  ACTIVITY_STATUS_LABELS,
  ATTENDANCE_STATUS_LABELS,
  COHORT_STATUS_LABELS,
  OVERRIDE_STATUS_LABELS,
  SESSION_STATUS_LABELS,
} from '@/lib/labels'
import type { ActivityStatus } from '@/types/activity'
import type { AttendanceStatus, OverrideRequestStatus } from '@/types/attendance'
import type { AccountState } from '@/types/auth'
import type { CohortStatus } from '@/types/cohort'
import type { SessionStatus } from '@/types/session'

// One prop per status family, so the label and colour always come from the same place
type StatusChipProps =
  | { kind: 'account'; status: AccountState }
  | { kind: 'invitation'; status: 'pending' }
  | { kind: 'session'; status: SessionStatus; isLive?: boolean }
  | { kind: 'attendance'; status: AttendanceStatus }
  | { kind: 'override'; status: OverrideRequestStatus }
  | { kind: 'activity'; status: ActivityStatus }
  | { kind: 'cohort'; status: CohortStatus }

const ACCOUNT: Record<AccountState, ChipVariant> = {
  active: 'ok',
  pending: 'warn',
  suspended: 'err',
}

const SESSION: Record<SessionStatus, ChipVariant> = {
  draft: 'draft',
  published: 'default',
  cancelled: 'err',
  completed: 'default',
}

const ATTENDANCE: Record<AttendanceStatus, ChipVariant> = {
  attended: 'ok',
  not_attended: 'err',
  missed: 'default',
  excused: 'info',
  pending: 'warn',
  disputed: 'warn',
}

const OVERRIDE: Record<OverrideRequestStatus, ChipVariant> = {
  pending: 'warn',
  approved: 'ok',
  denied: 'err',
}

const ACTIVITY: Record<ActivityStatus, ChipVariant> = {
  pending: 'default',
  approved: 'ok',
  rejected: 'default',
}

const COHORT: Record<CohortStatus, ChipVariant> = {
  draft: 'draft',
  active: 'ok',
  completed: 'default',
}

function resolve(props: StatusChipProps): { variant: ChipVariant; label: string } {
  switch (props.kind) {
    case 'account':
      return { variant: ACCOUNT[props.status], label: ACCOUNT_STATE_LABELS[props.status] }
    case 'invitation':
      return { variant: 'draft', label: 'Pending invite' }
    case 'session':
      if (props.isLive && props.status === 'published') return { variant: 'ok', label: 'Live' }
      if (props.status === 'draft')
        return { variant: 'draft', label: 'Draft, only admins can see this' }
      return { variant: SESSION[props.status], label: SESSION_STATUS_LABELS[props.status] }
    case 'attendance':
      return { variant: ATTENDANCE[props.status], label: ATTENDANCE_STATUS_LABELS[props.status] }
    case 'override':
      return { variant: OVERRIDE[props.status], label: OVERRIDE_STATUS_LABELS[props.status] }
    case 'activity':
      return { variant: ACTIVITY[props.status], label: ACTIVITY_STATUS_LABELS[props.status] }
    case 'cohort':
      return { variant: COHORT[props.status], label: COHORT_STATUS_LABELS[props.status] }
  }
}

export function StatusChip(props: StatusChipProps) {
  const { variant, label } = resolve(props)
  return <Chip variant={variant}>{label}</Chip>
}
