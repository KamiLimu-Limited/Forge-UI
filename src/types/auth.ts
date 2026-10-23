// =============================================================================
// Auth and user types, mapped directly from the Forge API OpenAPI schema
// =============================================================================

export type AccountState = 'pending' | 'active' | 'suspended'

export type UserRole =
  | 'mentee'
  | 'peer_mentor_1:1'
  | 'peer_mentor_ict'
  | 'professional_mentor'
  | 'committee'
  | 'partner'
  | 'alumni'
  | 'admin'

export interface UserRoleResponse {
  id: string
  role: UserRole
  cohort_id: string | null
  assigned_at: string
}

export interface UserProfileResponse {
  id: string
  email: string
  first_name: string
  last_name: string
  account_state: AccountState
  last_login_at: string | null
  created_at: string
  roles: UserRoleResponse[]
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

// ---- Request shapes ----

export interface LoginRequest {
  email: string
  password: string
}

export interface AccountActivationRequest {
  token: string
  password: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmRequest {
  token: string
  new_password: string
}

export interface TokenRefreshRequest {
  refresh_token: string
}

export interface UserProfileUpdateRequest {
  first_name?: string | null
  last_name?: string | null
}

export interface UserInviteRequest {
  email: string
  first_name: string
  last_name: string
  roles: UserRole[]
  cohort_id?: string | null
}

export interface BulkInviteUserEntry {
  email: string
  first_name: string
  last_name: string
  roles: UserRole[]
}

export interface BulkInviteRequest {
  users: BulkInviteUserEntry[]
  cohort_id?: string | null
}

export interface BulkInviteResultEntry {
  email: string
  success: boolean
  message?: string | null
}

export interface BulkInviteResponse {
  total: number
  successful: number
  failed: number
  results: BulkInviteResultEntry[]
}

// ---- Response shapes ----

export interface SuccessResponse {
  success: boolean
  message: string
}

export interface ErrorResponse {
  success: false
  error: string
  detail?: string | null
}

// ---- API error thrown by the client ----

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ErrorResponse
  ) {
    super(body.error)
    this.name = 'ApiError'
  }
}
