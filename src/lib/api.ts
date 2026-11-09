// =============================================================================
// Forge API Client
// Single source of all API calls. Never call fetch() anywhere else.
// =============================================================================

import type {
  TokenResponse,
  UserProfileResponse,
  LoginRequest,
  AccountActivationRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  TokenRefreshRequest,
  UserProfileUpdateRequest,
  UserInviteRequest,
  BulkInviteRequest,
  BulkInviteResponse,
  SuccessResponse,
  ErrorResponse,
  UserRoleResponse,
} from '@/types/auth'
import { ApiError } from '@/types/auth'
import type {
  AdminUserListParams,
  AdminUserListResponse,
  AdminUserDetailResponse,
  AdminUserUpdateRequest,
  RoleAssignmentRequest,
} from '@/types/admin'
import type {
  AcademicActivityRequest,
  ActivityListParams,
  ActivityReviewRequest,
  ActivityUpdateRequest,
  ConsultationSessionRequest,
  ExternalEventRequest,
  ExtraActivityResponse,
  OpportunityApplicationRequest,
} from '@/types/activity'
import type {
  AttendanceListParams,
  AttendanceResponse,
  AttendanceStatusUpdateRequest,
  AttendanceSubmissionRequest,
  AttendanceUpdateRequest,
  MyAttendanceResponse,
  OverrideListParams,
  OverrideRequestCreate,
  OverrideRequestResponse,
  OverrideReviewRequest,
  WindowStatusResponse,
} from '@/types/attendance'
import type { AuditLogParams, AuditLogResponse } from '@/types/audit'
import type {
  CalendarMonth,
  CohortCreateRequest,
  CohortDetailResponse,
  CohortListParams,
  CohortResponse,
  CohortUpdateRequest,
} from '@/types/cohort'
import type {
  AttendanceRateResponse,
  CohortHealthResponse,
  GroupOverview,
  MenteeDrilldown,
  MenteeOverviewResponse,
  SessionPointsEntry,
} from '@/types/dashboard'
import type {
  EnrollmentListParams,
  EnrollmentResponse,
  EnrollmentUpdateRequest,
} from '@/types/enrollment'
import type { InvitationListParams, InvitationResponse } from '@/types/invitation'
import type { FinalStatusResponse } from '@/types/alumni'
import type { TrackOverviewResponse, TrackSessionEntry } from '@/types/ictPeerMentor'
import type { DimensionRankingResponse, LeaderboardDimension } from '@/types/leaderboard'
import type {
  MarkAllReadResponse,
  NotificationListParams,
  NotificationResponse,
} from '@/types/notification'
import type { Page } from '@/types/page'
import type {
  MentorAssignment,
  ResourceIn,
  SessionCancelRequest,
  SessionCreateRequest,
  SessionDetailResponse,
  SessionListParams,
  SessionRescheduleRequest,
  SessionResponse,
  SessionUpdateRequest,
} from '@/types/session'
import type {
  SkillProgressResponse,
  SkillRatingRequest,
  SkillRatingResponse,
  SkillRatingWindowStatus,
} from '@/types/skills'
import { API_BASE_URL } from './config'

// -----------------------------------------------------------------------------
// Token storage
// -----------------------------------------------------------------------------

const TOKEN_KEY = 'forge_access_token'
const REFRESH_KEY = 'forge_refresh_token'

