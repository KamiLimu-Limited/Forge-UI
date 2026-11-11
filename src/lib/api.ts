// Single source of all API calls. Never call fetch() anywhere else.

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
  MyCohort,
  ActiveCohortRequest,
  ActiveCohortResponse,
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
  ActivityReversalRequest,
  ActivityUpdateRequest,
  ConsultantRequest,
  ConsultantResponse,
  ConsultationSessionRequest,
  ExternalEventRequest,
  ExtraActivityResponse,
  OpportunityApplicationRequest,
  ScholarshipApplicationRequest,
} from '@/types/activity'
import type {
  AttendanceListParams,
  AttendanceResponse,
  AttendanceStatusUpdateRequest,
  AttendanceSubmissionRequest,
  AttendanceUpdateRequest,
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
  IctTrackResponse,
  IctTracksRequest,
  PointsConfig,
  TrackOverrideRequest,
  TrackSelectionResponse,
  TrackSelectionWindow,
} from '@/types/cohort'
import type {
  AttendanceRateResponse,
  CohortHealthResponse,
  GraduationStatusResponse,
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
import type {
  InvitationListParams,
  InvitationPreview,
  InvitationResponse,
} from '@/types/invitation'
import type { TrackOverviewResponse, TrackSessionEntry } from '@/types/ictPeerMentor'
import type {
  DimensionRankingResponse,
  LeaderboardDimension,
  LeaderboardKind,
  LeaderboardSnapshotResponse,
  PeerMentorDimension,
  PeerMentorLeaderboardResponse,
} from '@/types/leaderboard'
import type {
  AdminNotificationResponse,
  BroadcastRequest,
  BroadcastResponse,
  MarkAllReadResponse,
  NotificationListParams,
  NotificationResponse,
} from '@/types/notification'
import type {
  ActivityEngagementResponse,
  AttendanceTrendResponse,
  CrossCohortResponse,
  LeaderboardResponse,
  SessionQualityResponse,
  TrackPerformanceResponse,
} from '@/types/analytics'
import type {
  AlumniCohort,
  GraduationCard,
  GraduationCorrectionRequest,
  GraduationCorrectionResponse,
  GraduationPanel,
  GraduationPreview,
  GraduationRecord,
  GraduationReportResponse,
  GraduationSequenceResponse,
} from '@/types/graduation'
import type { Page, PageParams } from '@/types/page'
import type {
  FacilitatedSession,
  FacilitatorSummary,
  PeerMentorAverage,
  RatingTrendPoint,
  SessionAttendanceSummary,
  SessionRatings,
} from '@/types/proMentor'
import type { RatingQuestion, SessionFeedbackResponse } from '@/types/sessionFeedback'
import type {
  InProgressSession,
  MentorAssignment,
  ResourceIn,
  SessionCancelRequest,
  SessionCreateRequest,
  SessionDetailResponse,
  SessionListParams,
  SessionNoteResponse,
  SessionRescheduleRequest,
  SessionResponse,
  SessionUpdateRequest,
} from '@/types/session'
import type {
  ObjectiveCreateRequest,
  ObjectiveRatingRequest,
  ObjectiveResponse,
  ObjectiveUpdateRequest,
  ObjectiveWindowsResponse,
} from '@/types/objective'
import { API_BASE_URL } from './config'

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
  authenticated = true,
  // How to read a successful response; CSV downloads read plain text
  read: (res: Response) => Promise<T> = readBody
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
    return read(retried)
  }

  if (!res.ok) throw await readError(res)

  return read(res)
}

type QueryValue = string | number | boolean | null | undefined

function readText(res: Response): Promise<string> {
  return res.text()
}

