// Invitation types, mapped directly from the Forge API OpenAPI schema

import type { UserRole } from '@/types/auth'
import type { PageParams } from '@/types/page'

export interface InvitationResponse {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  intended_roles: UserRole[] | null
  intended_cohort_id: string | null
  invited_by: string
  expires_at: string
  created_at: string
  used_at: string | null
  revoked_at: string | null
}

export interface InvitationListParams extends PageParams {
  pending_only?: boolean
}

// GET /auth/invitations/{token}: who a still-valid invitation is for
export interface InvitationPreview {
  email: string
  first_name: string | null
  last_name: string | null
  intended_roles: UserRole[] | null
  expires_at: string
}
