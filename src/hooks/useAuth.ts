'use client'

// Provides auth state globally. <AuthProvider> is mounted in src/app/providers.tsx.
// AuthContext is exported only so Storybook can provide a mocked value.

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import { createElement } from 'react'
import type { ReactNode } from 'react'
import { api, tokenStore } from '@/lib/api'
import type { UserProfileResponse } from '@/types/auth'
import { ApiError } from '@/types/auth'

interface AuthState {
  user: UserProfileResponse | null
  isLoading: boolean
  error: string | null
  // True after the user signs out on purpose, so the guards send them to the cover page
  // rather than to sign in
  hasSignedOut: boolean
}

type AuthAction =
  | { type: 'LOADING' }
  | { type: 'SET_USER'; user: UserProfileResponse }
  | { type: 'CLEAR_USER' }
  | { type: 'SIGNED_OUT' }
  | { type: 'ERROR'; message: string }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: true, error: null }
    case 'SET_USER':
      return { user: action.user, isLoading: false, error: null, hasSignedOut: false }
    case 'CLEAR_USER':
      return { user: null, isLoading: false, error: null, hasSignedOut: false }
    case 'SIGNED_OUT':
      return { user: null, isLoading: false, error: null, hasSignedOut: true }
    case 'ERROR':
      return { ...state, isLoading: false, error: action.message }
  }
}

export interface AuthContextValue {
  user: UserProfileResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  // True after a deliberate sign out
  hasSignedOut: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    error: null,
    hasSignedOut: false,
  })

  useEffect(() => {
    const token = tokenStore.getAccess()
    if (!token) {
      dispatch({ type: 'CLEAR_USER' })
      return
    }
    api.users
      .getMe()
      .then((user) => dispatch({ type: 'SET_USER', user }))
      .catch(() => {
        tokenStore.clear()
        dispatch({ type: 'CLEAR_USER' })
      })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'LOADING' })
    try {
      const tokens = await api.auth.login({ email, password })
      tokenStore.set(tokens.access_token, tokens.refresh_token)
      const user = await api.users.getMe()
      dispatch({ type: 'SET_USER', user })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Login failed. Please try again.'
      dispatch({ type: 'ERROR', message })
      throw err
    }
  }, [])

  // Clears locally before telling the API, so a slow or failed revoke can never
  // leave the session signed in on this device
  const logout = useCallback(async () => {
    const access = tokenStore.getAccess()
    const refresh = tokenStore.getRefresh() ?? undefined
    tokenStore.clear()
    dispatch({ type: 'CLEAR_USER' })
    if (!access) return
    try {
      await api.auth.logout(access, refresh)
    } catch (err) {
      // An expired access token can't authorize the revoke: rotate once and revoke the new pair
      if (!refresh || !(err instanceof ApiError) || err.status !== 401) return
      try {
        const tokens = await api.auth.refresh({ refresh_token: refresh })
        await api.auth.logout(tokens.access_token, tokens.refresh_token)
      } catch {
        // Best effort once local state is gone
      }
    }
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: 'ERROR', message: '' })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      isAuthenticated: state.user !== null,
      isLoading: state.isLoading,
      error: state.error,
      hasSignedOut: state.hasSignedOut,
      login,
      logout,
      clearError,
    }),
    [state, login, logout, clearError]
  )

  return createElement(AuthContext.Provider, { value }, children)
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
