import { useMemo, type ReactNode } from 'react'
import { AuthContext, type AuthContextValue } from '../src/hooks/useAuth'
import type { UserProfileResponse } from '../src/types/auth'

interface MockAuthProviderProps {
  user: UserProfileResponse | null
  // Optional so preview.ts can pass children as a createElement argument
  children?: ReactNode
}

// Provides a fixed auth state so components that call useAuth() render in Storybook
export function MockAuthProvider({ user, children }: MockAuthProviderProps) {
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading: false,
      error: null,
      login: () => Promise.resolve(),
      logout: () => Promise.resolve(),
      clearError: () => undefined,
    }),
    [user]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
