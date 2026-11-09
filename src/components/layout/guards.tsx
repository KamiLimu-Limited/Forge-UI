'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/Spinner'
import { ADMIN_ROLES, hasRole, homeFor, userRoleLabel } from '@/lib/roles'
import type { UserRole } from '@/types/auth'
import { NoAccessScreen } from '@/views/NoAccessScreen'

interface GuardProps {
  children: ReactNode
}

function FullScreenSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Spinner size="lg" />
    </div>
  )
}

// Where a signed-out visitor goes: the cover page after signing out, otherwise sign in
function signedOutHome(hasSignedOut: boolean): string {
  return hasSignedOut ? '/' : '/login'
}

// Sends signed-out visitors to sign in, or to the cover page if they just signed out
export function RequireAuth({ children }: GuardProps) {
  const { isAuthenticated, isLoading, hasSignedOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace(signedOutHome(hasSignedOut))
  }, [isLoading, isAuthenticated, hasSignedOut, router])

  if (isLoading || !isAuthenticated) return <FullScreenSpinner />
  return <>{children}</>
}

// Sends signed-in users away from the auth screens
export function RedirectIfAuthed({ children }: GuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/dashboard')
  }, [isLoading, isAuthenticated, router])

  if (isLoading || isAuthenticated) return <FullScreenSpinner />
  return <>{children}</>
}

interface RequireRoleProps extends GuardProps {
  roles: UserRole[]
  // Who the area is for, as it reads after "It's for", such as "the System Admin"
  area: string
}

// Requires a signed-in user holding one of `roles`. Anyone else sees No access with a way
// back to their own home, instead of being moved somewhere without a word.
export function RequireRole({ roles, area, children }: RequireRoleProps) {
  const { user, isAuthenticated, isLoading, hasSignedOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace(signedOutHome(hasSignedOut))
  }, [isLoading, isAuthenticated, hasSignedOut, router])

  if (isLoading || !isAuthenticated || !user) return <FullScreenSpinner />
  if (!hasRole(user, roles)) {
    return (
      <NoAccessScreen
        area={area}
        fullName={`${user.first_name} ${user.last_name}`.trim()}
        roleLabel={userRoleLabel(user)}
        homeHref={homeFor(user)}
      />
    )
  }
  return <>{children}</>
}

// The admin screens, for the System Admin and the Program Lead
export function RequireAdmin({ children }: GuardProps) {
  return (
    <RequireRole roles={ADMIN_ROLES} area="the System Admin">
      {children}
    </RequireRole>
  )
}
