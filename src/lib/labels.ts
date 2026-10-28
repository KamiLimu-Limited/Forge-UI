// =============================================================================
// Plain-language labels for API enum values. Use these wherever a value is shown.
// =============================================================================

import type { ActivityStatus, ActivityType, EventRole } from '@/types/activity'
import type { AttendanceStatus, OverrideRequestStatus } from '@/types/attendance'
import type { AccountState } from '@/types/auth'
import type { CohortStatus } from '@/types/cohort'
import type { SessionCategory, SessionMode, SessionStatus } from '@/types/session'

export const CATEGORY_LABELS: Record<SessionCategory, string> = {
  thursday: 'Thursday session',
  saturday: 'Saturday session',
  peer_mentorship: 'Peer mentorship',
}

// Shorter labels for the category picker
export const CATEGORY_OPTIONS: { value: SessionCategory; label: string }[] = [
  { value: 'thursday', label: 'Thursday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'peer_mentorship', label: 'Peer mentorship task' },
]

export const SESSION_STATUS_LABELS: Record<SessionStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  cancelled: 'Cancelled',
  completed: 'Completed',
}

export const MODE_LABELS: Record<SessionMode, string> = {
  physical: 'In person',
  virtual: 'Virtual',
  hybrid: 'Hybrid',
}

// "disputed" is never offered as a choice
export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  attended: 'Present',
  not_attended: 'Absent',
  missed: 'Missed',
  excused: 'Excused',
  pending: 'Pending',
  disputed: 'Disputed',
}

export const OVERRIDE_STATUS_LABELS: Record<OverrideRequestStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  denied: 'Denied',
}

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  academic: 'KamiLimu to Academia',
  event: 'External event',
  opportunity: 'Application',
  consultation: 'Consultation',
}

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  pending: 'Logged',
  approved: 'Approved',
  rejected: 'Reversed',
}

export const EVENT_ROLE_LABELS: Record<EventRole, string> = {
  attendee: 'participant',
  speaker: 'speaker',
  volunteer: 'volunteer',
  organizer: 'organizer',
  panelist: 'panelist',
}

export const ACCOUNT_STATE_LABELS: Record<AccountState, string> = {
  active: 'Active',
  pending: 'Pending',
  suspended: 'Suspended',
}

export const COHORT_STATUS_LABELS: Record<CohortStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  completed: 'Archived',
}

// The six KamiLimu pillars, in the order the designs list them
export type Pillar =
  | 'ict'
  | 'innovation'
  | 'personal-dev'
  | 'professional-dev'
  | 'scholarship'
  | 'community'

export const PILLAR_LABELS: Record<Pillar, string> = {
  ict: 'ICT',
  innovation: 'Innovation',
  'personal-dev': 'Personal Development',
  'professional-dev': 'Professional Development',
  scholarship: 'Scholarship',
  community: 'Community Engagement',
}

export const ALL_PILLARS: Pillar[] = [
  'ict',
  'innovation',
  'personal-dev',
  'professional-dev',
  'scholarship',
  'community',
]

// Audit actions as a past-tense phrase, for the audit trail and "Recent changes"
const AUDIT_ACTION_LABELS: Record<string, string> = {
  account_activated: 'Activated account',
  admin_update_user: 'Edited user details',
  approve_extra_activity: 'Approved activity',
  reject_extra_activity: 'Reversed activity',
  approve_override_request: 'Approved override',
  deny_override_request: 'Denied override',
  assign_role: 'Assigned role',
  remove_role: 'Removed role',
  bulk_enroll: 'Enrolled users',
  enroll_user: 'Enrolled user',
  remove_enrollment: 'Removed enrollment',
  update_enrollment: 'Changed assignment',
  cancel_session: 'Cancelled session',
  create_session: 'Created session',
  update_session: 'Edited session',
  reschedule_session: 'Rescheduled session',
  update_session_resources: 'Changed session resources',
  close_attendance_window: 'Closed attendance window',
  set_attendance_status: 'Changed attendance',
  create_cohort: 'Created cohort',
  update_cohort: 'Changed cohort setting',
  delete_cohort: 'Deleted cohort',
  invite_user: 'Invited user',
  resend_invitation: 'Resent invitation',
  revoke_invitation: 'Revoked invitation',
  suspend_user: 'Suspended user',
  activate_user: 'Reactivated user',
  login: 'Signed in',
  logout: 'Signed out',
  password_reset: 'Reset password',
}

export function auditActionLabel(action: string): string {
  const known = AUDIT_ACTION_LABELS[action]
  if (known) return known
  const words = action.replace(/_/g, ' ').trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

// Filter choices for the audit trail, keyed by the record type the API filters on
export const AUDIT_RESOURCE_FILTERS: { value: string; label: string }[] = [
  { value: 'override_request', label: 'Overrides' },
  { value: 'attendance_record', label: 'Attendance changes' },
  { value: 'session', label: 'Session changes' },
  { value: 'user', label: 'Role and account changes' },
  { value: 'cohort_enrollment', label: 'ICT track and mentor changes' },
  { value: 'extra_activity', label: 'Reversals' },
  { value: 'invitation', label: 'Invitations' },
  { value: 'cohort', label: 'Cohort settings' },
]
