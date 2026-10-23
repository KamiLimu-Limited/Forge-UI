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
} from '@/types/auth'
import { ApiError } from '@/types/auth'
import type {
  PaginatedResponse,
  AdminUserListResponse,
  AdminUserDetailResponse,
  AdminUserUpdateRequest,
} from '@/types/admin'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

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

let isRefreshing = false
let refreshSubscribers: Array<(token: string) => Promise<void>> = []

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => void cb(token))
  refreshSubscribers = []
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  authenticated = true
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (authenticated) {
    const token = tokenStore.getAccess()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  // Attempt token refresh on 401
  if (res.status === 401 && authenticated) {
    const refresh = tokenStore.getRefresh()
    if (!refresh) {
      tokenStore.clear()
      window.location.replace('/login')
      throw new ApiError(401, { success: false, error: 'Session expired' })
    }

    if (!isRefreshing) {
      isRefreshing = true
      try {
        const refreshed = await api.auth.refresh({ refresh_token: refresh })
        tokenStore.set(refreshed.access_token, refreshed.refresh_token)
        onTokenRefreshed(refreshed.access_token)
      } catch {
        tokenStore.clear()
        window.location.replace('/login')
        throw new ApiError(401, { success: false, error: 'Session expired' })
      } finally {
        isRefreshing = false
      }
    }

    // Wait for the refresh then retry
    return new Promise((resolve, reject) => {
      refreshSubscribers.push(async (newToken: string) => {
        try {
          headers['Authorization'] = `Bearer ${newToken}`
          const retried = await fetch(`${BASE_URL}${path}`, { ...options, headers })
          if (!retried.ok) {
            const body = (await retried.json()) as ErrorResponse
            reject(new ApiError(retried.status, body))
          } else {
            resolve((await retried.json()) as T)
          }
        } catch (err) {
          reject(err)
        }
      })
    })
  }

  if (!res.ok) {
    const body = (await res.json()) as ErrorResponse
    throw new ApiError(res.status, body)
  }

  return res.json() as Promise<T>
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

    logout: (refreshToken?: string) => {
      const query = refreshToken ? `?refresh_token=${encodeURIComponent(refreshToken)}` : ''
      return request<SuccessResponse>(`/api/v1/auth/logout${query}`, { method: 'POST' })
    },

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
      request<SuccessResponse>('/api/v1/auth/invite', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    bulkInvite: (body: BulkInviteRequest) =>
      request<BulkInviteResponse>('/api/v1/auth/bulk-invite', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
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
      list: (params?: { page?: number; page_size?: number; account_state?: string | null }) => {
        const query = new URLSearchParams()
        if (params?.page !== undefined) query.set('page', String(params.page))
        if (params?.page_size !== undefined) query.set('page_size', String(params.page_size))
        if (params?.account_state) query.set('account_state', params.account_state)
        const qs = query.toString()
        return request<PaginatedResponse<AdminUserListResponse>>(
          `/api/v1/admin/users${qs ? `?${qs}` : ''}`
        )
      },

      getById: (userId: string) =>
        request<AdminUserDetailResponse>(`/api/v1/admin/users/${userId}`),

      update: (userId: string, body: AdminUserUpdateRequest) =>
        request<AdminUserDetailResponse>(`/api/v1/admin/users/${userId}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        }),

      suspend: (userId: string) =>
        request<SuccessResponse>(`/api/v1/admin/users/${userId}/suspend`, { method: 'POST' }),

      activate: (userId: string) =>
        request<SuccessResponse>(`/api/v1/admin/users/${userId}/activate`, { method: 'POST' }),
    },
  },
}
