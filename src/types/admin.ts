// =============================================================================
// Admin types, mapped directly from the Forge API OpenAPI schema
// =============================================================================

import type { AccountState, UserRole, UserRoleResponse } from '@/types/auth'
import type { Page, PageParams } from '@/types/page'

/** @deprecated Use `Page<T>` from `@/types/page`. */
export type PaginatedResponse<T> = Page<T>

export interface AdminUserListResponse {
  id: string
  email: string
  first_name: string
  last_name: string
  account_state: AccountState
  last_login_at: string | null
  created_at: string
}

export interface AdminUserDetailResponse {
  id: string
  email: string
  first_name: string
  last_name: string
  account_state: AccountState
  last_login_at: string | null
  created_at: string
  updated_at: string
  roles: UserRoleResponse[]
}

export interface AdminUserUpdateRequest {
  first_name?: string | null
  last_name?: string | null
  email?: string | null
}

export interface AdminUserListParams extends PageParams {
  account_state?: AccountState
  role?: UserRole
  cohort_id?: string
  search?: string
}

export interface RoleAssignmentRequest {
  role: UserRole
  cohort_id?: string | null
}
