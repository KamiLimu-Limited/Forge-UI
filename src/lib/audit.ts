// =============================================================================
// Plain descriptions of audit log entries for the audit trail and the overview
// =============================================================================

import type { AuditLogResponse } from '@/types/audit'
import { ATTENDANCE_STATUS_LABELS, auditActionLabel } from './labels'
import { formatDateTime } from './format'
import type { AttendanceStatus } from '@/types/attendance'

// Names and titles found for ids in the log, filled in by useAuditLookups
export interface AuditLookups {
  users: Record<string, string>
  sessions: Record<string, string>
}

const RESOURCE_LABELS: Record<string, string> = {
  attendance_record: 'Attendance record',
  attendance_window: 'Attendance window',
  cohort: 'Cohort',
  cohort_enrollment: 'Enrollment',
  competition: 'Competition',
  competition_entry: 'Competition entry',
  extra_activity: 'Extra activity',
  invitation: 'Invitation',
  override_request: 'Override request',
  peer_mentor_task: 'Peer mentor task',
  session: 'Session',
  user: 'User',
}

function text(meta: Record<string, unknown> | null, key: string): string | null {
  const value = meta?.[key]
  return typeof value === 'string' && value.trim() !== '' ? value : null
}

function isStatus(value: string | null): value is AttendanceStatus {
  return value !== null && value in ATTENDANCE_STATUS_LABELS
}

export function auditActor(log: AuditLogResponse, lookups: AuditLookups): string {
  if (!log.user_id) return 'The system'
  return lookups.users[log.user_id] ?? 'A user no longer listed'
}

// What the change touched, in a sentence fragment
export function auditRecord(log: AuditLogResponse, lookups: AuditLookups): string {
  const meta = log.meta_data
  const parts: string[] = []
  const resourceId = log.resource_id

  if (log.resource_type === 'session' && resourceId) {
    parts.push(lookups.sessions[resourceId] ?? 'A session')
  } else if (log.resource_type === 'user' && resourceId) {
    parts.push(lookups.users[resourceId] ?? 'A user')
  } else if (log.resource_type) {
    parts.push(RESOURCE_LABELS[log.resource_type] ?? log.resource_type.replace(/_/g, ' '))
  }

  const role = text(meta, 'role')
  if (role) parts.push(role.replace(/_/g, ' '))
  const email = text(meta, 'email')
  if (email) parts.push(email)
  const oldStatus = text(meta, 'old_status')
  const newStatus = text(meta, 'new_status')
  if (isStatus(oldStatus) && isStatus(newStatus)) {
    parts.push(`${ATTENDANCE_STATUS_LABELS[oldStatus]} to ${ATTENDANCE_STATUS_LABELS[newStatus]}`)
  }
  const to = text(meta, 'to')
  if (log.action === 'reschedule_session' && to) parts.push(`moved to ${formatDateTime(to)}`)
  const reason = text(meta, 'reason')
  if (reason) parts.push(`reason: ${reason}`)
  const fields = meta?.fields
  if (Array.isArray(fields) && fields.length > 0) {
    parts.push(
      `changed ${fields
        .filter((f) => typeof f === 'string')
        .join(', ')
        .replace(/_/g, ' ')}`
    )
  }

  return parts.join(', ') || 'No details recorded'
}

export function auditAction(log: AuditLogResponse): string {
  return auditActionLabel(log.action)
}