export const tokenStore = {
  getAccess: (): string | null => localStorage.getItem(TOKEN_KEY),
  getRefresh: (): string | null => localStorage.getItem(REFRESH_KEY),
  set: (access: string, refresh: string): void => {
    localStorage.setItem(TOKEN_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
  },
  clear: (): void => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}

// -----------------------------------------------------------------------------
// Core request function
// -----------------------------------------------------------------------------

// Requests that get a 401 while a refresh is running share it. Keyed by the
// refresh token so a sign-out and a new sign-in never join the old session's refresh.
let pendingRefresh: { refreshToken: string; accessToken: Promise<string> } | null = null

function unauthorized(): ApiError {
  return new ApiError(401, { success: false, error: 'unauthorized' })
}

function refreshAccessToken(refreshToken: string): Promise<string> {
  if (pendingRefresh?.refreshToken === refreshToken) return pendingRefresh.accessToken

  const accessToken = api.auth
    .refresh({ refresh_token: refreshToken })
    .then((tokens) => {
      // Signed out (or signed in as someone else) while the refresh was in flight
      if (tokenStore.getRefresh() !== refreshToken) throw unauthorized()
      tokenStore.set(tokens.access_token, tokens.refresh_token)
      return tokens.access_token
    })
    .finally(() => {
      if (pendingRefresh?.accessToken === accessToken) pendingRefresh = null
    })
  pendingRefresh = { refreshToken, accessToken }
  return accessToken
}

// Reads a JSON body, or undefined for 204 and other empty responses
async function readBody<T>(res: Response): Promise<T> {
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

async function readError(res: Response): Promise<ApiError> {
  let body: ErrorResponse
  try {
    body = (await res.json()) as ErrorResponse
  } catch {
    body = { success: false, error: `http_${res.status}`, detail: null }
  }
  return new ApiError(res.status, body)
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  authenticated = true
): Promise<T> {
  // FormData sets its own multipart Content-Type with the boundary
  const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData
  const headers: Record<string, string> = {
    ...(isForm ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string>),
  }

  if (authenticated) {
    const token = tokenStore.getAccess()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })

  // Attempt token refresh on 401
  if (res.status === 401 && authenticated) {
    const refresh = tokenStore.getRefresh()
    if (!refresh) {
      tokenStore.clear()
      window.location.replace('/login')
      throw unauthorized()
    }

    let newToken: string
    try {
      newToken = await refreshAccessToken(refresh)
    } catch {
      // Only end the session this request belonged to, not one started since
      if (tokenStore.getRefresh() === refresh) {
        tokenStore.clear()
        window.location.replace('/login')
      }
      throw unauthorized()
    }

    headers['Authorization'] = `Bearer ${newToken}`
    const retried = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
    if (!retried.ok) throw await readError(retried)
    return readBody<T>(retried)
  }

  if (!res.ok) throw await readError(res)

  return readBody<T>(res)
}

type QueryValue = string | number | boolean | null | undefined

// "?a=1&b=2" from the defined values, or "" when there are none
function qs(params?: object): string {
  if (!params) return ''
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params) as Array<[string, QueryValue]>) {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value))
  }
  const text = query.toString()
  return text ? `?${text}` : ''
}

function json(method: string, body: unknown): RequestInit {
  return { method, body: JSON.stringify(body) }
}

// Every item of a paginated list. The API caps page_size at 100.
export async function fetchAllPages<T>(
  load: (page: number, pageSize: number) => Promise<Page<T>>
): Promise<T[]> {
  const first = await load(1, 100)
  const items = [...first.items]
  for (let page = 2; page <= first.total_pages; page++) {
    items.push(...(await load(page, 100)).items)
  }
  return items
}

// -----------------------------------------------------------------------------
// API namespaces
// -----------------------------------------------------------------------------

