// =============================================================================
// Admin types, mapped directly from the Forge API OpenAPI schema
// =============================================================================

import type { AccountState, UserRoleResponse } from '@/types/auth'

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

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
