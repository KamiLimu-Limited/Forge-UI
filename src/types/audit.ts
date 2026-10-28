// =============================================================================
// Audit log types, mapped directly from the Forge API OpenAPI schema
// =============================================================================

import type { PageParams } from '@/types/page'

export interface AuditLogResponse {
  id: string
  user_id: string | null
  // A snake_case code such as "create_session" or "approve_override_request"
  action: string
  resource_type: string | null
  resource_id: string | null
  meta_data: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

export interface AuditLogParams extends PageParams {
  user_id?: string
  action?: string
  resource_type?: string
  resource_id?: string
  since?: string
}