export const api = {
  auth: {
    login: (body: LoginRequest) =>
      request<TokenResponse>(
        '/api/v1/auth/login',
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
        false
      ),

    activate: (body: AccountActivationRequest) =>
      request<TokenResponse>(
        '/api/v1/auth/activate',
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
        false
      ),

    refresh: (body: TokenRefreshRequest) =>
      request<TokenResponse>(
        '/api/v1/auth/refresh',
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
        false
      ),

    // Takes the tokens explicitly because sign-out clears them from storage first.
    // The API reads refresh_token from the body, never the query string.
    logout: (accessToken: string, refreshToken?: string) =>
      request<SuccessResponse>(
        '/api/v1/auth/logout',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify(refreshToken ? { refresh_token: refreshToken } : {}),
        },
        false
      ),

    requestReset: (body: PasswordResetRequest) =>
      request<SuccessResponse>(
        '/api/v1/auth/request-reset',
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
        false
      ),

    resetPassword: (body: PasswordResetConfirmRequest) =>
      request<SuccessResponse>(
        '/api/v1/auth/reset-password',
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
        false
      ),

    invite: (body: UserInviteRequest) =>
      request<InvitationResponse>('/api/v1/auth/invite', json('POST', body)),

    bulkInvite: (body: BulkInviteRequest) =>
      request<BulkInviteResponse>('/api/v1/auth/bulk-invite', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    // CSV columns: email, first_name, last_name, roles
    bulkInviteCsv: (file: File, cohortId?: string | null) => {
      const form = new FormData()
      form.append('file', file)
      if (cohortId) form.append('cohort_id', cohortId)
      return request<BulkInviteResponse>('/api/v1/auth/bulk-invite/csv', {
        method: 'POST',
        body: form,
      })
    },
  },

  users: {
    getMe: () => request<UserProfileResponse>('/api/v1/users/me'),
    updateMe: (body: UserProfileUpdateRequest) =>
      request<UserProfileResponse>('/api/v1/users/me', {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
  },

  admin: {
    users: {
      list: (params?: AdminUserListParams) =>
        request<Page<AdminUserListResponse>>(`/api/v1/admin/users${qs(params)}`),

      getById: (userId: string) =>
        request<AdminUserDetailResponse>(`/api/v1/admin/users/${userId}`),

      update: (userId: string, body: AdminUserUpdateRequest) =>
        request<AdminUserDetailResponse>(`/api/v1/admin/users/${userId}`, json('PATCH', body)),

      suspend: (userId: string) =>
        request<SuccessResponse>(`/api/v1/admin/users/${userId}/suspend`, { method: 'POST' }),

      activate: (userId: string) =>
        request<SuccessResponse>(`/api/v1/admin/users/${userId}/activate`, { method: 'POST' }),

      addRole: (userId: string, body: RoleAssignmentRequest) =>
        request<UserRoleResponse>(`/api/v1/admin/users/${userId}/roles`, json('POST', body)),

      removeRole: (userId: string, assignmentId: string) =>
        request<void>(`/api/v1/admin/users/${userId}/roles/${assignmentId}`, {
          method: 'DELETE',
        }),
    },

    invitations: {
      list: (params?: InvitationListParams) =>
        request<Page<InvitationResponse>>(`/api/v1/admin/invitations${qs(params)}`),

      resend: (invitationId: string) =>
        request<InvitationResponse>(`/api/v1/admin/invitations/${invitationId}/resend`, {
          method: 'POST',
        }),

      revoke: (invitationId: string) =>
        request<void>(`/api/v1/admin/invitations/${invitationId}`, { method: 'DELETE' }),
    },

    auditLogs: {
      list: (params?: AuditLogParams) =>
        request<Page<AuditLogResponse>>(`/api/v1/admin/audit-logs${qs(params)}`),
    },
  },

  cohorts: {
    list: (params?: CohortListParams) =>
      request<Page<CohortResponse>>(`/api/v1/cohorts${qs(params)}`),

    getById: (cohortId: string) => request<CohortDetailResponse>(`/api/v1/cohorts/${cohortId}`),

    create: (body: CohortCreateRequest) =>
      request<CohortResponse>('/api/v1/cohorts', json('POST', body)),

    update: (cohortId: string, body: CohortUpdateRequest) =>
      request<CohortResponse>(`/api/v1/cohorts/${cohortId}`, json('PATCH', body)),

    calendar: (cohortId: string) =>
      request<CalendarMonth[]>(`/api/v1/cohorts/${cohortId}/calendar`),

    calendarMonth: (cohortId: string, month: number) =>
      request<CalendarMonth[]>(`/api/v1/cohorts/${cohortId}/calendar/${month}`),

    enrollments: {
      list: (cohortId: string, params?: EnrollmentListParams) =>
        request<Page<EnrollmentResponse>>(`/api/v1/cohorts/${cohortId}/enrollments${qs(params)}`),

      update: (cohortId: string, enrollmentId: string, body: EnrollmentUpdateRequest) =>
        request<EnrollmentResponse>(
          `/api/v1/cohorts/${cohortId}/enrollments/${enrollmentId}`,
          json('PATCH', body)
        ),
    },

    attendance: (cohortId: string, params?: AttendanceListParams) =>
      request<Page<AttendanceResponse>>(`/api/v1/cohorts/${cohortId}/attendance${qs(params)}`),
  },

  sessions: {
    list: (params?: SessionListParams) =>
      request<Page<SessionResponse>>(`/api/v1/sessions${qs(params)}`),

    getById: (sessionId: string) => request<SessionDetailResponse>(`/api/v1/sessions/${sessionId}`),

    attendanceWindow: (sessionId: string) =>
      request<WindowStatusResponse>(`/api/v1/sessions/${sessionId}/attendance-window`),

    create: (body: SessionCreateRequest) =>
      request<SessionResponse>('/api/v1/sessions', json('POST', body)),

    update: (sessionId: string, body: SessionUpdateRequest) =>
      request<SessionResponse>(`/api/v1/sessions/${sessionId}`, json('PATCH', body)),

    reschedule: (sessionId: string, body: SessionRescheduleRequest) =>
      request<SessionResponse>(`/api/v1/sessions/${sessionId}/reschedule`, json('POST', body)),

    cancel: (sessionId: string, body: SessionCancelRequest) =>
      request<void>(`/api/v1/sessions/${sessionId}`, json('DELETE', body)),

    setMentors: (sessionId: string, mentors: MentorAssignment[]) =>
      request<SessionResponse>(`/api/v1/sessions/${sessionId}/mentors`, json('PUT', { mentors })),

    setResources: (sessionId: string, resources: ResourceIn[]) =>
      request<SessionResponse>(
        `/api/v1/sessions/${sessionId}/resources`,
        json('PATCH', { resources })
      ),
  },

  attendance: {
    mine: (params?: AttendanceListParams) =>
      request<Page<MyAttendanceResponse>>(`/api/v1/attendance/me${qs(params)}`),

    submit: (body: AttendanceSubmissionRequest) =>
      request<MyAttendanceResponse>('/api/v1/attendance', json('POST', body)),

    update: (recordId: string, body: AttendanceUpdateRequest) =>
      request<MyAttendanceResponse>(`/api/v1/attendance/${recordId}`, json('PATCH', body)),

    setStatus: (recordId: string, body: AttendanceStatusUpdateRequest) =>
      request<AttendanceResponse>(`/api/v1/attendance/${recordId}/status`, json('PATCH', body)),

    overrideRequests: {
      create: (body: OverrideRequestCreate) =>
        request<OverrideRequestResponse>(
          '/api/v1/attendance/override-requests',
          json('POST', body)
        ),

      list: (params?: OverrideListParams) =>
        request<Page<OverrideRequestResponse>>(`/api/v1/attendance/override-requests${qs(params)}`),

      approve: (requestId: string, body: OverrideReviewRequest) =>
        request<OverrideRequestResponse>(
          `/api/v1/attendance/override-requests/${requestId}/approve`,
          json('PATCH', body)
        ),

      deny: (requestId: string, body: OverrideReviewRequest) =>
        request<OverrideRequestResponse>(
          `/api/v1/attendance/override-requests/${requestId}/deny`,
          json('PATCH', body)
        ),
    },
  },

  extraActivities: {
    list: (params?: ActivityListParams) =>
      request<Page<ExtraActivityResponse>>(`/api/v1/extra-activities${qs(params)}`),

    mine: (params?: ActivityListParams) =>
      request<Page<ExtraActivityResponse>>(`/api/v1/extra-activities/me${qs(params)}`),

    getById: (activityId: string) =>
      request<ExtraActivityResponse>(`/api/v1/extra-activities/${activityId}`),

    logAcademic: (body: AcademicActivityRequest) =>
      request<ExtraActivityResponse>('/api/v1/extra-activities/academic', json('POST', body)),

    logEvent: (body: ExternalEventRequest) =>
      request<ExtraActivityResponse>('/api/v1/extra-activities/events', json('POST', body)),

    logOpportunity: (body: OpportunityApplicationRequest) =>
      request<ExtraActivityResponse>('/api/v1/extra-activities/opportunities', json('POST', body)),

    logConsultation: (body: ConsultationSessionRequest) =>
      request<ExtraActivityResponse>('/api/v1/extra-activities/consultations', json('POST', body)),

    update: (activityId: string, body: ActivityUpdateRequest) =>
      request<ExtraActivityResponse>(`/api/v1/extra-activities/${activityId}`, json('PATCH', body)),

    reject: (activityId: string, body: ActivityReviewRequest) =>
      request<ExtraActivityResponse>(
        `/api/v1/extra-activities/${activityId}/reject`,
        json('PATCH', body)
      ),
  },

  dashboard: {
    cohortHealth: (cohortId: string) =>
      request<CohortHealthResponse>(
        `/api/v1/dashboard/committee/cohort-health${qs({ cohort_id: cohortId })}`
      ),

    mentee: {
      // A past cohort's id gives an alumnus their old numbers
      overview: (cohortId?: string) =>
        request<MenteeOverviewResponse>(
          `/api/v1/dashboard/mentee/overview${qs({ cohort_id: cohortId })}`
        ),

      history: (cohortId: string) =>
        request<SessionPointsEntry[]>(
          `/api/v1/dashboard/mentee/attendance/history${qs({ cohort_id: cohortId })}`
        ),
    },
  },

  peerMentor: {
    group: () => request<GroupOverview>('/api/v1/dashboard/peer-mentor/group'),

    mentee: (menteeId: string) =>
      request<MenteeDrilldown>(`/api/v1/dashboard/peer-mentor/mentees/${menteeId}`),

    groupAttendance: (params?: AttendanceListParams) =>
      request<Page<AttendanceResponse>>(`/api/v1/peer-mentors/me/attendance${qs(params)}`),
  },

  mentees: {
    finalStatus: (menteeId: string, cohortId: string) =>
      request<FinalStatusResponse>(
        `/api/v1/mentees/${menteeId}/graduation-status${qs({ cohort_id: cohortId })}`
      ),

    attendanceRates: (menteeId: string, cohortId: string) =>
      request<AttendanceRateResponse>(
        `/api/v1/mentees/${menteeId}/attendance-rates${qs({ cohort_id: cohortId })}`
      ),
  },

  ictPeerMentor: {
    trackOverview: (cohortId: string) =>
      request<TrackOverviewResponse>(
        `/api/v1/dashboard/ict-peer-mentor/track-overview${qs({ cohort_id: cohortId })}`
      ),

    sessions: (cohortId: string) =>
      request<TrackSessionEntry[]>(
        `/api/v1/dashboard/ict-peer-mentor/sessions${qs({ cohort_id: cohortId })}`
      ),
  },

  notifications: {
    mine: (params?: NotificationListParams) =>
      request<Page<NotificationResponse>>(`/api/v1/notifications/me${qs(params)}`),

    // The API returns one count in an object; its key isn't documented
    unreadCount: () =>
      request<{ unread: number }>('/api/v1/notifications/me/unread-count').then(
        (counts) => counts.unread
      ),

    markRead: (notificationId: string) =>
      request<NotificationResponse>(
        `/api/v1/notifications/${notificationId}/read`,
        json('PATCH', {})
      ),

    markAllRead: () =>
      request<MarkAllReadResponse>('/api/v1/notifications/read-all', json('PATCH', {})),
  },

  skills: {
    windows: (cohortId: string) =>
      request<SkillRatingWindowStatus[]>(
        `/api/v1/skill-ratings/windows${qs({ cohort_id: cohortId })}`
      ),

    progress: (menteeId: string, cohortId: string) =>
      request<SkillProgressResponse>(
        `/api/v1/mentees/${menteeId}/skill-progress${qs({ cohort_id: cohortId })}`
      ),

    rate: (body: SkillRatingRequest) =>
      request<SkillRatingResponse>('/api/v1/skill-ratings', json('POST', body)),
  },

  leaderboard: {
    dimension: (cohortId: string, dimension: LeaderboardDimension) =>
      request<DimensionRankingResponse>(`/api/v1/cohorts/${cohortId}/leaderboard/${dimension}`),
  },
}
