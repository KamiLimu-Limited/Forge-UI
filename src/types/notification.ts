// =============================================================================
// Notification types, mapped directly from the Forge API OpenAPI schema
// =============================================================================

import type { UserRole } from '@/types/auth'
import type { PageParams } from '@/types/page'

export interface NotificationResponse {
  id: string
  notification_type: string
  title: string
  message: string
  meta_data: Record<string, unknown> | null
  related_resource_type: string | null
  related_resource_id: string | null
  read_at: string | null
  created_at: string
}

export interface NotificationListParams extends PageParams {
  unread_only?: boolean
  notification_type?: string
}

export interface MarkAllReadResponse {
  updated: number
}

export type NotificationType =
  | 'session_published'
  | 'session_rescheduled'
  | 'session_cancelled'
  | 'attendance_window_opening'
  | 'attendance_window_closing_soon'
  | 'graduation_warning'
  | 'graduation_at_risk'
  | 'override_request_submitted'
  | 'override_request_approved'
  | 'override_request_denied'
  | 'extra_activity_approved'
  | 'extra_activity_rejected'
  | 'peer_task_launched'
  | 'peer_task_deadline_reminder'
  | 'cohort_onboarding_invitation'
  | 'broadcast'

export type EmailStatus = 'pending' | 'sent' | 'failed' | 'skipped'

// GET /notifications/failed (admin only)
export interface AdminNotificationResponse extends NotificationResponse {
  user_id: string
  email_status: EmailStatus
  email_attempts: number
  email_last_error: string | null
  sent_at: string | null
}

// POST /notifications/broadcast (admin only). No cohort and no roles means everyone.
export interface BroadcastRequest {
  title: string
  message: string
  cohort_id?: string | null
  roles?: UserRole[] | null
  send_email?: boolean
}

export interface BroadcastResponse {
  recipients: number
}
