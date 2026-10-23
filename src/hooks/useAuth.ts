'use client'

// =============================================================================
// useAuth — Authentication context and hook
// Provides auth state globally. <AuthProvider> is mounted in src/app/providers.tsx.
// AuthContext is exported only so Storybook can provide a mocked value.
// =============================================================================

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import { createElement } from 'react'
import type { ReactNode } from 'react'
import { api, tokenStore } from '@/lib/api'
import type { UserProfileResponse } from '@/types/auth'
import { ApiError } from '@/types/auth'

// -----------------------------------------------------------------------------
// State shape
// -----------------------------------------------------------------------------

interface AuthState {
  user: UserProfileResponse | null
  isLoading: boolean
  error: string | null
}

type AuthAction =
  | { type: 'LOADING' }
  | { type: 'SET_USER'; user: UserProfileResponse }
  | { type: 'CLEAR_USER' }
  | { type: 'ERROR'; message: string }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: true, error: null }
    case 'SET_USER':
      return { user: action.user, isLoading: false, error: null }
    case 'CLEAR_USER':
      return { user: null, isLoading: false, error: null }
    case 'ERROR':
      return { ...state, isLoading: false, error: action.message }
  }
}

// -----------------------------------------------------------------------------
// Context
// -----------------------------------------------------------------------------

export interface AuthContextValue {
  user: UserProfileResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

// -----------------------------------------------------------------------------
// Provider
// -----------------------------------------------------------------------------

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    error: null,
  })

  // On mount: if a token exists, fetch the current user to restore session
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
      const message = err instanceof ApiError ? err.body.error : 'Login failed. Please try again.'
      dispatch({ type: 'ERROR', message })
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    const refresh = tokenStore.getRefresh()
    try {
      await api.auth.logout(refresh ?? undefined)
    } catch {
      // Logout best-effort — clear locally regardless
    }
    tokenStore.clear()
    dispatch({ type: 'CLEAR_USER' })
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
      login,
      logout,
      clearError,
    }),
    [state, login, logout, clearError]
  )

  return createElement(AuthContext.Provider, { value }, children)
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
