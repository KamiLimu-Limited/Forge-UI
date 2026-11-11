// Auth and user types, mapped directly from the Forge API OpenAPI schema

export type AccountState = 'pending' | 'active' | 'suspended'

export type UserRole =
  | 'mentee'
  | 'peer_mentor_1_1'
  | 'peer_mentor_ict'
  | 'professional_mentor'
  | 'committee'
  // A committee member who also creates and edits peer mentorship tasks
  | 'program_delivery_lead'
  // Every System Admin power plus graduating a cohort
  | 'program_lead'
  | 'alumni'
  | 'admin'

export type DegreeLevel = 'diploma' | 'bachelors' | 'masters' | 'doctorate'

export type Gender = 'female' | 'male' | 'non_binary' | 'prefer_not_to_say'

export interface SocialLinks {
  linkedin?: string | null
  github?: string | null
  instagram?: string | null
  twitter?: string | null
  website?: string | null
}

// The profile fields shared by the user, admin user and invite shapes
export interface UserProfileFields {
  university: string | null
  programme_of_study: string | null
  degree_level: DegreeLevel | null
  gender: Gender | null
  phone: string | null
  birthday: string | null
  social_links: SocialLinks | null
}

export interface UserRoleResponse {
  id: string
  role: UserRole
  cohort_id: string | null
  assigned_at: string
}

export interface UserProfileResponse extends UserProfileFields {
  id: string
  email: string
  first_name: string
  last_name: string
  account_state: AccountState
  last_login_at: string | null
  created_at: string
  alumni_since: string | null
  is_alumni: boolean
  roles: UserRoleResponse[]
  active_cohort_id: string | null
  active_role: UserRole | null
  ict_track: string | null
}

// GET /users/me/cohorts: one cohort the user holds roles in
export interface MyCohort {
  cohort: { id: string; name: string; status: 'draft' | 'active' | 'completed' | 'archived' }
  roles: UserRole[]
  is_active_context: boolean
}

export interface ActiveCohortRequest {
  cohort_id: string
  role: UserRole
}

export interface ActiveCohortResponse {
  active_cohort_id: string
  active_role: UserRole
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

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

export interface UserProfileUpdateRequest extends Partial<UserProfileFields> {
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

export interface BulkInviteUserEntry extends Partial<UserProfileFields> {
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