// A CSV file's text, from a GET or POST export route
function requestCsv(path: string, method: 'GET' | 'POST' = 'GET'): Promise<string> {
  return request<string>(path, { method, headers: { Accept: 'text/csv' } }, true, readText)
}

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

    // Checks an invitation link before the person sets a password
    previewInvitation: (token: string) =>
      request<InvitationPreview>(
        `/api/v1/auth/invitations/${encodeURIComponent(token)}`,
        {},
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

    // Re-checks the password before graduating; send the token as X-Confirmation-Token
    confirmPassword: (password: string) =>
      request<{ confirmation_token: string; expires_at: string }>(
        '/api/v1/auth/confirm-password',
        json('POST', { password })
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

    // Every cohort the caller holds a role in, and which one they last viewed
    myCohorts: () => request<MyCohort[]>('/api/v1/users/me/cohorts'),

    // Graduates only
    graduationCard: () => request<GraduationCard>('/api/v1/users/me/graduation-card'),

    // Alumni only: finished cohorts with frozen results
    alumniHistory: () => request<AlumniCohort[]>('/api/v1/alumni/me/history'),

    setActiveCohort: (body: ActiveCohortRequest) =>
      request<ActiveCohortResponse>('/api/v1/users/me/active-cohort', json('PUT', body)),
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

    graduation: {
      preview: (cohortId: string) =>
        request<GraduationPreview>(`/api/v1/cohorts/${cohortId}/graduation/preview`),

      // Runs the calculation again; nothing is frozen
      refreshPreview: (cohortId: string) =>
        request<GraduationPreview>(`/api/v1/cohorts/${cohortId}/graduation/preview`, {
          method: 'POST',
        }),

      // The confirmed record, once the cohort has graduated
      record: (cohortId: string) =>
        request<GraduationRecord>(`/api/v1/cohorts/${cohortId}/graduation`),

      // Program Lead, with a token from auth.confirmPassword
      graduate: (cohortId: string, confirmationToken: string) =>
        request<GraduationRecord>(`/api/v1/cohorts/${cohortId}/graduate`, {
          method: 'POST',
          headers: { 'X-Confirmation-Token': confirmationToken },
        }),

      sequence: (cohortId: string) =>
        request<GraduationSequenceResponse>(`/api/v1/cohorts/${cohortId}/graduation/sequence`),

      // Every graduate's user id, in reveal order
      setRevealOrder: (cohortId: string, revealOrder: string[]) =>
        request<GraduationSequenceResponse>(
          `/api/v1/cohorts/${cohortId}/graduation/sequence-settings`,
          json('PATCH', { reveal_order: revealOrder })
        ),

      correct: (cohortId: string, body: GraduationCorrectionRequest) =>
        request<GraduationCorrectionResponse>(
          `/api/v1/cohorts/${cohortId}/graduation/corrections`,
          json('POST', body)
        ),

      panel: (cohortId: string) =>
        request<GraduationPanel>(
          `/api/v1/dashboard/program-lead/graduation${qs({ cohort_id: cohortId })}`
        ),
    },

    // Read only from then on; archives the peer mentor assignments
    close: (cohortId: string) =>
      request<CohortResponse>(`/api/v1/cohorts/${cohortId}/close`, { method: 'POST' }),

    // A closed or imported cohort becomes a read-only record
    archive: (cohortId: string) =>
      request<CohortResponse>(`/api/v1/cohorts/${cohortId}/archive`, { method: 'PATCH' }),

    // Every cohort member can read these
    ictTracks: (cohortId: string) =>
      request<IctTrackResponse[]>(`/api/v1/cohorts/${cohortId}/ict-tracks`),

    // Replaces the whole list. Each lead mentor must be an ICT peer mentor in the cohort, and
    // a track mentees have chosen can't be removed. System Admin or Program Lead.
    setIctTracks: (cohortId: string, body: IctTracksRequest) =>
      request<IctTrackResponse[]>(`/api/v1/cohorts/${cohortId}/ict-tracks`, json('PUT', body)),

    // The selection window and the caller's own choice
    trackSelection: (cohortId: string) =>
      request<TrackSelectionResponse>(`/api/v1/cohorts/${cohortId}/ict-track-selection`),

    // While the window is open
    chooseTrack: (cohortId: string, ictTrack: string) =>
      request<TrackSelectionResponse>(
        `/api/v1/cohorts/${cohortId}/ict-track-selection/me`,
        json('PUT', { ict_track: ictTrack })
      ),

    // Both dates null closes it. System Admin or Program Lead.
    setTrackSelectionWindow: (
      cohortId: string,
      body: { opens_at: string | null; closes_at: string | null }
    ) =>
      request<TrackSelectionWindow>(
        `/api/v1/cohorts/${cohortId}/ict-track-selection/window`,
        json('PUT', body)
      ),

    // Sets a mentee's track for them, even after the window closes, with an audit entry
    overrideTrack: (cohortId: string, menteeId: string, body: TrackOverrideRequest) =>
      request<TrackSelectionResponse>(
        `/api/v1/cohorts/${cohortId}/ict-track-selection/${menteeId}`,
        json('PUT', body)
      ),

    // The nine session rating questions, in the order ratings are sent
    ratingQuestions: (cohortId: string) =>
      request<RatingQuestion[]>(`/api/v1/cohorts/${cohortId}/rating-questions`),

    // Nine wordings, in question order. System Admin or Program Lead.
    setRatingQuestions: (cohortId: string, questions: string[]) =>
      request<RatingQuestion[]>(
        `/api/v1/cohorts/${cohortId}/rating-questions`,
        json('PUT', { questions })
      ),

    pointsConfig: (cohortId: string) =>
      request<PointsConfig>(`/api/v1/cohorts/${cohortId}/points-config`),

    // Applies to logs submitted or updated from now on
    setPointsConfig: (cohortId: string, body: PointsConfig) =>
      request<PointsConfig>(`/api/v1/cohorts/${cohortId}/points-config`, json('PUT', body)),

    graduationReport: (cohortId: string) =>
      request<GraduationReportResponse>(`/api/v1/cohorts/${cohortId}/graduation-report`),

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

    // The caller's sessions with an open window, soonest closing first
    inProgress: () => request<InProgressSession[]>('/api/v1/sessions/in-progress'),

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

    // Staff and the session's own mentors only
    feedback: (sessionId: string) =>
      request<SessionFeedbackResponse>(`/api/v1/sessions/${sessionId}/feedback`),

    setResources: (sessionId: string, resources: ResourceIn[]) =>
      request<SessionResponse>(
        `/api/v1/sessions/${sessionId}/resources`,
        json('PATCH', { resources })
      ),

    // The caller's own notes, editable at any time
    myNotes: (sessionId: string) =>
      request<SessionNoteResponse>(`/api/v1/sessions/${sessionId}/notes/me`),

    saveMyNotes: (sessionId: string, body: string) =>
      request<SessionNoteResponse>(`/api/v1/sessions/${sessionId}/notes/me`, json('PUT', { body })),
  },

  attendance: {
    mine: (params?: AttendanceListParams) =>
      request<Page<AttendanceResponse>>(`/api/v1/attendance/me${qs(params)}`),

    submit: (body: AttendanceSubmissionRequest) =>
      request<AttendanceResponse>('/api/v1/attendance', json('POST', body)),

    update: (recordId: string, body: AttendanceUpdateRequest) =>
      request<AttendanceResponse>(`/api/v1/attendance/${recordId}`, json('PATCH', body)),

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

    logScholarship: (body: ScholarshipApplicationRequest) =>
      request<ExtraActivityResponse>('/api/v1/extra-activities/scholarships', json('POST', body)),

    logConsultation: (body: ConsultationSessionRequest) =>
      request<ExtraActivityResponse>('/api/v1/extra-activities/consultations', json('POST', body)),

    update: (activityId: string, body: ActivityUpdateRequest) =>
      request<ExtraActivityResponse>(`/api/v1/extra-activities/${activityId}`, json('PATCH', body)),

    // Removes the points and keeps the record with the reason. System Admin or Program Lead.
    reverse: (activityId: string, body: ActivityReversalRequest) =>
      request<ExtraActivityResponse>(
        `/api/v1/extra-activities/${activityId}/reverse`,
        json('POST', body)
      ),
  },

  // The caller's own facilitator numbers. Peer mentors only.
  facilitator: {
    summary: (cohortId?: string) =>
      request<FacilitatorSummary>(`/api/v1/facilitator/me/summary${qs({ cohort_id: cohortId })}`),

    sessions: (cohortId?: string) =>
      request<FacilitatedSession[]>(
        `/api/v1/facilitator/me/sessions${qs({ cohort_id: cohortId })}`
      ),

    sessionRatings: (sessionId: string) =>
      request<SessionRatings>(`/api/v1/facilitator/me/sessions/${sessionId}/ratings`),

    ratingsOverTime: (cohortId?: string) =>
      request<RatingTrendPoint[]>(
        `/api/v1/facilitator/me/ratings-over-time${qs({ cohort_id: cohortId })}`
      ),

    peerMentorAverage: (cohortId?: string) =>
      request<PeerMentorAverage>(
        `/api/v1/facilitator/peer-mentor-average${qs({ cohort_id: cohortId })}`
      ),

    // What the caller's own 1:1 mentees said about peer mentorship sessions
    peerMentorshipFeedback: (cohortId?: string) =>
      request<SessionRatings[]>(
        `/api/v1/peer-mentor/me/peer-mentorship-feedback${qs({ cohort_id: cohortId })}`
      ),
  },

  consultants: {
    list: () => request<ConsultantResponse[]>('/api/v1/consultants'),

    // System Admin
    create: (body: ConsultantRequest) =>
      request<ConsultantResponse>('/api/v1/consultants', json('POST', body)),

    update: (consultantId: string, body: Partial<ConsultantRequest>) =>
      request<ConsultantResponse>(`/api/v1/consultants/${consultantId}`, json('PATCH', body)),

    // Past consultation logs keep their link
    remove: (consultantId: string) =>
      request<void>(`/api/v1/consultants/${consultantId}`, { method: 'DELETE' }),
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
    // Without a cohort the API picks the peer mentor's newest one
    group: (cohortId?: string | null) =>
      request<GroupOverview>(
        `/api/v1/dashboard/peer-mentor/group${qs({ cohort_id: cohortId ?? undefined })}`
      ),

    mentee: (menteeId: string) =>
      request<MenteeDrilldown>(`/api/v1/dashboard/peer-mentor/mentees/${menteeId}`),

    groupAttendance: (params?: AttendanceListParams) =>
      request<Page<AttendanceResponse>>(`/api/v1/peer-mentors/me/attendance${qs(params)}`),
  },

  mentees: {
    finalStatus: (menteeId: string, cohortId: string) =>
      request<GraduationStatusResponse>(
        `/api/v1/mentees/${menteeId}/graduation-status${qs({ cohort_id: cohortId })}`
      ),

    attendanceRates: (menteeId: string, cohortId: string) =>
      request<AttendanceRateResponse>(
        `/api/v1/mentees/${menteeId}/attendance-rates${qs({ cohort_id: cohortId })}`
      ),
  },

  proMentor: {
    // Sessions the caller leads or co-mentors. Professional mentors only.
    sessions: () =>
      request<SessionAttendanceSummary[]>('/api/v1/dashboard/professional-mentor/sessions'),
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

    // Emails that failed after every retry, with the last error. Admin only.
    failed: (params?: PageParams) =>
      request<Page<AdminNotificationResponse>>(`/api/v1/notifications/failed${qs(params)}`),

    broadcast: (body: BroadcastRequest) =>
      request<BroadcastResponse>('/api/v1/notifications/broadcast', json('POST', body)),

    markAllRead: () =>
      request<MarkAllReadResponse>('/api/v1/notifications/read-all', json('PATCH', {})),
  },

  objectives: {
    mine: (cohortId: string) =>
      request<ObjectiveResponse[]>(`/api/v1/objectives/me${qs({ cohort_id: cohortId })}`),

    windows: (cohortId: string) =>
      request<ObjectiveWindowsResponse>(`/api/v1/objectives/windows${qs({ cohort_id: cohortId })}`),

    // A mentee's objectives, for their peer mentor and staff
    forMentee: (menteeId: string, cohortId: string) =>
      request<ObjectiveResponse[]>(
        `/api/v1/mentees/${menteeId}/objectives${qs({ cohort_id: cohortId })}`
      ),

    create: (body: ObjectiveCreateRequest) =>
      request<ObjectiveResponse>('/api/v1/objectives', json('POST', body)),

    update: (objectiveId: string, body: ObjectiveUpdateRequest) =>
      request<ObjectiveResponse>(`/api/v1/objectives/${objectiveId}`, json('PATCH', body)),

    // While that rating point's window is open
    rate: (objectiveId: string, body: ObjectiveRatingRequest) =>
      request<ObjectiveResponse>(`/api/v1/objectives/${objectiveId}/ratings`, json('POST', body)),
  },

  leaderboard: {
    dimension: (cohortId: string, dimension: LeaderboardDimension) =>
      request<DimensionRankingResponse>(`/api/v1/cohorts/${cohortId}/leaderboard/${dimension}`),

    full: (cohortId: string) =>
      request<LeaderboardResponse>(`/api/v1/cohorts/${cohortId}/leaderboard`),

    // Peer mentors and staff
    peerMentors: (cohortId: string, rankedBy: PeerMentorDimension) =>
      request<PeerMentorLeaderboardResponse>(
        `/api/v1/cohorts/${cohortId}/leaderboard/peer-mentors${qs({ ranked_by: rankedBy })}`
      ),

    snapshots: (cohortId: string) =>
      request<LeaderboardSnapshotResponse[]>(`/api/v1/cohorts/${cohortId}/leaderboard/snapshots`),

    // System Admin or Program Lead
    takeSnapshot: (cohortId: string) =>
      request<LeaderboardSnapshotResponse[]>(`/api/v1/cohorts/${cohortId}/leaderboard/snapshots`, {
        method: 'POST',
      }),

    // Committee of the cohort
    exportCsv: (cohortId: string) => requestCsv(`/api/v1/cohorts/${cohortId}/leaderboard/export`),
  },

  analytics: {
    attendanceTrends: (cohortId: string) =>
      request<AttendanceTrendResponse>(`/api/v1/analytics/cohorts/${cohortId}/attendance-trends`),

    trackPerformance: (cohortId: string) =>
      request<TrackPerformanceResponse>(`/api/v1/analytics/cohorts/${cohortId}/track-performance`),

    sessionQuality: (cohortId: string) =>
      request<SessionQualityResponse>(`/api/v1/analytics/cohorts/${cohortId}/session-quality`),

    activities: (cohortId: string) =>
      request<ActivityEngagementResponse>(`/api/v1/analytics/cohorts/${cohortId}/extra-activities`),

    // cohort_ids repeats once per cohort
    crossCohort: (cohortIds: string[]) =>
      request<CrossCohortResponse>(
        `/api/v1/analytics/cross-cohort?${cohortIds
          .map((id) => `cohort_ids=${encodeURIComponent(id)}`)
          .join('&')}`
      ),
  },

  exports: {
    attendance: (cohortId: string) => requestCsv(`/api/v1/exports/attendance/${cohortId}`, 'POST'),
    fullReport: (cohortId: string) => requestCsv(`/api/v1/exports/full-report/${cohortId}`, 'POST'),
    leaderboard: (cohortId: string, board: LeaderboardKind = 'mentee') =>
      requestCsv(`/api/v1/exports/leaderboard/${cohortId}${qs({ board })}`, 'POST'),
  },
}
