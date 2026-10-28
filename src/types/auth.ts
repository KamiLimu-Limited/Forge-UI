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

// One entry of a 422 validation error
export interface ValidationIssue {
  loc?: Array<string | number>
  msg?: string
}

// `error` is a code such as "business_rule_violation"; `detail` is the readable message
export interface ErrorResponse {
  success: false
  error: string
  detail?: string | ValidationIssue[] | null
}

// ---- API error thrown by the client ----

// Plain words for the codes the API returns when it gives no detail
const ERROR_CODE_MESSAGES: Record<string, string> = {
  unauthorized: 'Your session has ended. Sign in again.',
  forbidden: "You don't have permission to do that.",
  not_found: "We couldn't find that record.",
  conflict: 'That clashes with an existing record.',
  rate_limited: 'Too many attempts. Wait a minute and try again.',
  validation_error: 'Some of the details are not valid.',
}

function readableMessage(body: ErrorResponse): string {
  const { detail, error } = body
  if (typeof detail === 'string' && detail.trim() !== '') return detail
  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((issue) => {
        const field = issue.loc?.filter((part) => part !== 'body').join(' ')
        return field ? `${field}: ${issue.msg ?? 'not valid'}` : (issue.msg ?? 'Not valid')
      })
      .join('. ')
  }
  return ERROR_CODE_MESSAGES[error] ?? 'Something went wrong. Try again.'
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ErrorResponse
  ) {
    super(readableMessage(body))
    this.name = 'ApiError'
  }
}
