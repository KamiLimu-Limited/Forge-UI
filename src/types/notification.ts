// =============================================================================
// Notification types, mapped directly from the Forge API OpenAPI schema
// =============================================================================

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
